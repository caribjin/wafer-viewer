/**
 * Created by YoungJin, Lim on 2016. 5. 12..
 */
var adpconn = require('../adpconn');
var forEach = require('lodash/forEach');
var mongoose = require('mongoose');
var ObjectADP = mongoose.model('Objects');
var shortid = require('shortid');
var logger = require('../../../libs/logger');

module.exports = {
	/**
	 * Object List
	 * @param param {object}
	 * {
	 *  databasekey: 2,           // siteId
	 *  searchtest: 'something'   // search key
	 * }
	 * @param callback {function}   callback function
	 */
	'object.read': function(param, callback) {
		ObjectADP.find({}, {}).lean().exec(function(err, list) {
			console.log('object.read');

			callback({
				success: true,
				body: list
			});
		});
	},

	'object.save': function(param, callback) {
		var objects = param.objects;
		var error = null;

		objects.forEach(function(object) {
			ObjectADP.update({
				_id: object._id
			}, {
				objectId: object.objectId,
				objectType: object.objectType,
				position: object.position,
				zoomLevel: object.zoomLevel,
				children: object.children
			}, {
				upsert: true
			}, function(err, object) {
				error = err;
			});
		});

		callback({
			success: (error ? false : true),
			message: (error ? 'ADP SERVER ERROR: Object position update failed' : '')
		});
	},

	'object.remove': function(param, callback) {
		var objects = param.objects;
		var error = null;

		objects.forEach(function(object) {
			ObjectADP.remove({
				_id: object._id
			}, function(err, object) {
				error = err;
			});
		});

		callback({
			success: (error ? false : true),
			message: (error ? 'ADP SERVER ERROR: Object remove failed' : '')
		});
	},

	'object.list': function(param, callback) {
		adpconn.get('DataManager/Object', param, function(data) {
			var list = forEach(data.result.Result, function(object) {
				object._id = shortid.generate();
				// console.log('>>> objectADP.list <<<');
				// console.dir(object);
			});

			callback({
				success: true,
				body: list
			});
		});
	},

	/**
	 * Object Detail(s) List
	 * @param param {object}
	 * @param callback {function}   callback func
	 */
	'object.detail': function(param, callback) {
		/**
		 * param {object}
		 * {
		*    databaseKey: 2,           // siteId (required)
		*    dataKey: '001,002',       // target object ids (required)
		*    ascending: ?,             // sort key (optional)
		*    limit: 1(0),              // 1: current data, 0: chart data (required)
		*    startDate: unixtime,      // search start date (optional)
		*    endDate: unixtime         // search end date (optional)
		* }
		 */
		param.limit = 1;

		adpconn.get('DataManager/Data', param, function(data) {
			// console.log('object.read');
			// console.dir(data);

			// var list = forEach(data.result.Result, function(object) {
			// 	object._id = shortid.generate();
			// 	// console.log('>>> object.read');
			// 	// console.dir(object);
			// });

			callback({
				success: true,
				result: data.result.Result
			});
		});
	}
};
