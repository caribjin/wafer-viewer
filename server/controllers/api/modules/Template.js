//var app  = require('../../app')();
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var Template = mongoose.model('Template');
var moduleApi = require('./Module');
var _ = require('lodash');

var self = module.exports = {
	'template.create': function(_info, _callback) {
		Template.create({
			_id: ObjectID(),
			name: _info.name,
			description: _info.description,
			createdAt: new Date()
		}, function(_error, _item) {
			_callback({
				success: (_error ? false : true),
				message: (_error ? 'Template Create Fail' : 'Template Create Success!')
			});
		});
	},

	'template.update': function(_param, _callback) {
		Template.update({
			_id: _param._id
		}, _param, function(_error, _item) {
			var message = (_error ? 'Template Update Fail' : 'Template Update Success!');

			_error ? console.error(message) : console.info(message);

			_callback({
				success: (_error ? false : true),
				message: message
			});
		});
	},

	'template.addModule': function(_param, _callback) {
		self['template.get']({name: _param.templateName}, function(_res) {
			if (_res.result) {
				var template = _res.result;

				template.modules = template.modules || [];
				template.modules.push(_param.module);
				template.modules = _.uniqBy(template.modules, '_id');

				self['template.update']({_id: template._id, modules: template.modules}, _callback);
			}
		});
	},

	'template.removeModule': function(_param, _callback) {
		self['template.get']({name: _param.templateName}, function(_res) {
			if (_res.result) {
				var template = _res.result;
				template.modules = template.modules || [];

				if (template.modules.length) {
					var index = _.findIndex(template.modules, {_id: _param.module._id});
					if (index >= 0) {
						template.modules.splice(index, 1);
					}
				}

				template.modules = _.uniqBy(template.modules, '_id');
				self['template.update']({_id: template._id, modules: template.modules}, _callback);
			}
		});
	},

	'template.save': function(_param, _callback) {
		console.log('save', _param);

		//promise처리 필요.
		if (_param.changed) {
			_.forEach(_param.changed, function(_item) {
				Template.findByIdAndUpdate(_item._id, _item, {upsert: true}).exec();
			});
		}

		if (_param.removed) {
			_.forEach(_param.removed, function(_item) {
				Template.findByIdAndRemove(_item._id, {}).exec();
			});
		}

		_callback({
			success: true
		});
	},

	'template.list': function(_query, _callback) {
		Template.find(_query, {}).lean().exec(function(_err, _list) {
			_callback({
				success: true,
				result: _list
			});
		});

	},

	'template.get': function(_query, _callback) {
		Template.findOne(_query, {}).lean().exec(function(_err, _doc) {
			_callback({
				success: true,
				result: _doc
			});
		});
	}
};