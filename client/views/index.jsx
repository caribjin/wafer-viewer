var Entry = require('./entry');
var Login = require('./login');

var _ = require('lodash');

var cookies = require('browser-cookies');

var render = function() {
	ReactDOM.render(
		<n.Application
			routes={{
				path: '/',
				// indexRoute: {component: Login},
				indexRoute: {component: Entry},
				childRoutes: [
					{path: 'login', component: Login},
					{
						path: 'viewer', component: Entry,
						getChildRoutes: function(location, callback) {
							require.ensure([], function(require) {
								callback(null, [
									require('./viewer/route'),
									// require('./viewer/multi/route'),
									// require('./viewer/canvas/route')
								]);
							});
						}
					}
				]
			}}
		/>,
		document.getElementById('contents'));
};

/**
 * TODO : 개선 필요.
 */
// if (n.socket == null && cookies.get('wizeye_login_token') && location.pathname != '/') {
// 	/**
// 	 * @type {n.SocketClient}
// 	 */
// 	n.socket = new n.data.SocketClient({
// 		ssl: false,
// 		autoReconnect: true,
// 		onError: function(_error) {
// 			console.log('SOCKET ERROR!!!', _error);
// 		},
// 		autoReconnectTimer: 500,
// 		maintainCollections: true,
// 		ddpVersion: '1',
// 		url: 'http://' + location.host + '/echo?token=' + cookies.get('wizeye_login_token')
// 	});
//
// 	n.socket.connect(function(_error, _wasReconnect) {
// 		console.log('Socket Connected!');
// 		if (_error) return;
// 		render();
// 	});
// } else {
	render();
// }
