import { PropTypes } from 'react';
import { control } from 'leaflet';

import MapControl from './MapControl';

class AttributionControl extends MapControl {
  componentWillMount() {
    this.leafletElement = control.attribution(this.props);
  }
}

AttributionControl.propTypes = {
	prefix: PropTypes.string
};

export default AttributionControl;