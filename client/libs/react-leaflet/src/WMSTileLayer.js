import { PropTypes } from 'react';
import { tileLayer } from 'leaflet';

import BaseTileLayer from './BaseTileLayer';

class WMSTileLayer extends BaseTileLayer {
  componentWillMount() {
    super.componentWillMount();
    const { map: _map, layerContainer: _lc, url, ...props } = this.props;
    this.leafletElement = tileLayer.wms(url, props);
  }
}

WMSTileLayer.propTypes = {
  url: PropTypes.string.isRequired
};

export default WMSTileLayer;