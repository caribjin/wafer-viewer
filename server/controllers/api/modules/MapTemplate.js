/**
 * Created by amos on 2016. 4. 12..
 */
var wsconn = require('../wsconn');
var forEach = require('lodash/forEach');
var ObjectID = require('mongodb').ObjectID;

var tempReadData = {
	"ListGroupName": "TemplateMap",
	"PrivilegeNumber": "0",
	"Count": -1,
	"PageNumber": 0,
	"SearchParams": {}
};

var tempCreateData = {
	"ListGroupName": "TemplateMap",
	"PrivilegeNumbers": [
		0,
		1
	],
	"ListInfo": [
		{
			"UniqueName": "99e7e0e7-a584-f416-1ff3-6eb1204964ae",
			"UIElementTypeName": "Map",
			"DataJSON": "{\"DisplayName\":\"amosTemplateMapGoo\",\"Description\":\"\",\"query\":\"\",\"UseMapSpl\":true,\"zoomable\":true,\"pannable\":true,\"zoomLimit\":\"\",\"MapSplEarliestMinutes\":0,\"MapSplIntervalSeconds\":0,\"BackgroundColor\":\"#ffffff\",\"MapServiceUrl\":\"\",\"MapWidth\":1280,\"MapHeight\":700,\"UseTile\":true,\"UniqueName\":\"99e7e0e7-a584-f416-1ff3-6eb1204964ae\",\"MapBgColor\":[255,\"#ffffff\"],\"CoordinateType\":\"pixel\",\"ListGroupName\":\"TemplateMap\"}",
			"DisplayName": "amosTemplateMapGoo",
			"IsFolder": false,
			"IconPath": "",
			"Parent": ""
		}
	]
};

var tempDeleteData = {
	"PrivilegeNumbers": "[0]",
	"ListGroupName": "TemplateMap",
	"UniqueNameList": [
		"99e7e0e7-a584-f416-1ff3-6eb1204964ae"
	]
};


module.exports = {
	// Read
	'mapTemplate.list': function(_config, _callback) {
		wsconn('RefList/Get/Page', tempReadData, function(result) {
			forEach(result.result.Result.List, function(item) {
				item._id = item.UniqueName;
			});

			_callback({
				success: true,
				result: result.result.Result.List
			});
		});
	},

	// Create
	'List/Add': function(_config, _callback) {
		wsconn('List/Add', tempCreateData, _callback);
	},

	// Delete
	'Map_RefList/Del': function(_config, _callback) {
		wsconn('Map_RefList/Del', tempDeleteData, _callback);
	}

};