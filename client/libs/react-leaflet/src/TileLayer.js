import { PropTypes } from 'react';
import { tileLayer } from 'leaflet';

import BaseTileLayer from './BaseTileLayer';

class TileLayer extends BaseTileLayer {
  componentWillMount() {
    super.componentWillMount();
    const { map: _map, layerContainer: _lc, url, ...props } = this.props;
    this.leafletElement = tileLayer(url, props);
  }

  componentDidUpdate(prevProps) {
    super.componentDidUpdate(prevProps);
    const { url } = this.props;
    if (url !== prevProps.url) {
      this.leafletElement.setUrl(url);
    }
  }
}

TileLayer.propTypes = {
	url: PropTypes.string.isRequired
};

TileLayer.defaultProps = {
  // url: '/public/images/grid-pattern/map_background.png'
	url: '/public/images/grid-pattern/grid-pattern-01.png'
	// url: ''
	// url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	// url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
	// url: 'http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png',
};

export default TileLayer;
