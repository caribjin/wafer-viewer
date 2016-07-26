var express = require('express');
var router = express.Router();
var logger = require('../../libs/logger');

router.post('/log/access', function(req, res, next) {
	try {
		var log = req.body.params;
		log.message = JSON.parse(log.message);
		var prop = log.message.hostname;
		var _logger = logger.setAgent(prop);

		_logger.info(log);
	} catch (e) {
		console.log(e.message);
	}
});

router.get('/log/show/:hostname', function(req, res) {
	var options = {
		from: new Date - 5 * 60 * 1000,
		until: new Date,
		limit: 5,
		start: 0,
		order: 'desc',
		fields: ['message', 'timestamp']
	};

	var hostname = req.params.hostname;
	try {
		var _logger = logger.getAgent(hostname);
		if (_logger) {
			_logger.query(options, function(err, results) {
				res.send(results.file);
			});
		}
	} catch (e) {
		console.log(e.message);
	}
});

router.get('/log/host/list', function(req, res) {
	try {
		var lists = logger.getAgentLists();

		res.send(JSON.stringify(lists));

	} catch (e) {
		console.log(e.message);
	}
});

module.exports = router;