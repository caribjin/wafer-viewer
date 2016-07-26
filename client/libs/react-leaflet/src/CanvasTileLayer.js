import { tileLayer } from 'leaflet';

import BaseTileLayer from './BaseTileLayer';

class CanvasTileLayer extends BaseTileLayer {
  componentWillMount() {
    super.componentWillMount();
    const { map: _map, layerContainer: _lc, ...props } = this.props;
    this.leafletElement = tileLayer.canvas(props);
  }
}

export default CanvasTileLayer;