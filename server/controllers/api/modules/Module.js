var request = require('request');
var config = require('../../../libs/configure').get();
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Module = mongoose.model('Module');
var npm = config.npm.repository;

module.exports = {
	'module.create': function(_info, _callback) {
		Module.create({
			_id: ObjectID(),
			name: "hahaha",
			createdAt: new Date()
		}, function(_error, _profile) {
			_callback();
		});
	},

	'module.update': function(_info, _callback) {
		console.log('module update');
		_callback({});
	},

	'module.list': function(_query, _callback) {
		var key = _query.key;
		var url = npm + '/-/search/' + (key ? key : '');

		request(url, function(err, res, body) {
			_callback({
				success: (true),
				result: JSON.parse(body)
			});
		});
	},

	'module.readme': function(_module, _callback) {
		//var url = npm+'/-/readme/' + encodeURIComponent(_module._id);
		var module = (_module.type ? ('@' + _module.type) + '/' : '') + _module.name;
		var url = npm + '/-/readme/' + encodeURIComponent(module) + '/' + _module.version;
		console.info(url);

		//var url = 'http://npm.dev.n3n.io/-/readme/%40module%2Freport/0.0.1';
		//var url = 'http://npm.dev.n3n.io/-/readme/%40player%2Fchart%400.0.1

		request(url, function(err, res, body) {
			_callback({
				success: (true),
				result: body
			});
		});
	}
};