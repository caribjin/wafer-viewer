import { PropTypes } from 'react';
import { polygon } from 'leaflet';

import latlngListType from './types/latlngList';
import Path from './Path';

class Polygon extends Path {
  componentWillMount() {
    super.componentWillMount();
    const { map: _map, layerContainer: _lc, positions, ...props } = this.props;
    this.leafletElement = polygon(positions, props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.positions !== prevProps.positions) {
      this.leafletElement.setLatLngs(this.props.positions);
    }
    this.setStyleIfChanged(prevProps, this.props);
  }
}

Polygon.propTypes = {
	positions: PropTypes.oneOfType([
		latlngListType,
		PropTypes.arrayOf(latlngListType)
	]).isRequired
};

export default Polygon;