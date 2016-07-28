class RotateClockwiseControl {
	constructor(map, view, options = {}) {
		this.map = map;
		this.view = view;
		this.options = options;

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
			element: element,
			target: this.options.target
		});
	}
}

class RotateCounterClockwiseControl {
	constructor(map, view, options = {}) {
		this.map = map;
		this.view = view;
		this.options = options;

		let button = document.createElement('button');
		button.innerHTML = '<i class="icon rotate-left" />';

		let handleRotateRight = (e, map, view, options) => {
			let currentRotation = this.view.getRotation();
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
			element: element,
			target: options.target
		});
	}
}

ol.inherits(RotateClockwiseControl, ol.control.Control);
ol.inherits(RotateCounterClockwiseControl, ol.control.Control);

export default {
	RotateClockwiseControl: RotateClockwiseControl,
	RotateCounterClockwiseControl: RotateCounterClockwiseControl
};
