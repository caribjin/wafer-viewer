import {PropTypes} from 'react';
import L, {control} from 'leaflet';
import styles from './css/sidebar.css';
import MapControl from './MapControl';

class Sidebar extends MapControl {
	constructor(props) {
		super(props);
	}

	isVisible() {
		return this.leafletElement.isVisible();
	}

	show() {
		this.leafletElement.show();
	}

	hide() {
		this.leafletElement.hide();
	}

	toggle() {
		this.leafletElement.toggle();
	}

	componentDidMount(props) {
		this.leafletElement.addTo(this.props.map);
		console.log('did mount');
	}

	componentWillMount() {
		let sidebar = L.Control.extend({
			includes: L.Mixin.Events,

			options: {
				closeButton: this.props.closeButton,
				position: this.props.position,
				autoPan: this.props.autoPan
			},

			initialize: function (props) {
				// Find content container
				var content = this._contentContainer = L.DomUtil.get(props.element);

				// Remove the content container from its original parent
				content.parentNode.removeChild(content);

				// Create sidebar container
				var container = this._container = L.DomUtil.create('div', 'leaflet-sidebar ' + this.options.position);

				// Style and attach content container
				L.DomUtil.addClass(content, 'leaflet-control');
				container.appendChild(content);

				// Create close button and attach it if configured
				if (this.options.closeButton) {
					var close = this._closeButton = L.DomUtil.create('a', 'close', container);
					close.innerHTML = '&times;';
				}
			},

			addTo: function(map) {
				var container = this._container;
				var content = this._contentContainer;

				if (this.options.closeButton) {
					var close = this._closeButton;
					L.DomEvent.on(close, 'click', this.hide, this);
				}

				L.DomEvent
					.on(container, 'transitionend', this._handleTransitionEvent, this)
					.on(container, 'webkitTransitionEnd', this._handleTransitionEvent, this);

				// Attach sidebar container to controls container
				var controlContainer = map._controlContainer;
				controlContainer.insertBefore(container, controlContainer.firstChild);

				this._map = map;

				// Make sure we don't drag the map when we interact with the content
				var stop = L.DomEvent.stopPropagation;
				var fakeStop = L.DomEvent._fakeStop || stop;

				L.DomEvent
					.on(content, 'contextmenu', stop)
					.on(content, 'click', fakeStop)
					.on(content, 'mousedown', stop)
					.on(content, 'touchstart', stop)
					.on(content, 'dblclick', fakeStop)
					.on(content, 'mousewheel', stop)
					.on(content, 'MozMousePixelScroll', stop);

				return this;
			},

			removeFrom: function (map) {
				//if the control is visible, hide it before removing it.
				this.hide();

				var container = this._container;
				var content = this._contentContainer;

				// Remove sidebar container from controls container
				var controlContainer = map._controlContainer;
				controlContainer.removeChild(container);

				//disassociate the map object
				this._map = null;

				// Unregister events to prevent memory leak
				var stop = L.DomEvent.stopPropagation;
				var fakeStop = L.DomEvent._fakeStop || stop;
				L.DomEvent
					.off(content, 'contextmenu', stop)
					.off(content, 'click', fakeStop)
					.off(content, 'mousedown', stop)
					.off(content, 'touchstart', stop)
					.off(content, 'dblclick', fakeStop)
					.off(content, 'mousewheel', stop)
					.off(content, 'MozMousePixelScroll', stop);

				L.DomEvent
					.off(container, 'transitionend', this._handleTransitionEvent, this)
					.off(container, 'webkitTransitionEnd', this._handleTransitionEvent, this);

				if (this._closeButton && this._close) {
					var close = this._closeButton;

					L.DomEvent.off(close, 'click', this.hide, this);
				}

				return this;
			},

			isVisible: function () {
				return L.DomUtil.hasClass(this._container, 'visible');
			},

			show: function () {
				if (!this.isVisible()) {
					L.DomUtil.addClass(this._container, 'visible');
					if (this.options.autoPan) {
						this._map.panBy([-this.getOffset() / 2, 0], {
							duration: 0.5
						});
					}
					this.fire('show');
				}
			},

			hide: function (e) {
				if (this.isVisible()) {
					L.DomUtil.removeClass(this._container, 'visible');
					if (this.options.autoPan) {
						this._map.panBy([this.getOffset() / 2, 0], {
							duration: 0.5
						});
					}
					this.fire('hide');
				}
				if(e) {
					L.DomEvent.stopPropagation(e);
				}
			},

			toggle: function () {
				if (this.isVisible()) {
					this.hide();
				} else {
					this.show();
				}
			},

			getContainer: function () {
				return this._contentContainer;
			},

			getCloseButton: function () {
				return this._closeButton;
			},

			setContent: function (content) {
				var container = this.getContainer();

				if (typeof content === 'string') {
					container.innerHTML = content;
				} else {
					// clean current content
					while (container.firstChild) {
						container.removeChild(container.firstChild);
					}

					container.appendChild(content);
				}

				return this;
			},

			getOffset: function () {
				if (this.options.position === 'right') {
					return -this._container.offsetWidth;
				} else {
					return this._container.offsetWidth;
				}
			},

			_handleTransitionEvent: function (e) {
				if (e.propertyName == 'left' || e.propertyName == 'right')
					this.fire(this.isVisible() ? 'shown' : 'hidden');
			}
		});

		this.leafletElement = new sidebar(this.props);
	}

	render() {
		return null;
	}
}

Sidebar.propTypes = {
	element: PropTypes.string.isRequired
};

Sidebar.defaultProps = {
	closeButton: true,
	position: 'right',
	autoPan: true
};

export default Sidebar;
