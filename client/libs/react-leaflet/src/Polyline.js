import { polyline } from 'leaflet';

import latlngListType from './types/latlngList';
import Path from './Path';

class Polyline extends Path {
  componentWillMount() {
    super.componentWillMount();
    const { map: _map, layerContainer: _lc, positions, ...props } = this.props;
    this.leafletElement = polyline(positions, props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.positions !== prevProps.positions) {
      this.leafletElement.setLatLngs(this.props.positions);
    }
    this.setStyleIfChanged(prevProps, this.props);
  }
}

Polyline.propTypes = {
	positions: latlngListType.isRequired
};

export default Polyline;