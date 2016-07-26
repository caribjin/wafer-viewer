var express = require('express');
var http = require('http');
var path = require('path');
var app;

module.exports = function(config, logger) {
	if (app) {
		return app;
	}

	app = express();
	app.server = http.createServer(app);

	require('./models')(app, config, logger);
	require('./libs/appConfig')(app, config, logger);
	require('./controllers/api')(app, config, logger);
	require('./controllers/index')(app, config, logger);

	return app;
};