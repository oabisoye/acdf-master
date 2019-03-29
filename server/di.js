const di = require('./libs/service-locator');

const config = require('./config');
const entryModel = require('./db/models/entry');
const likeModel = require('./db/models/like');
const viewModel = require('./db/models/view');
const EntryService = require('./services/entry');
const MailService = require('./services/mail');
const ApiController = require('./controllers/api');
const GalleryController = require('./controllers/gallery');

di.register('mailService', () => new MailService(config));
di.register('entryService', () => new EntryService(config, entryModel, likeModel, viewModel, di.get('mailService')));
di.register('apiController', () => new ApiController(config, di.get('entryService')));
di.register('galleryController', () => new GalleryController(config, di.get('entryService')));

module.exports = di;
