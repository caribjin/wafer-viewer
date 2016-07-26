
module.exports = React.createClass({
	map: null,
	waferLayers: [],
	options: {
		waferCount: 1,
		initZoomLevel: 1,
		initCenterPosition: [-1721973, 2309009],
		zoomLevelCount: 17,
		showDebugTileGrid: false,
		tileUrl: 'http://172.16.20.202:30000/rest/tile/{z}/{x}/{y}',
		tileEmptyUrl: ''
	},

	getInitialState: function() {
		return {};
	},

	componentDidMount: function() {
		window.app = {};
		var app = window.app;
		var self = this;

		app.RotateClockwiseControl = function(opt) {
			var options = opt || {};

			var button = document.createElement('button');
			button.innerHTML = '<i class="icon rotate-right" />';

			var handleRotateLeft = function() {
				var currentRotation = view.getRotation();
				var rotateLeft = ol.animation.rotate({
					anchor: [0, 0],
					duration: 500,
					rotation: currentRotation
				});
				self.map.beforeRender(rotateLeft);
				view.rotate(currentRotation + (Math.PI / 2), [0, 0]);
			};

			button.addEventListener('click', handleRotateLeft, false);
			button.addEventListener('touchstart', handleRotateLeft, false);

			var element = document.createElement('div');
			element.className = 'rotate-clockwise ol-unselectable ol-control';
			element.title = 'Rotate ClockWise';
			element.appendChild(button);

			ol.control.Control.call(this, {
				element: element,
				target: options.target
			});
		};
		ol.inherits(app.RotateClockwiseControl, ol.control.Control);

		app.RotateCounterClockwiseControl = function(opt) {
			var options = opt || {};

			var button = document.createElement('button');
			button.innerHTML = '<i class="icon rotate-left" />';

			var handleRotateLeft = function() {
				var currentRotation = view.getRotation();
				var rotateRight = ol.animation.rotate({
					anchor: [0, 0],
					duration: 500,
					rotation: currentRotation
				});
				self.map.beforeRender(rotateRight);
				view.rotate(currentRotation - (Math.PI / 2), [0, 0]);
			};

			button.addEventListener('click', handleRotateLeft, false);
			button.addEventListener('touchstart', handleRotateLeft, false);

			var element = document.createElement('div');
			element.className = 'rotate-counterclockwise ol-unselectable ol-control';
			element.title = 'Rotate Counter ClockWise';
			element.appendChild(button);

			ol.control.Control.call(this, {
				element: element,
				target: options.target
			});
		};
		ol.inherits(app.RotateCounterClockwiseControl, ol.control.Control);

		var view = new ol.View({
			// center: ol.proj.fromLonLat([0, 0]),
			// center: [-7514065.031381681,  10018752.0813963],
			center: this.options.initCenterPosition,
			zoom: this.options.initZoomLevel,
			minZoom: this.options.initZoomLevel,
			maxZoom: this.options.initZoomLevel + this.options.zoomLevelCount - 1
		});

		// background base tile
		var baseTileSource = new ol.source.OSM({ url: this.options.tileEmptyUrl });
		var baseLayer = new ol.layer.Tile({
			source: baseTileSource
		});

		// debug tile grid
		var tileGridLayer = new ol.layer.Tile({
			source: new ol.source.TileDebug({
				projection: 'EPSG:3857',
				tileGrid: baseTileSource.getTileGrid()
			})
		});

		// wafer tile source
		var waferTileSource = new ol.source.OSM({
			url: this.options.tileUrl,
			wrapDateLine: false,
			wrapX: false,
			noWrap: true
		});

		// create and add wafer layers
		for (var i = 0; i < this.options.waferCount; i++) {
			var layer = new ol.layer.Tile({
				source: waferTileSource
			});
			this.waferLayers.push(layer);
		}

		var waferLayerGroup = new ol.layer.Group({
			layers: this.waferLayers
		});

		var mapLayers = [
			baseLayer,
			waferLayerGroup
		];

		if (this.options.showDebugTileGrid) {
			mapLayers.push(tileGridLayer);
		}

		this.map = new ol.Map({
			layers: mapLayers,
			controls: ol.control.defaults().extend([
				// new ol.control.FullScreen(),
				new ol.control.MousePosition(),
				new ol.control.OverviewMap({
					collapsed: false
				}),
				new ol.control.Rotate({
					autoHide: false
				}),
				new ol.control.ZoomSlider(),
				new ol.control.ZoomToExtent()
			]).extend([
				new app.RotateClockwiseControl(),
				new app.RotateCounterClockwiseControl()
			]),
			crossOrigin: 'anonymous',
			target: 'map',
			renderer: 'canvas',
			view: view
		});

		function main() {
			generateLayerControler();
			//rotateLayer(0);
		}

		function bindInput($visibleElement, $opacityElement, layer) {
			$visibleElement.on('change', function() {
				layer.setVisible(this.checked);
			});
			$visibleElement.prop('checked', layer.getVisible());

			$opacityElement.on('input change', function() {
				layer.setOpacity(parseFloat(this.value));
			});
			$opacityElement.val(String(layer.getOpacity()));
		}

		function pad(number, digits) {
			return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
		}

		function generateLayerControler() {
			var $layerTree = $('.layer-tree');

			self.map.getLayers().forEach(function(layer, i) {
				if (layer instanceof ol.layer.Group) {
					layer.getLayers().forEach(function(subLayer, j) {
						var $li = $('<li>');
						var $label = $('<label>');
						var $checkbox = $('<input type="checkbox" class="visible">');
						var $slider = $('<input type="range" class="opacity" min="0" max="1" step="0.1">');

						bindInput($checkbox, $slider, subLayer);

						$label.append($checkbox).append('Wafer' + pad(j, 2));
						$li.append($label).append($slider);
						$layerTree.append($li);
					});
				}
			});
		}

		main();
	},

	render: function() {
		return (
			<div>
					<div id="map" className="map"></div>

					<div className="layer-controller">
						<div>Wafer Layers</div>
						<ul className="layer-tree"></ul>
					</div>
			</div>
		);
	}
});
