'use strict';

const Hapi = require('hapi');
const Config = require('config');
const Good = require('good');
const Path = require('path');
const Inert = require('inert');
const Hoek = require('hoek');
const Joi = require('joi');
const HapiSwagger = require('hapi-swagger');
const Mongoose = require('mongoose');

const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

// mongo db connection
Mongoose.connect(Config.mongoose.uri);
Mongoose.Promise = require('bluebird');
server.db = Mongoose.connection;
server.db.on('error', console.error.bind(console, 'connection error:'));
server.db.once('open', function() {
    console.log("connected to mongo", Config.mongoose.uri);
});

server.connection({ port: Config.app.port });

// set up static
server.register(Inert, () => {});

// swagger
server.register({
    'register': HapiSwagger,
    'options': {
        info: {
            'title': Config.api.title,
            'version': Config.api.version,
        }
    }
});

// set up handlebars
server.register(require('vision'), (err) => {
    Hoek.assert(!err, err);
    server.views({
        engines: {
            hbs: {
                module: require('handlebars'),
                compileMode: 'sync'
            }
        },
        compileMode: 'async',
        layout: true,
        relativeTo: __dirname,
        path: './server/views/modules',
        layoutPath: './server/views/layouts',
        helpersPath: './server/views/helpers',
        partialsPath: './server/views/partials'
    });
});

// load modules
server.modules = {};
Config.modules.forEach(function(module) {
    let controller = require('./server/controllers/' + module + 'Controller.js')(server);
    let route = require("./server/routes/" + module + "Route.js")(controller);

    console.log("Loading module", module);

    server.modules[module] = {
        controller: controller,
        route: route
    };

    server.modules[module].route.forEach(function(route) {
        server.route(route);
    });
});

// load models
server.models = {};
Config.models.forEach(function(model) {
    console.log("Loading model", model)
    server.models[model] = require('./server/models/' + model + '.js')(server);
});

// static route
server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory :{
            path : Path.join(__dirname, 'public'),
            index: false
        }
    }
});

server.start((err) => {
        if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

