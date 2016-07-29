import Map from '../../libs/Map';
import View from '../../libs/View';
import Controls from '../../libs/Controls';

module.exports = React.createClass({
	map: null,
	view: null,
	waferLayers: [],
	options: {
		waferCount: 1,
		initZoomLevel: 1,
		initCenterPosition: [-1800244.890, 1995923.682],
		zoomLevelCount: 17,
		showDebugTileGrid: false,
		tileUrl: 'http://172.16.20.202:30000/rest/tile/{z}/{x}/{y}',
		tileEmptyUrl: ''
	},

	getInitialState() {
		return {};
	},

	componentDidMount() {
		let self = this;

		this.view = new View(
			this.options.initCenterPosition,
			this.options.initZoomLevel,
			this.options.initZoomLevel,
			this.options.initZoomLevel + this.options.zoomLevelCount - 1
		).instance;

		let viewOverviewMap = new View(this.options.initCenterPosition, 0, 0, 0).instance;

		// background base tile
		let baseTileSource = new ol.source.OSM({ url: this.options.tileEmptyUrl });
		let baseLayer = new ol.layer.Tile({
			source: baseTileSource
		});

		// debug tile grid
		let tileGridLayer = new ol.layer.Tile({
			source: new ol.source.TileDebug({
				projection: 'EPSG:3857',
				tileGrid: baseTileSource.getTileGrid()
			})
		});

		// wafer tile source
		let waferTileSource = new ol.source.OSM({
			url: this.options.tileUrl,
			wrapDateLine: false,
			wrapX: false,
			noWrap: true
		});

		let overviewMapControl = new Controls.OverviewMapControl();
		// overviewMapControl.view = viewOverviewMap;

		// create and add wafer layers
		for (let i = 0; i < this.options.waferCount; i++) {
			let layer = new ol.layer.Tile({
				source: waferTileSource
			});
			this.waferLayers.push(layer);
		}

		let waferLayerGroup = new ol.layer.Group({
			layers: this.waferLayers
		});

		let mapLayers = [
			baseLayer,
			waferLayerGroup
		];

		if (this.options.showDebugTileGrid) {
			mapLayers.push(tileGridLayer);
		}

		this.map = new Map(
			'map',
			mapLayers,
			ol.control.defaults().extend([
				new ol.control.MousePosition(),
				// overviewMapControl,
				new ol.control.Rotate({
					autoHide: false
				}),
				new ol.control.ZoomSlider(),
				new ol.control.ZoomToExtent()
			]),
			this.view
		).instance;

		let cRotateControl = new Controls.RotateClockwiseControl(this.map, this.view, {center: this.options.initCenterPosition});
		let ccRotateControl = new Controls.RotateCounterClockwiseControl(this.map, this.view, {center: this.options.initCenterPosition});
		this.map.addControl(cRotateControl);
		this.map.addControl(ccRotateControl);

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

		function generateLayerControler() {
			let $layerTree = $('.layer-tree');
			let pad = (number, digits) => {
				return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
			};

			self.map.getLayers().forEach(function(layer, i) {
				if (layer instanceof ol.layer.Group) {
					layer.getLayers().forEach(function(subLayer, j) {
						let $li = $('<li>');
						let $label = $('<label>');
						let $checkbox = $('<input type="checkbox" class="visible">');
						let $slider = $('<input type="range" class="opacity" min="0" max="1" step="0.1">');

						bindInput($checkbox, $slider, subLayer);

						$label.append($checkbox).append('Wafer' + pad(j, 2));
						$li.append($label).append($slider);
						$layerTree.append($li);
					});
				}
			});
		}

		generateLayerControler();
	},

	render() {
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
