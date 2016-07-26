/**
 * Created by amos on 2016. 4. 12..
 */
var wsconn = require('../wsconn');
var tempReadData = {"MetricTemplateName": "amosmetrictpl"};

var tempCreateData = {
	"MetricTemplateCondition": {
		"MetricTemplateName": "amosmetrictpl",
		"Name": "amosBindCon",
		"Description": "amosBindCon",
		"Condition": ""
	}
};

var tempUpdateData = {
	"MetricTemplateCondition": {
		"MetricTemplateName": "amosmetrictpl",
		"Name": "amosBindCon",
		"Description": "amosBindCon",
		"Condition": "Acos"
	}
};

var tempDeleteData = {
	"MetricTemplateName": "amosmetrictpl",
	"Names": [
		"amosBindCon"
	]
};

module.exports = {
	// Read
	'MetricTemplateCondition/ReadAll': function(_config, _callback) {
		wsconn('MetricTemplateCondition/ReadAll', tempReadData, _callback);
	},

	// Create
	'MetricTemplateCondition/Create': function(_config, _callback) {
		wsconn('MetricTemplateCondition/Create', tempCreateData, _callback);
	},

	// Update
	'MetricTemplateCondition/Update': function(_config, _callback) {
		wsconn('MetricTemplateCondition/Update', tempUpdateData, _callback);
	},

	// Delete
	'MetricTemplateCondition/Delete': function(_config, _callback) {
		wsconn('MetricTemplateCondition/Delete', tempDeleteData, _callback);
	}
};