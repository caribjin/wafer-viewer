var app = require('../../../app')();
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var db = mongoose.connection;
var User = mongoose.model('User');

module.exports = {
	create: function(_profile) {
		var profile = {
			name: _profile.name,
			password: _profile.password
		};

		return jwt.sign(profile, app.get('secret'), {
			expiresIn: '2 days'
		});
	},
	
	verify: function(_token, _callback) {
		// invalid token
		jwt.verify(_token, app.get('secret'), _callback);
	}
};