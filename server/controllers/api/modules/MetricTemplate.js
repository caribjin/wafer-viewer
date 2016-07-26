/**
 * Created by amos on 2016. 4. 12..
 */
var wsconn = require('../wsconn');
var tempReadData = {"id": 0, "Name": "app"};
var tempReadAllData = {"MetricTemplateName": "app"}; // 이것은 왜? 결과값으로 빈 배열

var tempCreateData = {
	"Name": "amosmetrictpl",
	"MetricTableTemplate": "",
	"Query": ""
};

var tempUpdateData = {
	"Name": "amosmetrictpl",
	"MetricTableTemplate": "update update update",
	"Query": ""
};

var tempDeleteData = {
	"MetricTemplateName": [
		"amosmetrictpl"
	]
};

module.exports = {
	// Read
	'MetricTemplate/NameList': function(_config, _callback) {
		wsconn('MetricTemplate/NameList', {}, _callback);
	},
	'MetricTemplate/Read': function(_config, _callback) {
		wsconn('MetricTemplate/Read', tempReadData, _callback);
	},

	// Create
	'MetricTemplate/Create': function(_config, _callback) {
		wsconn('MetricTemplate/Create', tempCreateData, _callback);
	},

	// Update
	'MetricTemplate/UpdateMetricTableTemplate': function(_config, _callback) {
		wsconn('MetricTemplate/UpdateMetricTableTemplate', tempUpdateData, _callback);
	},

	// Delete
	'MetricTemplate/Delete': function(_config, _callback) {
		wsconn('MetricTemplate/Delete', tempDeleteData, _callback);
	}
};