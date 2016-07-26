var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/login', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../../../client', 'index.html'));
});

router.get('/viewer/wafer', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../../../client', 'index.html'));
});

router.get('/logout', function(req, res, next) {
	res.clearCookie('accessToken');
	res.redirect('/login');
});

module.exports = router;
