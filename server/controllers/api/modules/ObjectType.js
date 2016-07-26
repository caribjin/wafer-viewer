/**
 * Created by amos on 2016. 4. 12..
 */
var wsconn = require('../wsconn');
var shortid = require('shortid');
var forEach = require('lodash/forEach');

var tempReadData = {
	"Object": {
		"Query": "{\"Name\":/(?:)/i}",
		"PageSize": 100,
		"PageNumber": 1
	}
};

var tempCreateData = {
	"ObjectTypes": {
		"Name": "amosObjectType2",
		"TypeId": "amosObjectType2",
		"PushType": false,
		"Description": "",
		"MetricTemplateName": "",
		"Relations": {},
		"Properties": {},
		"ColorInfo": {
			"GREEN": {
				"Status": "GREEN",
				"Color": "green",
				"Blink": "false"
			},
			"YELLOW": {
				"Status": "YELLOW",
				"Color": "yellow",
				"Blink": "true"
			},
			"RED": {
				"Status": "RED",
				"Color": "red",
				"Blink": "true"
			}
		}
	}
};

var tempDeleteData = {
	"Names": ["amosObjectType2"]
};

module.exports = {
	// Read
	'objectType.list': function(_config, _callback) {
		wsconn('objecttype/list', tempReadData, function(result) {
			var list = forEach(result.result.Result, function(item) {
				item._id = shortid.generate();
			});

			_callback({
				success: true,
				result: list
			});
		});
	},

	// Create/Update
	'ObjectType/Set': function(_config, _callback) {
		wsconn('ObjectType/Set', tempCreateData, _callback);
	},

	// Delete
	'ObjectType/Delete': function(_config, _callback) {
		wsconn('ObjectType/Delete', tempDeleteData, _callback);
	}
};