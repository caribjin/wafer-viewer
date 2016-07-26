import { PropTypes } from 'react';
import { circleMarker } from 'leaflet';

import latlngType from './types/latlng';
import Path from './Path';

class CircleMarker extends Path {
  componentWillMount() {
    super.componentWillMount();
    const { center, map: _map, layerContainer: _lc, ...props } = this.props;
    this.leafletElement = circleMarker(center, props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.center !== prevProps.center) {
      this.leafletElement.setLatLng(this.props.center);
    }
    if (this.props.radius !== prevProps.radius) {
      this.leafletElement.setRadius(this.props.radius);
    }
    this.setStyleIfChanged(prevProps, this.props);
  }
}

CircleMarker.propTypes = {
	center: latlngType.isRequired,
	radius: PropTypes.number
};

export default CircleMarker;