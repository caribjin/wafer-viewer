import { PropTypes } from 'react';
import { multiPolyline } from 'leaflet';

import latlngListType from './types/latlngList';
import Path from './Path';

class MultiPolyline extends Path {
  componentWillMount() {
    super.componentWillMount();
    const {map: _map, layerContainer: _lc, polylines, ...props} = this.props;
    this.leafletElement = multiPolyline(polylines, props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.polylines !== prevProps.polylines) {
      this.leafletElement.setLatLngs(this.props.polylines);
    }
    this.setStyleIfChanged(prevProps, this.props);
  }
}

MultiPolyline.propTypes = {
	polylines: PropTypes.arrayOf(latlngListType).isRequired
};

export default MultiPolyline;