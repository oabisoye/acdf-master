const di = require('../libs/service-locator');
const express = require('express');
const router = express.Router();

// define the save route
router.post('/save', (req, res) => di.get('apiController').saveEntry(req, res));

// define the get entries route
router.get('/entries', (req, res) => di.get('apiController').getEntries(req, res));

// handles recording an entry like
router.post('/like', (req, res) => di.get('apiController').likeEntry(req, res));

// handles recording an entry unlike
router.post('/unlike', (req, res) => di.get('apiController').unlikeEntry(req, res));

// handles recording an entry view
router.post('/view', (req, res) => di.get('apiController').viewEntry(req, res));

// define the search entries route
router.get('/search/entries', (req, res) => di.get('apiController').searchEntries(req, res));

module.exports = router;