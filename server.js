'use strict';

require('dotenv').config();
const path = require('path');
const express = require('express');
const cons = require('consolidate');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./server/config');

mongoose.connect(config.mongodb.uri);

const di = require('./server/di');

const app = express();

app.engine('hbs', cons.handlebars);

app.set('view engine', 'hbs');
app.set('views', __dirname + '/server/views');

const forceSSL = function() {
    return function (req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(
                ['https://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
};
// Instruct the app
// to use the forceSSL
// middleware
if (process.env.NODE_ENV === 'production') {
    app.use(forceSSL());
}

// Store the user IP address in res.locals
app.use((req, res, next) => {
    res.locals.userIp = require('request-ip').getClientIp(req);
    next();
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'build')));

app.use('/api', require('./server/routes/api'));
app.use('/gallery', require('./server/routes/gallery'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build/index.html'));
});

const port = process.env.PORT || 8081;
const server = app.listen(port, () => {
    console.log('Server is now running.', port);
});

module.exports = server;
