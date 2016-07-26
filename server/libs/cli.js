#!/usr/bin/env node

var cmd = require('commander');
var http = require('http');
var server = require('../app');
var logger = require('./logger');
var configure = require('./configure');
var config;

cmd
	.version('0.0.1')
	.option('-c, --conf [config]', 'set config file', '../config/default.conf')
	.option('-p, --port [port]', 'set port number')
	.option('--host [host address]', 'set host address')
	.option('--database [url]', 'set database url')
	.parse(process.argv);

try {
	if (cmd.conf) {
		config = configure.set(cmd).get();
		logger.setup(config);
	} else {
		console.error('please make sure config file.');
		process.exit(1);
	}
} catch (err) {
	console.log(err.message, err.stack);
	process.exit(1);
}

var app = server(config, logger);

app.server.listen(config.listen.port, config.listen.bind, function() {
	console.log('Express: listening port: ', config.listen.bind + ':' + config.listen.port);
}).on('error', function(err) {
	console.log('cannot create server: %s', err.message);
	process.exit(2);
});
