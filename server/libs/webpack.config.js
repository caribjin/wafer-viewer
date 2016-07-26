var path = require('path');
var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = {
	debug: true,
	devtool: 'inline-source-map',
	hotComponents: true,
	// devtool: 'source-map',
	entry: './client/views/index.jsx',
	output: {
		// devtoolLineToLine: true,
		// pathinfo: true,
		publicPath: '/assets',
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
		// sourceMapFilename: 'bundle.js.map'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new StringReplacePlugin(),
		//new webpack.optimize.UglifyJsPlugin({
		//  compress: {
		//    warnings: false
		//  }
		//}),
		//new webpack.DefinePlugin({
		//  'process.env': {
		//    'NODE_ENV': JSON.stringify('production')
		//  }
		//}),
		new webpack.ProvidePlugin({
			_: 'lodash',
			$: 'jquery',
			jQuery: 'jquery',
			React: 'react',
			ReactDOM: 'react-dom',
			n: 'nuxjs'
		})
	],
	externals: {},
	module: {
		loaders: require('./webpack.config.loaders')
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
};
