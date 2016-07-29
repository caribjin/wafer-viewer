let Map = (function() {
	let _map = Symbol('map');
	let _layers = Symbol('layers');
	let _controls = Symbol('controls');
	let _view = Symbol('view');

	class Map {
		constructor(targetId, layers = [], controls = [], view = null, options = {}) {
			if (!targetId) {
				throw new Error('Don\'t specified target element');
			}

			if (!document.querySelector('#' + targetId)) {
				throw new Error('Can\'t find target DOM element');
			}

			this[_layers] = layers;
			this[_controls] = controls;
			this[_view] = view;

			this[_map] = new ol.Map({
				layers: layers,
				controls: controls,
				crossOrigin: 'anonymous',
				target: targetId,
				renderer: 'canvas',
				view: view
			});
		}

		get instance() {
			return this[_map];
		}
	}

	return Map;
}());


export default Map;
