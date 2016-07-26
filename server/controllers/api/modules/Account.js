//var app  = require('../../app')();
var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');
var mongoose = require('mongoose');
var accessToken = require('./AccessToken');
var User = mongoose.model('User');

module.exports = {
	'user.create': function(_info, _callback) {
		User.create({
			_id: ObjectID(),
			_siteId: _info.siteId,
			profile: _info.profile,
			createdAt: new Date(),
			status: {
				online: false
			}
		}, function(_error, _profile) {
			_callback({
				success: (_error ? false : true),
				message: (_error ? 'User Create Fail' : 'User Create Success!')
			});
		});
	},

	'user.update': function(_info, _callback) {
		console.log('_info', _info);

		User.updateChange({
			_id: _info._id
		}, {
			profile: _info.profile
		}, function(_error, _profile) {
			_callback({
				success: (_error ? false : true),
				message: (_error ? 'User Update Fail' : 'User Update Success!')
			});
		});
	},

	'user.list': function(_query, _callback) {
		User.find(_query, {'profile.password': 0}).lean().exec(function(_err, _list) {
			_callback({
				success: true,
				result: _list
			});
		});

	},

	'user.save': function(_param, _callback) {
		//promise처리 필요.
		if (_param.changed) {
			_.forEach(_param.changed, function(_item) {
				var profile = _item.profile;

				var data = {
					_siteId: _item._siteId,
					'profile.name': profile.name,
					'profile.email': profile.email,
					'profile.mobile': profile.mobile
				};

				if (!_.isEmpty(profile.password)) {
					data['profile.password'] = profile.password;
				}

				User.findOne({_id: _item._id}, function(_err, _doc) {
					if (_doc) {
						_doc.update(data, {}, function(_err, _raw) {

						});
					} else {
						data._id = ObjectID();
						User.create(data, function(_err, _raw) {

						});
					}
				});
			});
		}

		if (_param.removed) {
			_.forEach(_param.removed, function(_item) {
				User.findByIdAndRemove(_item._id, {}).exec();
			});
		}

		_callback({
			success: true
		});

	},

	'login': function(_info, _callback) {
		User.findOne({'profile.name': _info.name}, function(_err, _user) {
			if (_user && _user.validPassword(_info.password)) {
				_callback({
					success: true,
					message: 'Login Success!',
					token: accessToken.create(_user),
					siteId: _user._siteId
				});
			} else {
				_callback({
					success: false,
					message: 'Login Fail!',
					token: null
				});
			}
		});
	}
};