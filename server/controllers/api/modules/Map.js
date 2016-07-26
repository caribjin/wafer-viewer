/**
 * Created by amos on 2016. 4. 12..
 */

var wsconn = require('../wsconn');
var forEach = require('lodash/forEach');

var tempReadPageData = {
	"ListGroupName": "Map",
	"PrivilegeNumber": "1",
	"Count": -1,
	"PageNumber": 0,
	"SearchParams": {}
};

var tempReadStepData = {
	"ListGroupName": "Map",
	"PrivilegeNumber": "1",
	"ParentName": ""
};


var tempCreateData = {
	"PrivilegeNumbers": "[0]",
	"ListGroupName": "Map",
	"MapInfo": [
		{
			"TimeStamp": 1460444866,
			"CoordinateType": "pixel",
			"MapWidth": 2309,
			"MapHeight": 1334,
			"UIElementTypeName": "DCG",
			"UIElementUniqueName": "63e7c394-9c7e-494f-9ea2-fd9e940d14b0",
			"UIElementDisplayName": "APP_dp",
			"DataJSON": "{\n\"MapServiceUrl\": \"background_gray.png\",\n\"MapBgColor\": [ 255, \"#232323\" ],\n\"UseMapSpl\": true,\n\"MapSplEarliestMinutes\": 19800,\n\"MapSplIntervalSeconds\": 60,\n\"Parent\": \"ba138f5c-4461-401c-8c4e-fcf5820d79bd\",\n\"UseTile\": false,\n\"zoomable\": true,\n\"pannable\": true,\n\"zoomLimit\": false,\n\"ProjectName\": \"DEFAULT\",\n\"TemplateName\": \"TP_LV3\",\n\"EntryObjectName\": \"\",\n}",
			"PrevTimeStamp": -1,
			"NextTimeStamp": -1,
			"QueryTime": 1460444860,
			"MapUIElementInfo": [
				{
					"X": 919.653,
					"Y": 542.398,
					"Z": 0,
					"W": 0,
					"H": 43.937,
					"D": 0,
					"UIElementTypeName": "ContinuousLine",
					"UIElementUniqueName": "ab3c86b9-074b-468a-b933-2d85e6fbe1e8",
					"UIElementDisplayName": "auto::Asset2App",
					"DataJSON": "{\n\"ID\": \"ab3c86b9-074b-468a-b933-2d85e6fbe1e8\",\n\"Name\": \"auto::Asset2App\",\n\"ZIndex\": 2,\n\"_version\": \"1.0.3\",\n\"ClassName\": \"ContinuousLine\",\n\"Color\": [ 255, \"#FFFFFF\" ],\n\"EndCapType\": \"None\",\n\"LineJoinType\": \"Miter\",\n\"LineStrokeType\": \"0\",\n\"PointCollection\": [ [919.653, 542.398],[919.653, 586.335] ],\n\"Position\": [ [919.653, 542.398], [919.653, 586.335] ],\n\"StartCapType\": \"None\",\n\"Thickness\": 4,\n\"FunctionMacro\": \"ShowLineIfExist:Service\",\n\"Style\": \"\",\n\"progress\": false,\n\"progrssStatus\": 0,\n\"objectId\": \"\",\n\"objectName\": \"\",\n\"dataBinding\": \"\",\n\"backgroundColor\": [ 0, \"#000000\" ],\n}"
				},
				{
					"X": 779.697,
					"Y": 468.629,
					"Z": 0,
					"W": 285.972,
					"H": 71.208,
					"D": 0,
					"UIElementTypeName": "Universal",
					"UIElementUniqueName": "5d3ba9bb-88d1-4a09-b426-0f1c200240c5",
					"UIElementDisplayName": "auto::Business Service::Host Services::Enterprise Foundation",
					"DataJSON": "{\n\"ID\": \"5d3ba9bb-88d1-4a09-b426-0f1c200240c5\",\n\"Name\": \"auto::Business Service::Host Services::Enterprise Foundation\",\n\"ZIndex\": 3,\n\"_version\": \"1.0.6\",\n\"ClassName\": \"Universal\",\n\"Position\": [ [779.697, 468.629], [1065.669, 539.837] ],\n\"SplunkObjectID\": \"10965\",\n\"ShapeType\": \"Rectangle\",\n\"TitlePosition\": [ [0, 0], [1, 1] ],\n\"TitleColor\": [ 255, \"#FFFFFF\" ],\n\"TitleCaption\": \"Host Services\",\n\"TitleAlignment\": \"Center\",\n\"IconPosition\": [ [0, 0], [1, 1] ],\n\"IconImageUrl\": \"\",\n\"ShowAlarmLamp\": false,\n\"AlarmLampPosition\": [0, 0],\n\"AlarmLampSize\": 0,\n\"AlarmLampColor\": [ 255, \"#EFEFEF\" ],\n\"BorderThickness\": 4,\n\"BorderRadius\": 8,\n\"BorderColor\": [ 255, \"#8E6547\" ],\n\"LinkUrl\": \"null\",\n\"LinkedMapGuid\": \"97b31bc3-6d08-4f24-ac0e-7f1ac469562b\",\n\"LinkedMapBookMarkName\": \"\",\n\"LinkedMapObjectName\": \"\",\n\"BackGroundColor\": [ 255, \"#191919\" ],\n\"BackGroundImageUrl\": \"\",\n\"HasLamp\": false,\n\"FunctionMacro\": \"ShowIfExist:Service\",\n\"Style\": \"\",\n\"Actions\": {},\n\"LockToScreen\": false,\n\"objectName\": \"\",\n\"dataBinding\": \"\",\n\"template\": \"\",\n\"fontSize\": \"\",\n}"
				},
				{
					"X": 779.697,
					"Y": 358.629,
					"Z": 0,
					"W": 285.972,
					"H": 71.208,
					"D": 0,
					"UIElementTypeName": "Universal",
					"UIElementUniqueName": "8bab03b8-358c-4ad7-a357-33a850c7b5ff",
					"UIElementDisplayName": "auto::Business Unit::Enterprise Foundation",
					"DataJSON": "{\n\"ID\": \"8bab03b8-358c-4ad7-a357-33a850c7b5ff\",\n\"Name\": \"auto::Business Unit::Enterprise Foundation\",\n\"ZIndex\": 4,\n\"_version\": \"1.0.6\",\n\"ClassName\": \"Universal\",\n\"Position\": [ [779.697, 358.629], [1065.669, 429.837] ],\n\"SplunkObjectID\": \"10959\",\n\"ShapeType\": \"Rectangle\",\n\"TitlePosition\": [ [0, 0], [1, 1] ],\n\"TitleColor\": [ 255, \"#FFFFFF\" ],\n\"TitleCaption\": \"Enterprise Foundation\",\n\"TitleAlignment\": \"Center\",\n\"IconPosition\": [ [0, 0], [1, 1] ],\n\"IconImageUrl\": \"\",\n\"ShowAlarmLamp\": false,\n\"AlarmLampPosition\": [0, 0],\n\"AlarmLampSize\": 0,\n\"AlarmLampColor\": [ 255, \"#EFEFEF\" ],\n\"BorderThickness\": 4,\n\"BorderRadius\": 8,\n\"BorderColor\": [ 255, \"#A3ABBE\" ],\n\"LinkUrl\": \"null\",\n\"LinkedMapGuid\": \"97b31bc3-6d08-4f24-ac0e-7f1ac469562b\",\n\"LinkedMapBookMarkName\": \"\",\n\"LinkedMapObjectName\": \"\",\n\"BackGroundColor\": [ 255, \"#191919\" ],\n\"BackGroundImageUrl\": \"\",\n\"HasLamp\": false,\n\"FunctionMacro\": \"ShowIfExist:Category\",\n\"Style\": \"\",\n\"Actions\": {},\n\"LockToScreen\": false,\n\"objectName\": \"\",\n\"dataBinding\": \"\",\n\"template\": \"\",\n\"fontSize\": \"\",\n}"
				},
				{
					"X": 688.603,
					"Y": 590.123,
					"Z": 0,
					"W": 465.13,
					"H": 83.329,
					"D": 0,
					"UIElementTypeName": "Universal",
					"UIElementUniqueName": "a9d0f200-b79b-46f0-9f03-87c1fa13d683",
					"UIElementDisplayName": "auto::host::dp::Host Services",
					"DataJSON": "{\n\"ID\": \"a9d0f200-b79b-46f0-9f03-87c1fa13d683\",\n\"Name\": \"auto::host::dp::Host Services\",\n\"ZIndex\": 0,\n\"_version\": \"1.0.6\",\n\"ClassName\": \"Universal\",\n\"Position\": [ [688.603, 590.123], [1153.733, 673.452] ],\n\"SplunkObjectID\": \"46\",\n\"ShapeType\": \"Rectangle\",\n\"TitlePosition\": [ [0.1, 0.1], [0.9, 0.9] ],\n\"TitleColor\": [ 255, \"#FFFFFF\" ],\n\"TitleCaption\": \"dp\",\n\"TitleAlignment\": \"Left\",\n\"IconPosition\": [ [0, 0], [1, 1] ],\n\"IconImageUrl\": \"\",\n\"ShowAlarmLamp\": true,\n\"AlarmLampPosition\": [0.95, 0.2],\n\"AlarmLampSize\": 6,\n\"AlarmLampColor\": [ 255, \"#008000\" ],\n\"BorderThickness\": 4,\n\"BorderRadius\": 0,\n\"BorderColor\": [ 255, \"#FF99FF\" ],\n\"LinkUrl\": \"\",\n\"LinkedMapGuid\": \"7b74168b-614a-4c81-ad5b-7c2f86f4d029\",\n\"LinkedMapBookMarkName\": \"\",\n\"LinkedMapObjectName\": \"\",\n\"BackGroundColor\": [ 255, \"#191919\" ],\n\"BackGroundImageUrl\": \"\",\n\"HasLamp\": true,\n\"FunctionMacro\": \"ShowIfExist:App\",\n\"Style\": \"\",\n\"Actions\": {},\n\"LockToScreen\": false,\n\"objectName\": \"\",\n\"dataBinding\": \"\",\n\"template\": \"\",\n\"fontSize\": \"\",\n}"
				},
				{
					"X": 919.653,
					"Y": 434.827,
					"Z": 0,
					"W": 0,
					"H": 30.302,
					"D": 0,
					"UIElementTypeName": "ContinuousLine",
					"UIElementUniqueName": "6c2ed3c8-9de6-456f-8c12-6a7f00890c69",
					"UIElementDisplayName": "auto::Offering2Asset",
					"DataJSON": "{\n\"ID\": \"6c2ed3c8-9de6-456f-8c12-6a7f00890c69\",\n\"Name\": \"auto::Offering2Asset\",\n\"ZIndex\": 1,\n\"_version\": \"1.0.3\",\n\"ClassName\": \"ContinuousLine\",\n\"Color\": [ 255, \"#FFFFFF\" ],\n\"EndCapType\": \"None\",\n\"LineJoinType\": \"Miter\",\n\"LineStrokeType\": \"0\",\n\"PointCollection\": [ [919.653, 434.827],[919.653, 465.129] ],\n\"Position\": [ [919.653, 434.827], [919.653, 465.129] ],\n\"StartCapType\": \"None\",\n\"Thickness\": 4,\n\"FunctionMacro\": \"ShowLineIfExist:Category\",\n\"Style\": \"\",\n\"progress\": false,\n\"progrssStatus\": 0,\n\"objectId\": \"\",\n\"objectName\": \"\",\n\"dataBinding\": \"\",\n\"backgroundColor\": [ 0, \"#000000\" ],\n}"
				}
			]
		}
	],
	"ListInfo": [
		{
			"UniqueName": "63e7c394-9c7e-494f-9ea2-fd9e940d14b0",
			"DisplayName": "Amos_Map_GoGo",
			"UIElementTypeName": "DCG",
			"IsFolder": false,
			"HasPrivilege": true,
			"HasChildren": false,
			"IconPath": "",
			"Parent": "ba138f5c-4461-401c-8c4e-fcf5820d79bd",
			"_checked": true
		}
	]
};

module.exports = {
	// Read
	'map.list': function(_config, _callback) {
		wsconn('RefList/Get/Page', tempReadPageData, function(result) {
			var list = forEach(result.result.Result.List, function(item, index) {
				var _id = item.UniqueName;
				delete item.UniqueName;
				item._id = _id;
			});

			_callback({
				success: true,
				result: list
			});
		});
	},

	'RefList/Get/Step': function(_config, _callback) {
		wsconn('RefList/Get/Step', tempReadStepData, _callback);
	},

	// Create
	'Map_RefList/Set': function(_config, _callback) {
		wsconn('Map_RefList/Set', tempCreateData, _callback);
	}
};