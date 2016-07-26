var assign = require('lodash/assign');
var request = require('request');
var path = require('path');

var config = require(path.resolve(__dirname, '../../libs/configure')).get();
var wsUrl = 'http://' + config.wizeye.host + ':' + config.wizeye.port;

module.exports = function(_url, _body, _callback) {
	_body.SiteID = _body.SiteID ? _body.SiteID : 18;

	var options = {
		url: wsUrl + '/' + _url,
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(_body) // body must be a JSON-serializable object. https://github.com/request/request#requestoptions-callback
	};

	request(options, function(err, res, body) {
		_callback({
			success: true,
			result: JSON.parse(body)
		});
	});
};