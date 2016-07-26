var http = require('http');
var app = require('../../app')();
var DDPServer = require('nuxjs/server/DDPServer');

var _ = require('lodash');

module.exports = function(_methods) {
	var server = new DDPServer({httpServer: app.server, port: 9091});

	console.log('DDPServer initialize!!');

	_.each(_methods, function(_apis, _name) {
		server.methods(_apis);
	});
};