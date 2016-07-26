import { PropTypes } from 'react';
import { control } from 'leaflet';

import MapControl from './MapControl';

class ZoomControl extends MapControl {
  componentWillMount() {
    this.leafletElement = control.scale(this.props);
  }
}

ZoomControl.propTypes = {
	imperial: PropTypes.bool,
	maxWidth: PropTypes.number,
	metric: PropTypes.bool,
	updateWhenIdle: PropTypes.bool
};

export default ZoomControl;