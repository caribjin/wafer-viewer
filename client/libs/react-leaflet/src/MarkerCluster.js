'use strict';

import React from 'react'
import ReactDOMServer from 'react-dom/server';
import L from 'leaflet';
import MarkerPopup from './MarkerPopup';
import MapLayer from './MapLayer';

// require('leaflet.markercluster');

class MarkerCluster extends MapLayer {
	getRandomLatLng() {
		var map = this.props.map;
		var bounds = map.getBounds();
		var southWest = bounds.getSouthWest(),
				northEast = bounds.getNorthEast(),
				lngSpan = northEast.lng - southWest.lng,
				latSpan = northEast.lat - southWest.lat;

		return new L.LatLng(
			southWest.lat + latSpan * Math.random(),
			southWest.lng + lngSpan * Math.random());
	}

	populateRandomVector() {
		let latlngs = [];
		for (let i = 0, len = 20; i < len; i++) {
			latlngs.push(this.getRandomLatLng());
		}
		let path = new L.Polyline(latlngs);
		this.props.map.addLayer(path);
	}

	componentWillMount() {
		super.componentWillMount();
		this.leafletElement = L.markerClusterGroup(this.props.clusterOption);
	}

	componentWillReceiveProps(nextProps) {
		super.componentWillReceiveProps(nextProps);

		// add markers to cluster layer
		if (nextProps.newMarkers.length > 0) {
			let markers = Object.assign({}, this.props.markers);
			let newMarkers = [];

			nextProps.newMarkers.forEach((obj) => {
				let markerPopup = ReactDOMServer.renderToStaticMarkup(
					<MarkerPopup
						caption={obj.caption}
						imgUrl={obj.imgUrl}
						profileUrl={obj.profileUrl}
					/>
				);

				// 좌펴정보가 없다면 랜덤좌표를 부여
				if (obj.latLng.length <= 0) {
					obj.latLng = this.getRandomLatLng();
				}

				let leafletMarker = L.marker(obj.latLng)
					.bindPopup(markerPopup, {maxHeight: 350, maxWidth: 250, minWidth: 250})
					.on('click', () => this.props.map.panTo(obj.latLng));

				markers[obj.id] = leafletMarker;
				newMarkers.push(leafletMarker);
			});

			this.leafletElement.addLayers(newMarkers);

			setTimeout(() => {
				this.props.updateMarkers(markers);
			}, 0);
		}

		// zoom to particular marker
		if (Object.keys(nextProps.focusMarker).length > 0) {
			let marker = this.props.markers[nextProps.focusMarker.id];

			this.leafletElement.zoomToShowLayer(marker, () => {
				this.props.map.panTo(nextProps.focusMarker.latLng);
				marker.openPopup();
			});
		}
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return null;
	}
}

MarkerCluster.propTypes = {
	map: React.PropTypes.object,
	markers: React.PropTypes.object,
	focusMarker: React.PropTypes.object,
	newMarkers: React.PropTypes.array,
	updateMarkers: React.PropTypes.func,
	clusterOption: React.PropTypes.object
};

MarkerCluster.defaultProps = {
	markers: {},
	newMarkers: [],
	focusMarker: {},
	clusterOption: {
		showCoverageOnHover: true,
		zoomToBoundsOnClick: true,
		spiderfyOnMaxZoom: true,
		removeOutsideVisibleBounds: false,
		spiderLegPolylineOptions: { weight: 1.5, color: '#222', opacity: 0.5 },

		animateAddingMarkers: true,
		disableClusteringAtZoom: 17,
		maxClusterRadius: 80,
		polygonOptions: {
			stroke: true,
			color: '#222',
			weight: 3,
			opacity: 0.8,
			fill: true,
			fillColor: '#6699cc',
			fillOpacity: 0.5,
			//fillRule: 'evenodd',
			//dashArray: [5, 5],
			lineCap: 'square',        // but, round, square
			clickable: false
			//className: 'bound-polygon'
		},
		singleMarkerMode: true,
		chunkLoading: true,

		iconCreateFunction: function(cluster) {
			//return L.divIcon({
			//  html: '<b>' + cluster.getChildCount() + '개</b>'
			//});
			var childCount = cluster.getChildCount();

			var c = ' marker-cluster-';
			if (childCount < 2) {
				c += 'small';
			} else if (childCount < 10) {
				c += 'medium';
			} else {
				c += 'large';
			}

			return new L.DivIcon({ html: '<div><span>' + childCount + '개 </span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
		}
	}
};

export default MarkerCluster;
