var path = require('path');
var requireDirectory = require('require-directory');
var _ = require('lodash');
var cookie = require('cookie');
var tokenAPI = require('./api/modules/AccessToken');
var express = require('express');

module.exports = function(app, config, logger) {
	app.get('/echo/:param', function(req, res, next) {
		if (req.query) {
			res.send(req.query);
		} else {
			res.send(req.params.param);
		}
	});

	var routes = requireDirectory(module, './routes');
	_.each(routes, function(_router, _routerName) {
		app.use(_router);
	});

	// object detail
	app.get('/DataManager/Data/', function(req, res, next) {
		var define = [
			{
				"objectId": "OBJECT 1",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "Temp",
						"type": "Int64"
					}
				]
			},
			{
				"objectId": "OBJECT 2",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			},
			{
				"objectId": "OBJECT 3",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			},
			{
				"objectId": "OBJECT 4",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			},
			{
				"objectId": "OBJECT 5",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			},
			{
				"objectId": "OBJECT 6",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			},
			{
				"objectId": "OBJECT 7",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			},
			{
				"objectId": "OBJECT 8",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			},
			{
				"objectId": "OBJECT 9",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			},
			{
				"objectId": "OBJECT 10",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 11",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 12",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 13",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 14",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 15",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 1-1",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 1-2",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 1-3",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 1-4",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "NetworkReceived",
						"type": "String"
					},
					{
						"key": "NetworkSend",
						"type": "String"
					},
					{
						"key": "IP Address",
						"type": "String"
					},
					{
						"key": "Company Name",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 2-1",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					},
					{
						"key": "IP",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 2-2",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 1-1-1",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 1-1-2",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 1-1-3",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 1-2-1",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			}, {
				"objectId": "OBJECT 1-3-1",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			}
		];
		var data = {
			"OBJECT 1": [
				[
					1462948722223,
					"12.23",
					"85.78",
					"65.2"
				]
			],
			"OBJECT 2": [
				[
					1462948722285,
					"25.08",
					"85.78"
				]
			],
			"OBJECT 3": [
				[
					1462770292522,
					"5.1",
					"74.7"
				]
			],
			"OBJECT 4": [
				[
					1462948722222,
					"",
					"85.78"
				]
			],
			"OBJECT 5": [
				[
					1462948722223,
					"",
					"85.78"
				]
			],
			"OBJECT 6": [
				[
					1463122364697,
					"5.16",
					"172.16.10.71",
					"80",
					"0.2955224",
					"0"
				]
			],
			"OBJECT 7": [
				[
					1463122657386,
					"26.37",
					"172.16.10.71",
					"84.21",
					"0.5629172",
					"0"
				]
			],
			"OBJECT 8": [
				[
					1463122698168,
					"9.82",
					"172.16.10.71",
					"84.51",
					"0.8512943",
					"0"
				]
			],
			"OBJECT 9": [
				[
					1463122745310,
					"13.28",
					"172.16.10.71",
					"84.58",
					"1.60878",
					"0"
				]
			],
			"OBJECT 10": [
				[
					1463131247133,
					"2.62",
					"172.16.10.71",
					"79.75",
					"5.037902",
					"0"
				]
			],
			"OBJECT 11": [
				[
					1463131247133,
					"2.62",
					"172.16.10.71",
					"79.75",
					"5.037902",
					"0"
				]
			],
			"OBJECT 12": [
				[
					1463131247133,
					"2.62",
					"172.16.10.71",
					"79.75",
					"5.037902",
					"0"
				]
			],
			"OBJECT 13": [
				[
					1463131247133,
					"2.62",
					"172.16.10.71",
					"79.75",
					"5.037902",
					"0"
				]
			],
			"OBJECT 14": [
				[
					1463131247133,
					"2.62",
					"172.16.10.71",
					"79.75",
					"5.037902",
					"0"
				]
			],
			"OBJECT 15": [
				[
					1463131247133,
					"2.62",
					"172.16.10.71",
					"79.75",
					"5.037902",
					"0"
				]
			],
			"OBJECT 1-1": [
				[
					1462948722223,
					"12.23",
					"85.78",
					"5.037902",
					"0",
					"168.126.63.1",
					"DEVCROW"
				]
			],
			"OBJECT 1-2": [
				[
					1462948722223,
					"12.23",
					"85.78"
				]
			],
			"OBJECT 1-3": [
				[
					1462948722223,
					"12.23",
					"85.78"
				]
			],
			"OBJECT 1-4": [
				[
					1462948722223,
					"22.23",
					"55.78",
					"4.037902",
					"1",
					"192.168.0.1",
					"DEVCROW"
				]
			],
			"OBJECT 2-1": [
				[
					1462948722223,
					"12.23",
					"85.78",
					"168.126.63.1"
				]
			],
			"OBJECT 2-2": [
				[
					1462948722223,
					"12.23",
					"85.78"
				]
			],
			"OBJECT 1-1-1": [
				[
					1462948722223,
					"12.23",
					"85.78"
				]
			],
			"OBJECT 1-1-2": [
				[
					1462948722223,
					"12.23",
					"85.78"
				]
			],
			"OBJECT 1-1-3": [
				[
					1462948722223,
					"12.23",
					"85.78"
				]
			],
			"OBJECT 1-2-1": [
				[
					1462948722223,
					"12.23",
					"85.78"
				]
			],
			"OBJECT 1-3-1": [
				[
					1462948722223,
					"12.23",
					"85.78"
				]
			]
		};

		console.log('query : ');
		console.dir(req.query);

		var query = req.query;

		var dataKey = '';

		if (query.dataKey) {
			dataKey = query.dataKey;
		} else if (query.datakey) {
			dataKey = query.datakey;
		}

		var arrId = dataKey.split(',');

		var resultDefine = [];
		var resultData = {};

		for (var i = 0; i < arrId.length; i++) {
			var targetObjectId = arrId[i];

			for (var j = 0; j < define.length; j++) {
				if (define[j].objectId === targetObjectId) {
					resultDefine.push(define[j]);
					resultData[targetObjectId] = data[targetObjectId];
					break;
				}
			}
		}

		res.send({
			Code: 200,
			Result: {
				define: resultDefine,
				data: resultData
			}
		});
	});

	// object list
	app.get('/DataManager/Object/', function(req, res, next) {
		var data = {
			"Code": 200,
			"Result": [
				{
					"Name": "OBJECT 1",
					"Description": "Create by ADP",
					"ObjectNumber": 1,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "test002",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 1-1",
					"Description": "Create by ADP",
					"ObjectNumber": 2,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "test001",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 1-1-1",
					"Description": "Create by ADP",
					"ObjectNumber": 3,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "abcd",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 1-1-2",
					"Description": "Create by ADP",
					"ObjectNumber": 4,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "a93",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 1-1-3",
					"Description": "Create by ADP",
					"ObjectNumber": 5,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "a92",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 1-2",
					"Description": "Create by ADP",
					"ObjectNumber": 6,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc3",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 1-2-1",
					"Description": "Create by ADP",
					"ObjectNumber": 7,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc4",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 1-3",
					"Description": "Create by ADP",
					"ObjectNumber": 8,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc5",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 1-3-1",
					"Description": "Create by ADP",
					"ObjectNumber": 9,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc6",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 1-4",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 2",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 2-1",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 2-2",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 3",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 4",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 5",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 6",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 7",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 8",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 9",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 10",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 11",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 12",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 13",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 14",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				},
				{
					"Name": "OBJECT 15",
					"Description": "Create by ADP",
					"ObjectNumber": 10,
					"Level": 1,
					"Priority": 1,
					"ObjectTypeName": "pc100",
					"Parents": [],
					"Children": [],
					"Relations": {},
					"Properties": {},
					"PlayerProperties": {},
					"MustSendToDP": false,
					"DataFromDP": false
				}
			]
		};

		res.send(data);
	});

	app.get('*', function(req, res, next) {
		if (req.cookies.accessToken) {
			tokenAPI.verify(req.cookies.accessToken, function(_err, _profile) {
				if (_profile) {
					res.redirect('/viewer/wafer');
				} else {
					res.clearCookie('accessToken');
					res.redirect('/login');
				}
			});
		} else {
			res.redirect('/login');
		}
	});
};
