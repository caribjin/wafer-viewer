module.exports = [
	{
		test: /\.js$/,
		exclude: [
			/node_modules/,
			/chartjs/
		],
		loader: 'babel',
		query: {
			presets: ['es2015', 'react']
		}
	},
	{
		test: /\.jsx$/,
		exclude: /node_modules/,
		loader: 'babel',
		query: {
			presets: ['es2015', 'react']
		}
	},
	// {
	// 	test: /\.js$/,
	// 	exclude: /node_modules/,
	// 	loader: 'babel',
	// 	query: {
	// 		plugins: [
	// 			['react-transform', {
	// 				transforms: [{
	// 					transform: 'react-transform-hmr',
	// 					imports: ['react'],
	// 					locals: ['module']
	// 				}]
	// 			}]
	// 		]
	// 	}
	// },
	{
		test: /raw!$/, loader: 'raw-loader', exclude: /node_modules/
	},
	{
		test: /\.styl$/,
		loader: 'style-loader!css-loader!stylus-loader',
		exclude: /node_modules/
	},
	{test: /\.jpe?g$|\.gif$|\.png$/i, loader: 'file-loader'},
	{test: /\.eot/, loader: 'url-loader?limit=100000&mimetype=application/vnd.ms-fontobject'},
	{test: /\.woff2(\?\S*)?$/, loader: 'url-loader?limit=100000&mimetype=application/font-woff2'},
	{test: /\.woff/, loader: 'url-loader?limit=100000&mimetype=application/font-woff'},
	{test: /\.ttf/, loader: 'url-loader?limit=100000&mimetype=application/font-ttf'},

	{
		test: /\.css$/,
		loader: 'style-loader!css-loader'
		// exclude: /node_modules/
	},
	{
		test: /\.less$/,
		loader: 'style!css!less'
	}
];