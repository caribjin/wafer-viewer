let RotateClockwiseControl = (function() {
	let _map = Symbol('map');
	let _view = Symbol('view');
	let _options = Symbol('options');

	class RotateClockwiseControl {
		constructor(map, view, options = {}) {
			this[_map] = map;
			this[_view] = view;
			this[_options] = options;

			let button = document.createElement('button');
			button.innerHTML = '<i class="icon rotate-right" />';

			let handleRotateLeft = (e, map, view, options) => {
				let currentRotation = view.getRotation();
				let rotateLeft = ol.animation.rotate({
					anchor: options.center,
					duration: 500,
					rotation: currentRotation
				});
				map.beforeRender(rotateLeft);
				view.rotate(currentRotation + (Math.PI / 2), options.center);
			};

			button.addEventListener('click', (e) => {handleRotateLeft(e, map, view, options)}, false);
			button.addEventListener('touchstart', (e) => {handleRotateLeft(e, map, view, options)}, false);

			let element = document.createElement('div');
			element.className = 'rotate-clockwise ol-unselectable ol-control';
			element.title = 'Rotate ClockWise';
			element.appendChild(button);

			ol.control.Control.call(this, {
				element: element
			});
		}
	}

	return RotateClockwiseControl;
}());

let RotateCounterClockwiseControl = (function() {
	let _map = Symbol('map');
	let _view = Symbol('view');
	let _options = Symbol('options');

	class RotateCounterClockwiseControl {
		constructor(map, view, options = {}) {
			this[_map] = map;
			this[_view] = view;
			this[_options] = options;

			let button = document.createElement('button');
			button.innerHTML = '<i class="icon rotate-left" />';

			let handleRotateRight = (e, map, view, options) => {
				let currentRotation = view.getRotation();
				let rotateRight = ol.animation.rotate({
					anchor: options.center,
					duration: 500,
					rotation: currentRotation
				});
				map.beforeRender(rotateRight);
				view.rotate(currentRotation - (Math.PI / 2), options.center);
			};

			button.addEventListener('click', (e) => {handleRotateRight(e, map, view, options)}, false);
			button.addEventListener('touchstart', (e) => {handleRotateRight(e, map, view, options)}, false);

			let element = document.createElement('div');
			element.className = 'rotate-counterclockwise ol-unselectable ol-control';
			element.title = 'Rotate Counter ClockWise';
			element.appendChild(button);

			ol.control.Control.call(this, {
				element: element
			});
		}
	}

	return RotateCounterClockwiseControl;
}());

ol.inherits(RotateClockwiseControl, ol.control.Control);
ol.inherits(RotateCounterClockwiseControl, ol.control.Control);

let OverviewMapControl = (function() {
	let _control = Symbol('control');

	class OverviewMapControl {
		constructor(view) {
			this[_control] = new ol.control.OverviewMap({
				className: 'ol-overviewmap ol-custom-overviewmap',
				collapsed: false,
				view: view
			});
		}

		set view(view) {
			this[_control].setView(view);
		}

		get instance() {
			return this[_control];
		}
	}

	return OverviewMapControl;
}());

export default {
	RotateClockwiseControl: RotateClockwiseControl,
	RotateCounterClockwiseControl: RotateCounterClockwiseControl,
	OverviewMapControl: OverviewMapControl,
};
