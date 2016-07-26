import { PropTypes } from 'react';
import { imageOverlay } from 'leaflet';

import boundsType from './types/bounds';
import MapLayer from './MapLayer';

class ImageOverlay extends MapLayer {
  componentWillMount() {
    super.componentWillMount();
    const { bounds, map: _map, layerContainer: _lc, url, ...props } = this.props;
    this.leafletElement = imageOverlay(url, bounds, props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url) {
      this.leafletElement.setUrl(this.props.url);
    }
    if (this.props.opacity !== prevProps.opacity) {
      this.leafletElement.setOpacity(this.props.opacity);
    }
  }

  render() {
    return null;
  }
}

ImageOverlay.propTypes = {
	attribution: PropTypes.string,
	bounds: boundsType.isRequired,
	opacity: PropTypes.number,
	url: PropTypes.string.isRequired
};

export default ImageOverlay;