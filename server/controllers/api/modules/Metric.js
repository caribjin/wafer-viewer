/**
 * Created by amos on 2016. 4. 12..
 */
var wsconn = require('../wsconn');

var tempUpdateData = {
	"Name": "amosmetrictpl",
	"Metrics": {
		"amosMetricBlue": {
			"Metric": "amosMetricBlue",
			"Comments": "",
			"Enabled": false,
			"MapDisplay": "P",
			"Level": 1,
			"DisplayName": "",
			"Unit": "",
			"Derived": "N",
			"Formula": "",
			"FormulaText": "",
			"Function": "",
			"Operation": ">",
			"Occurrence": 0,
			"Interval": 0,
			"SLA": -99,
			"Baseline": -99,
			"Visible": false,
			"ColorInfo": {
				"GREEN": {
					"Status": "GREEN",
					"Threshold": 0,
					"TextColor": "green",
					"Bold": "",
					"BackgroundColor": "#00ffff",
					"ThresholdLabel": "",
					"ThresholdColor": ""
				},
				"YELLOW": {
					"Status": "YELLOW",
					"Threshold": 0,
					"TextColor": "yellow",
					"Bold": "",
					"BackgroundColor": "#00ffff",
					"ThresholdLabel": "",
					"ThresholdColor": ""
				},
				"RED": {
					"Status": "RED",
					"Threshold": 0,
					"TextColor": "red",
					"Bold": "",
					"BackgroundColor": "#00ffff",
					"ThresholdLabel": "",
					"ThresholdColor": ""
				}
			},
			"Link": {
				"Url": "",
				"Color": "#ffffff"
			}
		}
	}
};

var tempDeleteData = {
	"TemplateName": "amosmetrictpl",
	"MetricName": [
		"amosMetricBlue"
	]
};

module.exports = {
	// Create&Update
	'Metric/Update': function(_config, _callback) {
		wsconn('Metric/Update', tempUpdateData, _callback);
	},

	// Delete
	'Metric/Delete': function(_config, _callback) {
		wsconn('Metric/Delete', tempDeleteData, _callback);
	}
};