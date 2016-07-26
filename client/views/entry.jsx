module.exports = React.createClass({
	displayName: 'Entry',

	contextTypes: {
		router: React.PropTypes.object.isRequired
	},

	handleMenuChange: function(_menu, _value) {
		this.context.router.push(_value);
	},

	handleLogout: function() {
		location.href = '/logout';
	},

	getInitialState: function() {
		return {
			modules: [
				{text: 'Users', value: '/dashboard/users/list'}
			]
		};
	},

	componentDidMount: function() {
		this.setState({
			modules: [
				{ text: 'Wafer', value: '/viewer/wafer', icon: 'circle' },
				// { text: 'Lot', value: '/viewer/lot', icon: 'database' },
				// { text: 'Canvas', value: '/viewer/canvas', icon: 'codepen' }
			]
		});

		this.context.router.push({
			pathname: '/viewer/wafer'
		});
	},

	render: function() {
		return (
			<div>
				<n.FlexLayout direction="vertical">
					<div className="layout-header">
						<n.Header title="SK Hynix" style={{margin: '18px 40px', float: 'left', color: '#fff'}} />

						<n.Navigation
							direction={"horizontal"}
							options={this.state.modules}
							onChange={this.handleMenuChange}
						  style={{marginTop: '0px', border: 'none', boxShadow: 'none'}}
						/>
					</div>
					<div flex={1} id="viewer-wrapper" className="layout-fit">
						{this.props.children}
					</div>
				</n.FlexLayout>
			</div>
		);
	}
});
