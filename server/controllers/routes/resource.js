var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/resource/*', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../../../client/public/', req.params[0]));
});

module.exports = router;