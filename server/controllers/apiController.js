"use strict"

module.exports = function (server) {

    let api = {};

    api.getStock = function(stock_id) {
        return server.models.stock.findOne({stock_id: stock_id}).exec();
    };

    api.saveStock = function(stock_id, price) {
        var promise = server.models.stock.findOneAndUpdate(
            { stock_id : stock_id},
            { price: price },
            { upsert: true }
        ).exec();

        return promise;
    };

    return api;
};
