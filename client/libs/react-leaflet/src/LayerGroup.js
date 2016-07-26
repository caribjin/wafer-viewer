import { layerGroup } from 'leaflet';

import MapLayer from './MapLayer';

class LayerGroup extends MapLayer {
  componentWillMount() {
    super.componentWillMount();
    this.leafletElement = layerGroup();
  }

  render() {
    return this.renderChildrenWithProps({
      layerContainer: this.leafletElement,
    });
  }
}

export default LayerGroup;