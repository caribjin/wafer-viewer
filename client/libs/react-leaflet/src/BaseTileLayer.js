import { PropTypes } from 'react';
import MapLayer from './MapLayer';

class BaseTileLayer extends MapLayer {
  componentDidUpdate(prevProps) {
    const { opacity, zIndex } = this.props;
    if (opacity !== prevProps.opacity) {
      this.leafletElement.setOpacity(opacity);
    }
    if (zIndex !== prevProps.zIndex) {
      this.leafletElement.setZIndex(zIndex);
    }
  }

  render() {
    return null;
  }
}

BaseTileLayer.propTypes = {
	opacity: PropTypes.number,
	zIndex: PropTypes.number
};

export default BaseTileLayer;