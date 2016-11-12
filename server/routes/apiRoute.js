"use strict"

const Joi = require('joi');

module.exports = function (controller) {
    return [
        {
            method: 'GET',
            path: '/api/stock/{stock_id}',
            config: {
                handler: function(request, reply)
                {
                    controller.getStock(request.params.stock_id).then(function(stock) {
                        let response = {
                            stock_id: stock.stock_id,
                            price: stock.price
                        };

                        reply(response);
                    }).catch(function(err) {
                        console.log(err);
                    });

                },
                description: 'Get stock by id',
                notes: 'Returns a stock by id',
                tags: ['api'],
                validate: {
                    params: {
                        stock_id: Joi.string()
                            .required()
                            .description('stock id'),
                    }
                }
            }
        },
        {
            method: 'GET',
            path: '/api/stock/save/{stock_id}/{price}',
            config: {
                handler: function(request, reply)
                {
                    controller.saveStock(request.params.stock_id, request.params.price)
                        .then(function(stock) {
                            let response = {
                                stock_id: stock.stock_id,
                                price: stock.price
                            };

                            reply(response);
                        })
                        .catch(function(err) {
                            console.log(err);
                        });
                },
                description: 'Update stock price',
                notes: 'Updates the stock price',
                tags: ['api'],
                validate: {
                    params: {
                        stock_id: Joi.string()
                            .required()
                            .description('stock id'),
                        price: Joi.number()
                            .required()
                            .min(500)
                            .max(10000)
                            .description('price must a number between 500 and 10000'),
                    }
                }
            }
        }
    ];
};
