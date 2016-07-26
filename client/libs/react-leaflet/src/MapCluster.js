'use strict';

import React from 'react';
import MarkerCluster from './MarkerCluster';
import LeafletMap from './Map';
import TileLayer from './TileLayer';
import ScaleControl from './ScaleControl';

class MapCluster extends React.Component {
	render() {
		return (
			<LeafletMap
				center={this.props.center}
				style={this.props.style}
				zoom={this.props.zoom}
			  onContextMenu={this.props.onContextMenu}
			>
				<TileLayer
					attribution={this.props.attribution}
					maxZoom={this.props.maxZoom}
					minZoom={this.props.minZoom}
					url={this.props.url}
				/>
				<ScaleControl position={'bottomright'} />
				<MarkerCluster
					focusMarker={this.props.focusMarker}
					markers={this.props.markers}
					newMarkers={this.props.newMarkers}
					updateMarkers={this.props.updateMarkers}
				/>
			</LeafletMap>
		);
	}
}

MapCluster.propTypes = {
	attribution: React.PropTypes.string,
	center: React.PropTypes.array,
	focusMarker: React.PropTypes.object,
	markers: React.PropTypes.object,
	maxZoom: React.PropTypes.number,
	minZoom: React.PropTypes.number,
	newMarkers: React.PropTypes.array,
	style: React.PropTypes.object,
	updateMarkers: React.PropTypes.func,
	url: React.PropTypes.string,
	zoom: React.PropTypes.number
};

MapCluster.defaultProps = {
	attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	center: [0, 0],
	maxZoom: 16,
	minZoom: 3,
	style: {},
	url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	zoom: 3
};

export default MapCluster;
