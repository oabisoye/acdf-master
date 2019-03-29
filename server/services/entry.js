const slug = require('slug');
const uniqueId = require('uniqid');
const AWS = require('aws-sdk');

class EntryService {
    constructor(config, entryModel, likeModel, viewModel, mailService) {
        this.config = config;
        this.model = entryModel;
        this.likeModel = likeModel;
        this.viewModel = viewModel;
        this.mailService = mailService;

        AWS.config.region = config.aws.region;
        this.s3Bucket = new AWS.S3({
            Bucket: config.aws.bucketName
        });
    }

    /**
     * Get all entries, sorted by newest entry
     * @param userIp
     * @returns {Promise}
     */
    getEntries(userIp) {
        return new Promise((resolve, reject) => {
            this.model.find({}, null, {sort: {updated_at: -1}}).populate('likes').exec((err, entries) => {
                if (err) return reject(err);

                // if the user ip was provided, check if the user has liked the entry
                // by filtering the likes array for any like with the user ip equal to the provided one
                if (userIp) {
                    entries = entries.map(entry => {
                        // Convert the mongoose document to a plain object
                        // so that we can modify it
                        let _entry = entry.toObject();

                        _entry.hasLiked = !!_entry.likes.filter(like => like.user_ip === userIp).length;
                        return _entry;
                    });
                }
                return resolve(entries);
            });
        });
    }

    getEntryById(id) {
        return new Promise((resolve, reject) => {
            try{
                this.model.findById(id, (err, entry) => {
                    if (err) return reject(err);

                    console.log(entry);
                    return resolve(entry);
                });
            } catch (err) {
                console.log(err);
                return reject(err);
            }
        });
    }

    searchEntries(id, term) {
        return this.getEntries(id).then(entries => {
            if (term) {
                return entries.filter(entry => new RegExp(term, 'i').test(entry.user_name) || new RegExp(term, 'i').test(entry.email) || new RegExp(term, 'i').test(entry.screen_name));
            }
            return entries;
        });
    }

    /**
     * Save a new entry based on the provided data
     * @param data
     * @returns {Promise}
     */
    saveEntry(data) {

        let buf = new Buffer(data.image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

        const uniqId = uniqueId();
        const imageName = `${slug(data.userEmail)}_${uniqId}.jpg`;

        const imageData = {
            Bucket: this.config.aws.bucketName,
            Key: imageName,
            Body: buf,
            ContentEncoding: 'base64',
            ContentType: 'image/jpeg',
            ACL: 'public-read'
        };

        return new Promise((resolve, reject) => {
            return this.s3Bucket.putObject(imageData, (err, s3Response) => {
                if (err) {
                    console.log(err);
                    console.log('Error uploading data: ', s3Response);
                    return reject(err);
                } else {
                    console.log('Successfully uploaded the image!');

                    // Save to the mongodb
                    const entry = new this.model({
                        id: uniqId,
                        user_name: data.userName,
                        screen_name: data.userScreenName,
                        profession: data.userProfession,
                        email: data.userEmail,
                        image_link: imageName,
                    });

                    entry.save((err, entry) => {
                        if (err) {
                            console.error('Error saving entry', err);
                            return reject(err);
                        }

                        // Send the collage mail to the user
                        this.mailService.sendCollageMail({
                            name: data.userName,
                            email: data.userEmail
                        }, entry._id);

                        console.log('Entry saved successfully.');
                        return resolve(entry);
                    });
                }
            });
        });
    }

    likeEntry(entryId, ipAddress) {
        return new Promise((resolve, reject) => {
            // Check if a like has been recorded for the current ip and entry
            this.likeModel.findOne({ _entry: entryId, user_ip: ipAddress }, (err, _like) => {
                if(!_like) {
                    // If no record exists, add a new record
                    const like = new this.likeModel({
                        _entry: entryId,
                        user_ip: ipAddress
                    });

                    // Save the new like record
                    like.save((err, like) => {
                        if (err && err.code !== 11000) {
                            console.error('Error saving like', err, err.code);
                            return reject(err);
                        }

                        console.log('Like saved successfully.');
                        if (like) {
                            this.model.findById(entryId, (err, entry) => {
                                // Add the like record to the entry record as well
                                entry.likes.addToSet(like._id);
                                entry.save(() => {
                                    console.log('Like added to entry.');
                                });
                            });

                            return resolve(like);
                        } else {
                            return reject(new Error('Like not found.'));
                        }
                    });
                } else return resolve(_like); // if a record exists, just return it.
            });
        });
    }

    viewEntry(entryId, ipAddress) {
        return new Promise((resolve, reject) => {
            // Check if a view has been recorded for the current ip and entry
            this.viewModel.findOne({ _entry: entryId, user_ip: ipAddress }, (err, _view) => {
                if(!_view) {
                    // If no record exists, add a new record
                    const newView = new this.viewModel({
                        _entry: entryId,
                        user_ip: ipAddress
                    });

                    // Save the new view record
                    newView.save((err, view) => {
                        if (err && err.code !== 11000) {
                            console.error('Error saving view', err, err.code);
                            return reject(err);
                        }

                        console.log('View saved successfully.');
                        if (view) {
                            this.model.findById(entryId, (err, entry) => {
                                // Add the view record to the entry record as well
                                entry.views.addToSet(view._id);
                                entry.save(() => {
                                    console.log('View added to entry.');
                                });
                            });

                            return resolve(view);
                        } else {
                            return reject(new Error('View not found.'));
                        }
                    });
                } else return resolve(_view); // if a record exists, just return it.
            });
        });
    }

    unlikeEntry(entryId, ipAddress) {
        return new Promise((resolve, reject) => {
            // Check if a like has been recorded for the current ip and entry
            this.likeModel.findOne({ _entry: entryId, user_ip: ipAddress }, (err, _like) => {
                if(_like) {
                    // If no record exists, delete it
                    this.likeModel.deleteOne({
                        _entry: entryId,
                        user_ip: ipAddress
                    }, (err) => {
                        this.model.findById(entryId, (err, entry) => {
                            // Add the like record to the entry record as well
                            entry.likes.pull(_like._id);
                            entry.save(() => {
                                console.log('Like removed from entry.');
                            });
                        });
                        return resolve(null);
                    });
                } else return resolve(null); // if record does not exist, just return it.
            });
        });
    }
}

module.exports = EntryService;