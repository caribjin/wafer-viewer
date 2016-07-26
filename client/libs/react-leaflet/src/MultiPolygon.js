import { PropTypes } from 'react';
import { multiPolygon } from 'leaflet';

import latlngListType from './types/latlngList';
import Path from './Path';

class MultiPolygon extends Path {
  componentWillMount() {
    super.componentWillMount();
    const { map: _map, layerContainer: _lc, polygons, ...props } = this.props;
    this.leafletElement = multiPolygon(polygons, props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.polygons !== prevProps.polygons) {
      this.leafletElement.setLatLngs(this.props.polygons);
    }
    this.setStyleIfChanged(prevProps, this.props);
  }
}

MultiPolygon.propTypes = {
  polygons: PropTypes.arrayOf(latlngListType).isRequired
};

export default MultiPolygon;