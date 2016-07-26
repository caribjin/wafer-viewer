import { rectangle } from 'leaflet';
import boundsType from './types/bounds';
import { PropTypes } from 'react';
import Path from './Path';

class Rectangle extends Path {
  componentWillMount() {
    super.componentWillMount();
    const { bounds, style, map: _map, layerContainer: _lc, ...props } = this.props;
    this.leafletElement = rectangle(bounds, style, props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.bounds !== prevProps.bounds) {
      this.leafletElement.setBounds(this.props.bounds);
    }
    this.setStyleIfChanged(prevProps, this.props.style);
  }
}

Rectangle.propTypes = {
  bounds: boundsType.isRequired,
	style: PropTypes.object
};

Rectangle.defaultProps = {
	style: {}
};

export default Rectangle;
