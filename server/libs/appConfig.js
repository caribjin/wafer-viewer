var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var webpack = require('webpack');
var webpackDevMiddleware = require("webpack-dev-middleware");
var WebpackConfig = require('./webpack.config');
var compiler = webpack(WebpackConfig);
var path = require('path');

module.exports = function(app, config, logger) {
	app.use(logger.httpLogger);
	app.use(express.static(path.resolve(__dirname, '../')));

	app.use(cookieParser());

	// parse application/x-www-form-urlencoded
	app.use(bodyParser.urlencoded({extended: false}));

	// parse application/json
	app.use(bodyParser.json());

	app.set('secret', 'wizeye'); // secret variable

	app.use('/nuxjs', express.static(path.join(__dirname, '../../node_modules/nuxjs')));
	app.use('/public', express.static(path.join(__dirname, '../../client/public')));
	app.use('/assets/react-leaflet', express.static(path.join(__dirname, '../../client/libs/dist')));

	//app.use(session({ secret: 'n3nsecretkey', cookie: { maxAge: 60000 }, resave: true, saveUninitialized: true }));

	app.use(webpackDevMiddleware(compiler, {
		publicPath: WebpackConfig.output.publicPath,
		hot: true,
		historyApiFallback: true,
		stats: {
			colors: true
		}
	}));
};
