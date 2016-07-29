let View = (function() {
	let _view = Symbol('view');

	class View {
		constructor(center = [0, 0], zoom = 1, minZoom = 1, maxZoom = 19) {
			this[_view] = new ol.View({
				center: center,
				zoom: zoom,
				minZoom: minZoom,
				maxZoom: maxZoom
			});
		}

		get instance() {
			return this[_view];
		}
	}

	return View;
}());

export default View;
