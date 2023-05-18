"use strict";

const express       = require('express');

module.exports = (app) => {
    let _router = express.Router();

    _router.get('/', async(req, res, next) => {
        return res.status(200);
    });
    app.use('/', _router);
}