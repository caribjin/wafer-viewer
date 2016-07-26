var request = require('request');
var path = require('path');
var forEach = require('lodash/forEach');

var config = require(path.resolve(__dirname, '../../libs/configure')).get();
var adpUrl = 'http://' + config.adp.host + ':' + config.adp.port;

console.log('adp url: ' + adpUrl);

var Module = {
		get: function(_url, _params, _callback) {
			var paramString = '';
			var params = [];

			forEach(_params, function(value, key) {
				params.push(key + '=' + value);
			});

			paramString = params.join('&');

			var options = {
				url: adpUrl + '/' + _url + '?' + paramString,
				method: 'GET',
				headers: {'content-type': 'application/json'},
				body: ''
			};

			// console.log('adp get(): ');
			// console.dir(options);

			request(options, function(err, res, body) {
				_callback({
					success: true,
					result: JSON.parse(body)
				});
			});
		},

		post: function(_url, _body, _callback) {
			_body.SiteID = _body.SiteID ? _body.SiteID : 1;

			var options = {
				url: adpUrl + '/' + _url,
				method: 'POST',
				headers: {'content-type': 'application/json'},
				body: JSON.stringify(_body)
			};

			request(options, function(err, res, body) {
				_callback({
					success: true,
					result: JSON.parse(body)
				});
			});
		}
};

module.exports = {
	get: Module.get,
	post: Module.post
};