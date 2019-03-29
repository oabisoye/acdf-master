/**
 * == Entries ==
 * - user_name
 * - screen_name
 * - profession
 * - email
 * - image_link
 * - created_at
 * - updated_at
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
    user_name: String,
    screen_name: String,
    profession: String,
    email: String,
    image_link: String,
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
    views: [{ type: Schema.Types.ObjectId, ref: 'View' }],
    created_at: { type: Date, required: true, default: Date.now },
    updated_at: { type: Date, required: true, default: Date.now }
});

entrySchema.pre('save', next => {
    // get the current date
    const currentDate = new Date();

    // change the updated_at field to current date
    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at) {
        this.created_at = currentDate;
    }

    next();
});

module.exports = mongoose.model('Entry', entrySchema);
