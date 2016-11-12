"use strict"

module.exports = function (controller) {

    return [
        {
            method: 'GET',
            path: '/',
            handler: function (request, reply) {
                reply.view('default/index');
            }
        },
        {
            method: 'GET',
            path: '/{name}',
            handler: function (request, reply) {
                reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
            }
        }
    ];
};