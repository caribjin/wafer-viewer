import { PropTypes } from 'react';
import { geoJson } from 'leaflet';

import Path from './Path';

class GeoJson extends Path {
  componentWillMount() {
    super.componentWillMount();
    const { data, map: _map, layerContainer: _lc, ...props } = this.props;
    this.leafletElement = geoJson(data, props);
  }

  componentDidUpdate(prevProps) {
    this.setStyleIfChanged(prevProps, this.props);
  }
}

GeoJson.propTypes = {
	data: PropTypes.object.isRequired
};

export default GeoJson;