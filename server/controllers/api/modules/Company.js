//var app  = require('../../app')();
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Company = mongoose.model('Company');
var _ = require('lodash');

module.exports = {
	'company.create': function(_info, _callback) {
		Company.create({
			_id: ObjectID(),
			name: _info.name,
			//description : _info.description,
			createdAt: new Date()
		}, function(_error, _profile) {
			_callback({
				success: (_error ? false : true),
				message: (_error ? 'Company Create Fail' : 'Company Create Success!')
			});
		});
	},
	
	'company.update': function(_info, _callback) {
		console.log(_info);

		Company.update({
			_id: _info._id
		}, {
			name: _info.name
		}, function(_error, _company) {
			_callback({
				success: (_error ? false : true),
				message: (_error ? 'Company Update Fail' : 'Company Update Success!')
			});
		});
	},

	'company.list': function(_query, _callback) {
		Company.find(_query, {}).lean().exec(function(_err, _list) {
			_callback({
				success: true,
				result: _list
			});
		});
	},
	
	'company.save': function(_param, _callback) {
		//promise처리 필요.
		if (_param.changed) {
			_.forEach(_param.changed, function(_item) {
				Company.findByIdAndUpdate(_item._id, _item, {upsert: true}).exec();
			});
		}
		
		if (_param.removed) {
			_.forEach(_param.removed, function(_item) {
				Company.findByIdAndRemove(_item._id, {}).exec();
			});
		}

		_callback({
			success: true
		});
	}
};