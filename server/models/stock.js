"use strict"

const Mongoose = require('mongoose');
Mongoose.Promise = require('bluebird');

module.exports = function (server) {
    let db = server.db;

    var stockSchema = new Mongoose.Schema({
        stock_id : { type: String, required: true, trim: true },
        price: { type: Number, required: true, trim: true }
    });

    return db.model('stock', stockSchema);
};
