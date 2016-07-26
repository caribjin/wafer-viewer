import { featureGroup } from 'leaflet';

import Path from './Path';

class FeatureGroup extends Path {
  componentWillMount() {
    this.leafletElement = featureGroup();
  }

  componentDidMount() {
    super.componentDidMount();
    this.setStyle(this.props);
  }

  componentDidUpdate(prevProps) {
    this.setStyleIfChanged(prevProps, this.props);
  }

  render() {
    return this.renderChildrenWithProps({
      layerContainer: this.leafletElement,
      popupContainer: this.leafletElement
    });
  }
}

export default FeatureGroup;