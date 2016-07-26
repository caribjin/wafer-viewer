import { PropTypes } from 'react';
import { control } from 'leaflet';

import MapControl from './MapControl';

class ZoomControl extends MapControl {
  componentWillMount() {
    this.leafletElement = control.zoom(this.props);
  }
}

ZoomControl.propTypes = {
	zoomInText: PropTypes.string,
	zoomInTitle: PropTypes.string,
	zoomOutText: PropTypes.string,
	zoomOutTitle: PropTypes.string
};

export default ZoomControl;