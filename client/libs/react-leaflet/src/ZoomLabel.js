import { PropTypes } from 'react';
import L, { control } from 'leaflet';

import MapControl from './MapControl';

class ZoomLabel extends MapControl {
	componentWillMount() {
		let zoomLabel = L.Control.extend({
			onAdd: function(map) {
				this._container = L.DomUtil.create('div', 'leaflet-control-zoomlabel');
				L.DomEvent.disableClickPropagation(this._container);
				map.on('zoomend', this._onZoomend, this);
				this._container.innerHTML = map.getZoom() - 3;

				return this._container;
			},

			onRemove: function(map) {
				map.off('zoomend', this._onZoomend);
			},

			_onZoomend: function(e) {
				this._container.innerHTML = e.target._zoom - 3;
			}
		});

		this.leafletElement = new zoomLabel(this.props);
	}
}

ZoomLabel.propTypes = {
	position: PropTypes.string
};

ZoomLabel.defaultProps = {
	position: 'bottomleft'
};

export default ZoomLabel;
