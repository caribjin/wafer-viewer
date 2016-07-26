//var app  = require('../../app')();
var ObjectID = require('mongodb').ObjectID;
var mongoose = require('mongoose');
var accountApi = require('./Account');
var Site = mongoose.model('Site');
var User = mongoose.model('User');
var crypto = require('crypto');

/**================ site webpack build ================**/
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var os = require('os');
var webpack = require('webpack');
var promise = require('bluebird');
var Template = mongoose.model('Template');
var _ = require('lodash');
var npm = require('npm');
var sync = require('synchronize');

function construct_check(sitename) {
	var dirname = path.join(__dirname, '../../assets', sitename);

	fs.stat(dirname, function(err, stat) {
		if (err && err.code !== 'ENOENT') {
			throw err;
		} else if (err && err.code === 'ENOENT') {
			mkdirp.sync(dirname);
			console.info('temporory site folder created. - ', dirname);
		}
	});

	return dirname;
}

function getIndexTemplate(data) {
	return _.template("" +
		"var r = require('react-router');" + "\n" +
		"n.Application.load({" + "\n" +
		"  socket : true," + "\n" +
		"  routes : {" + "\n" +
		"    path: '/'," + "\n" +
		"    indexRoute: {" + "\n" +
		"      component: require('../../views/login/')" + "\n" +
		"    }," + "\n" +
		"    onEnter : function(){}," + "\n" +
		"    childRoutes: [" + "\n" +
		"      {path:'login',component: require('../../views/login/')}," + "\n" +
		"      <% _.each(modules, function(module){ %>" + "\n" +
		"      <%var id = module.type?('@'+module.type+'/'+module.name):(module.name);%>" + "\n" +
		"      require('<%- id %>')(r)" + "\n" +
		"      <% }); %>" + "\n" +
		"    ]" + "\n" +
		"  }," + "\n" +
		"  ready: function () {" + "\n" +
		"    return ReactDOM.render(<n.Application />, document.getElementById('contents'));" + "\n" +
		"  }" + "\n" +
		"});")(data);
}

function getIndexHTMLTemplate(data) {
	return _.template("" +
		"<!DOCTYPE html>" +
		'<html lang="en">' +
		'<head>' +
		'<meta charset="UTF-8">' +
		'<title>Wizeye Dashboard</title>' +
		'<style>' +
		'html, body {}' +
		'#contents {width: 100%;height: 100%;overflow: hidden;padding: 0;margin: 0;}' +
		'</style>' +
		'<link rel="stylesheet" href="/node_modules/nuxjs/dist/nux.min.css" />' +
		'</head>' +
		'<body>' +
		'<div id="contents"></div>' +
		'</body>' +
		'</html>'
	)(data);
}

function startBuilding(info, callback) {
	/** preparing step start **/
	var siteid = info._siteId,
		sitename = info.domain,
		template = info._templateId,
		sitedir = construct_check(siteid),
		entryPath = path.join(sitedir, 'entry.jsx'),
		installList = [],
		options = require('../../webpack.config.js'),
		entry = '';

	options.entry = entryPath;
	options.output.path = sitedir;
	options.output.publicPath = '';

	var compiler = webpack(options);
	/** preparing step end **/

	try {
		sync.fiber(function() {
			console.info('Try generate site. - %s(%s)', siteid, sitename);
			// step 1
			var res = sync.await(Template.find({_id: template}, sync.defer()));
			_.each(res[0].modules, function(m) {
				var name = m.type ? ('@' + m.type + '/' + m.name + '@' + m.version) : (m.name + '@' + m.version);
				installList.push(name);
			});
			entry = getIndexTemplate({modules: res[0].modules});

			// step 2
			var _npm = sync.await(npm.load({}, sync.defer()));
			var istResult = sync.await(npm.commands.install(installList, sync.defer()));
			console.log(istResult);

			// step 3
			sync.await(fs.writeFile(entryPath, entry, sync.defer()));
			console.info('Entry file generated. - %s(%s)', siteid, sitename);

			// step 4
			var compileStat = sync.await(compiler.run(sync.defer()));
			if (compileStat.hasErrors() || compileStat.hasWarnings()) {
				console.error(compileStat.errors.message);
				console.warn(compileStat.warnings.message);
			} else {
				console.info('Bundle generated. - %s(%s)', siteid, sitename);
			}
		});
	} catch (e) {
		console.error(e.stack);
	}
}

/*
 setInterval(function(){
 Site.find({}, function(err, res){

 _.each(res, function(item){
 var dirname = path.join(__dirname, '../../assets', item._siteId);
 fs.stat(dirname,  function(err, stat){
 if(err && err.code !== 'ENOENT'){
 throw err;
 }else if(err && err.code === 'ENOENT'){
 startBuilding(item);
 }else{
 //console.log('site exist..');
 }
 });
 });
 });
 }, 1000);
 */
/**====================================================**/

function generateSiteId() {
	return crypto.randomBytes(16).toString('hex');
}

module.exports = {
	'site.create': function(_param, _callback) {
		// Site.count({}, function(_err, _count){
		//var siteId = _count +1;
		var siteId = generateSiteId();

		_param._id = ObjectID();
		_param._siteId = siteId;
		_param._templateId = _param.template;
		_param.upTime = new Date();
		_param.regTime = new Date();

		Site.update(_param, {upsert: true}, function(_error, _item) {
			console.debug('>>>>>>>>>>>', _item);

			accountApi['user.create']({
				siteId: siteId,
				profile: {
					name: _param.siteAdminId,
					password: _param.adminPassword
				}
			}, function(_res) {
				//startBuilding(_param);
				console.log(_res);

				_callback({
					success: (_error ? false : true),
					message: (_error ? 'Site Create Fail' : 'Site Create Success!')
				});
			});
		});
	},

	'site.update': function(_info, _callback) {
		Site.update({
			_id: _info._id
		}, _info, function(_error, _item) {

			_callback({
				success: (_error ? false : true),
				message: (_error ? 'Site Update Fail' : 'Site Update Success!')
			});
		});
	},

	'site.list': function(_query, _callback) {
		Site.find(_query, {}).lean().exec(function(_err, _list) {
			_callback({
				success: true,
				result: _list
			});
		});
	},

	'site.remove': function(_query, _callback) {
		try {
			Site.find({_id: _query._id}, function(err, res) {
				_.each(res, function(site) {
					Site.remove(site, function(err) {
						if (err) {
							throw err;
						}
						console.info(site.domain + ' site remove success.');
					});

					User.remove({_siteId: site._siteId}, function(err) {
						if (err) {
							throw err;
						}
						console.info(site.domain + ' users remove success.');
					});
				});
				_callback({
					success: true
				});
			});
		} catch (e) {
			console.error(e.stack);
			_callback({
				success: false
			});
		}
	},

	'site.save': function(_param, _callback) {
		//promise처리 필요.
		if (_param.changed) {
			_.forEach(_param.changed, function(_site) {
				Site.findById(_site._id, function(_err, _doc) {
					var upsert = {};
					var siteId = _doc ? _doc._siteId : generateSiteId();

					upsert._siteId = siteId;
					upsert.name = _site.name;
					upsert.domain = _site.domain;
					upsert.siteAdminId = _site.siteAdminId;
					upsert._templateId = _site.template;

					console.info('siteId', siteId);

					Site.update({_id: _site._id}, upsert, {upsert: true}, function(__err, __raw) {
						if (__err) return;

						console.debug('siteId', siteId)

						/**
						 * 최초생성할때만 user 생성, 나머지는 사이트에서.
						 */
						if (!_doc) {
							accountApi['user.save']({
								changed: [{
									_id: ObjectID(),
									_siteId: siteId,
									profile: {
										name: _site.siteAdminId,
										password: _site.adminPassword,
										memberType: 'super'
									}
								}]
							}, function() {
							});
						}
					});
				});

				// var siteId = _site._siteId ? _site._siteId : siteId();
				// if(result){
				//
				// }
			});
		}

		if (_param.removed) {
			_.forEach(_param.removed, function(_item) {
				Site.findByIdAndRemove(_item._id, {}).exec();
			});
		}

		_callback({
			success: true
		});
	}
};