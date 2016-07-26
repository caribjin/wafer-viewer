// var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
// var MongoServer = require('mongodb').Server;
// var Db = require('mongodb').Db;
// var path = require('path');
var mongoose = require('mongoose');
var _ = require('lodash');
//mongoose.Promise = require('bluebird');

// // var Promise = require('bluebird');
// Promise.promisifyAll(mongoose);

// var recursive = require('recursive-readdir');
var requireDirectory = require('require-directory');

var endMongoConnection = function() {
	mongoose.connection.close(function() {
		process.exit(0);
	});
};

/**
 * collections 하위에 있는 모든 Collection 생성
 * @param {mongodb.Db} _db dbConnection
 * @param {Object} [_config] config
 * @returns {Object} modelMap
 */
function initCollections(_db, _config) {
	var collections = requireDirectory(module, './collections');
	var models = {};

	_.each(collections, function(_scheme, _modelName) {
		models[_modelName] = mongoose.model(_modelName, _scheme);
	});

	return models;
}

function initAdmin(models) {
	models.User.find({'profile.name': 'admin'}, function(_err, _docs) {
		if (_docs.length == 0) {
			models.User.create({
				_id: ObjectID(),
				profile: {
					name: 'admin',
					password: 'n3n1004',
					mobile: '',
					email: '',
					memberType: 'mapper'
				},
				createdAt: new Date(),
				status: {
					online: false
				}
			});
		}
	});
}

module.exports = function(_app, _config) {
	mongoose.connect(_config.database.url);

	var db = mongoose.connection;
	console.log('Connected to mongo server: ' + _config.database.url);

	var models = initCollections(db);

	initAdmin(models);

	process.on('SIGINT', endMongoConnection).on('SIGTERM', endMongoConnection);

	console.log('DB Connection Successful!');

	db.on('error', function(_msg) {
		console.error('connection error:' + _msg);
	});
	// db.once('open', function() {
	//
	// });
};
