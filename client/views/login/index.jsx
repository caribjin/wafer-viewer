var cookies = require('browser-cookies');

module.exports = React.createClass({
	displayName: 'Login',
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	getInitialState: function() {
		return {message: '', values: {}};
	},

	handleLogin: function() {
		var me = this;
		var form = this.refs.form;

		if (!form.isValid()) {
			return
		}

		n.call('login', this.state.values, function(_error, _res) {
			if (_res.success) {
				cookies.set('accessToken', _res.token);
				if (_res.siteId) {
					cookies.set('site', _res.siteId);
				}
				me.context.router.replace('/viewer/wafer');
			} else {
				me.setState({message: _res.message})
			}
		});
	},

	render: function() {
		return (
			<n.FlexLayout align="center" direction="vertical">
				<div flex={1}></div>

				<n.Form ref="form" values={this.state.values} header={"Login"} warning={this.state.message} width={350}
				        labelWidth={150}>
					<n.TextField ref="name" name="name" label="name" width={"100%"}/>
					<n.PasswordField ref="password" name="password" label="password" width={"100%"}/>
					<n.Button text="Login" ui="primary" onClick={this.handleLogin}/>
				</n.Form>

				<div flex={1}></div>
			</n.FlexLayout>
		);
	}
});
