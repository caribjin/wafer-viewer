/**
 * Created by amos on 2016. 4. 12..
 */
var wsconn = require('../wsconn');
var tempReadData = {"Name": "Chart"};

module.exports = {
	// Read
	'PlayerType/Read': function(_config, _callback) {
		wsconn('PlayerType/Read', tempReadData, _callback);
	},

	'PlayerType/ReadAll': function(_config, _callback) {
		wsconn('PlayerType/ReadAll', {}, _callback);
	}
};