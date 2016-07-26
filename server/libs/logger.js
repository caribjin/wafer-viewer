var winston = require('winston');
var expressWinston = require('express-winston');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var os = require('os');

var logger = exports;

logger.consoleOptions = {
	json: false,
	colorize: true,
	level: 'info',
	handleExceptions: true,
	humanReadableUnhandledException: true
};

logger.fileOptions = {
	json: true,
	colorize: false,
	level: 'info',
	handleExceptions: true,
	humanReadableUnhandledException: true,
	maxsize: 1024 * 1024 * 30,
	maxFiles: 5
};

logger._agentList = {};

logger.getDirectory = function(dirname) {
	if (_.isEmpty(dirname)) {
		dirname = '.';
	}

	if (!path.isAbsolute(dirname)) {
		dirname = path.join(__dirname, '../logs/' + dirname);
	}

	if (!fs.existsSync(dirname)) {
		fs.mkdirSync(dirname);
	}
	return dirname;
};

logger.setOptions = function(type, config) {
	var options = this[type + "Options"];
	options = _.extend(options, {
		level: config.log.level,
		maxsize: config.log.maxsize,
		maxFiles: config.log.maxFiles
	});
};

logger.setConsole = function(config) {
	if (!this.logger) {
		return;
	}

	console.error = this.logger.error;
	console.warn = this.logger.warn;
	console.info = this.logger.info;
	if (config.log.level === "debug") {
		console.log = this.logger.verbose;
	}
	console.verbose = this.logger.verbose;
	console.debug = this.logger.debug;
};

logger.getConsole = function(options) {
	options = options || {};
	return new winston.transports.Console(_.extend(options, this.consoleOptions));
};

logger.getFile = function(options) {
	options = options || {};
	return new winston.transports.File(_.extend(options, this.fileOptions));
};

logger.checkRotateFile = function() {
	var now = new Date();

	if (now.getSeconds() === 0 && now.getMinutes() === 0 && now.getHours() === 0) {
		var pad = function(n) {
			if (parseInt(n) < 10) {
				return "0" + n;
			}
			return n;
		};

		var y = now.getFullYear(),
			m = pad(now.getMonth() + 1),
			d = pad(now.getDate()),
			stamp = y + m + d;

		try {
			this.logger.remove('server');
			this._accessLogger.remove('access');

			if (fs.existsSync(this._serverFile)) {
				fs.renameSync(this._serverFile, this._filename + '-server-' + stamp + '.log');
			}
			if (fs.existsSync(this._accessFile)) {
				fs.renameSync(this._accessFile, this._filename + '-access-' + stamp + '.log');
			}

			this.logger.add(this.getFile({name: 'server', filename: this._serverFile}));
			this._accessLogger.add(this.getFile({name: 'access', filename: this._accessFile}));
		} catch (e) {
			console.log(e);
		}
	}
};

logger.loadAgentLogs = function() {
	var self = this;
	var agentFolder = this.getDirectory('agents');

	try {
		fs.statSync(agentFolder);
		var files = fs.readdirSync(agentFolder);
		var ext = '.log';
		_.each(files, function(f) {
			if (path.extname(f) === ext) {
				var name = path.basename(f, ext);
				self.setAgent(name);
				// console.log("Agent [ %s ] load complete.", name);
			}
		});
	} catch (e) {
		console.log(e.stack);
	}
	return this;
};

logger.setAgent = function(prop) {
	if (!this.getAgent(prop)) {
		this._agentList[prop] = this.getAgentLogger(prop);
	}

	return this._agentList[prop];
};

logger.getAgent = function(prop) {
	if (this._agentList.hasOwnProperty(prop)) {
		return this._agentList[prop];
	}
};

logger.delAgent = function(prop) {
	var agent = this.getAgent(prop);
	var self = this;
	if (agent) {
		try {
			var file = path.join(agent.transports.file.dirname, agent.transports.file.filename);
			fs.unlink(file, function(err) {
				if (err) {
					throw err;
				}
				if (delete self._agentList[prop]) {
					// console.log('Agent [%s] successfully deleted.', prop);
				}
			});
		} catch (e) {
			console.log(e.stack);
		}
	}
};
logger.getAgentLists = function() {
	return Object.keys(this._agentList);
};

logger.getAgentLogger = function(name) {
	var filename = path.join(this.getDirectory('agents'), name + '.log');
	var agent = new winston.Logger({
		transports: [
			new winston.transports.File({
				filename: filename,
				maxsize: 1024 * 1024 * 30
			})
		]
	});
	var timeHandler = null;

	agent.on('logging', function(transport, level, msg, meta) {
		if (timeHandler) {
			clearTimeout(timeHandler);
		}
		timeHandler = setTimeout(function() {
			agent._isAlive = false;
		}, 5000);
		agent._isAlive = true;
	});
	return agent;
};

logger.setup = function(config) {
	this._config = config.log;

	var logFile = path.parse(config.log.file);
	var dirname = logFile.dir;
	var filename = logFile.base;

	if (filename.search(/(.log)/g) > -1) {
		filename = filename.slice(0, filename.search(/(.log)/g));
	}

	filename = path.join(this.getDirectory(dirname), filename);

	this._dirname = dirname;
	this._filename = filename;
	this._serverFile = filename + '-server.log';
	this._accessFile = filename + '-access.log';

	this.setOptions('console', config);
	this.setOptions('file', config);

	// more winston options
	// https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport
	this.logger = new winston.Logger({
		transports: [
			this.getConsole(),
			this.getFile({name: 'server', filename: this._serverFile})
		]
	});
	this._statusLogger = new winston.Logger({
		transports: [
			new winston.transports.Http({
				host: config.log.host,
				port: config.log.port,
				path: '/log/access'
			})
		]
	});

	this._accessLogger = new winston.Logger({
		transports: [
			this.getConsole(),
			this.getFile({name: 'access', filename: this._accessFile})
		]
	});

	this.httpLogger = expressWinston.logger({
		winstonInstance: this._accessLogger,
		meta: false,
		msg: 'HTTP {{req.method}} {{res.statusCode}} {{req.url}} {{res.responseTime}}ms',
		ignoreRoute: function(req, res) {
			return false;
		}
	});

	this.setConsole(config);

	this._rotator = setInterval(this.checkRotateFile.bind(this), 1000);

	if (this._config.monitoring === 'enable') {
		logger.sendMonitoring();
	}
	this.loadAgentLogs();
};

logger.sendMonitoring = function() {
	var self = this;
	this._monitor = setInterval(function() {
		var cpu = os.cpus();
		var message = {
			cpu: cpu[0].model,
			core: cpu.length,
			hostname: os.hostname(),
			platform: os.platform(),
			freemem: os.freemem(),
			totalmem: os.totalmem()
		};
		self._statusLogger.log('info', JSON.stringify(message));
	}, self._config.interval);
};