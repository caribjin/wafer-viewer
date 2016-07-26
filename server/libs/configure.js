var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var _ = require('lodash');

module.exports = {
	config: {},
	default: {
		wizeye: {
			host: 'localhost',
			port: 1337
		},
		// adp: {
		// 	host: '172.16.10.71',
		// 	port: 1344
		// },
		adp: {
			host: '127.0.0.1',
			port: 7000
		},
		listen: {
			bind: 'localhost',
			port: 8080
		},
		database: {
			url: 'mongodb://localhost/adp-mapper'
		},
		log: {
			file: 'builder.log',
			level: 'info',
			maxsize: 1024 * 1024 * 30,
			maxFiles: 10,
			monitoring: 'disable',
			host: 'localhost',
			interval: 1000
		},
		npm: {
			repository: 'http://npm.dev.n3n.io'
		}
	},
	set: function(cmd) {
		if (cmd.conf) {
			var config_path = path.join(__dirname, cmd.conf);
			this.config = yaml.safeLoad(fs.readFileSync(config_path, 'utf8'));
			this.config = _.merge(this.default, this.config, {
				listen: {
					host: cmd.host,
					port: cmd.port
				},
				database: {
					url: cmd.database
				}
			});
		}
		return this;
	},
	get: function() {
		return this.config;
	}
};
