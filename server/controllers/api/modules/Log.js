//var app  = require('../../app')();
var fs = require('fs');
var logger = require('../../../libs/logger');
var path = require('path');
var _ = require('lodash');

var watchList = {};
module.exports = {
	'log.query': function(_query, _callback) {
		try {
			var query = {
				from: (+new Date()) - 24 * 60 * 60 * 1000,
				until: +new Date(),
				limit: 2147483648,
				start: 0,
				order: 'desc',
				//fields: [],
				server: ''
			};

			query = _.merge(query, _query);

			var _logger = logger.getAgent(query.server);
			var logfile = path.join(_logger.transports.file.dirname, _logger.transports.file.filename);
			_logger.query(query, function(err, results) {
				if (err) {
					throw err;
				}
				_callback(results.file);
			});
		} catch (e) {
			console.log(e.message, e.stack);
		}
	},
	
	'log.list': function(_query, _callback) {
		var lists = logger._agentList;
		var results = [];
		_.each(lists, function(logger, name) {
			results.push({name: name, isAlive: !!logger._isAlive});
		});
		_callback(results);
	}
};