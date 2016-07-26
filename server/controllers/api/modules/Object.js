/**
 * Created by amos on 2016. 4. 12..
 */
var wsconn = require('../wsconn');
var forEach = require('lodash/forEach');
var ObjectID = require('mongodb').ObjectID;
var shortid = require('shortid');

var tempReadData = {"Query": "{}", "SiteID": "cisco"}
// var tempReadData = {}
// Object: {
//   'Query': {}
// 'PageSize':100,
// 'PageNumber':0
// }
// };

var tempCreateData = {
	Object: {
		"Parents": [],
		"Children": [],
		"Relations": {},
		"Properties": {},
		"PlayerTypeName": "",
		"PlayerProperties": {},
		"Name": "aaa",
		"ObjectNumber": 12121,
		"Level": 1,
		"Label": "gogogogogo",
		"ObjectTypeName": "Business Service",
		"Priority": 1
	}
};

var tempDeleteData = {
	"Names": [
		"aaa"
	]
};

module.exports = {
	// Read
	'objectList.list': function(_config, _callback) {
		wsconn('Object/Search', tempReadData, function(result) {
			var list = forEach(result.result.Result.Result, function(item) {
				item._id = shortid.generate();
			});

			_callback({
				success: true,
				result: list
			});
		});
	},

	// Create/Update
	'objectList.upsert': function(_config, _callback) {
		wsconn('ObjectTree/Update', tempCreateData, _callback);
	},

	// Delete
	'ObjectTree/Delete': function(_config, _callback) {
		wsconn('ObjectTree/Delete', tempDeleteData, _callback);
	}
};