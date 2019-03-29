const di = require('../libs/service-locator');
const express = require('express');
const router = express.Router();

router.get('/:id', (req, res) => di.get('galleryController').renderGalleryImage(req, res));

module.exports = router;
