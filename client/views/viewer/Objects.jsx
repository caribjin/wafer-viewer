import {Marker, Rectangle, MapLayer} from '../../../client/libs/react-leaflet/src';
let Icon = L.divIcon;

const drawAreaPolygon = false;
const defaultOpacity = {
	default: 1,
	upperObject: 0.5,
	currentObject: 1,
	dragging: 0.6,
	readyToDrop: 0.6
};

class Objects extends React.Component {
	constructor(props) {
		super(props);
		this.opacity = defaultOpacity.default;
	}

	formatDate(date) {
		let d = new Date(parseInt(date, 10)),
				yy = d.getFullYear(),
				mm = d.getMonth() + 1,
				dd = d.getDate(),
				hh = d.getHours(),
				m = d.getMinutes(),
				ss = d.getSeconds();

		if (mm < 10) mm = '0' + mm;
		if (dd < 10) dd = '0' + dd;
		if (hh < 10) hh = '0' + hh;
		if (m < 10) m = '0' + m;
		if (ss < 10) ss = '0' + ss;

		return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + m + ':' + ss;
	}

	makeTable(object, objectLevel) {
		let objectId = object.objectId;
		let width = this.props.width || 0;
		let height = this.props.height || 0;

		let $div = $('<div/>').addClass('object-detail');

		if (width) $div.css('width', width);
		if (height) $div.css('height', height);

		let icon = '';
		let className = '';

		switch (object.objectType) {
			case 'object':
				icon = '';
				className = 'object';
				break;
			case 'custom':
				icon = 'square';
				className = 'custom';
				break;
			case 'map':
				icon = 'map';
				className = 'map';
				break;
		}

		let isSelected = this.props.selected ? 'selected' : '';

		let $objectType = $('<div><i class="icon ' + icon + '" /></div>').addClass('object-type ' + className + ' ' + isSelected);
		let $divTitle = $('<div/>').addClass('title').text(objectId + '(lv ' + object.zoomLevel + ')');
		// let $objectInfo = $('<div onclick="console.log(\'' +objectId+ '\');"><i class="icon info-circle" /></div>').addClass('object-info');
		let $divId = $('<div/>').css('margin-top', '-8px').text(object._id);
		// let $chartButton = $('<div title="' + object._id + '" onclick="alert(\'' +objectId+ '\');"><i class="icon area-chart" /></div>').addClass('chart-button');

		// $divTitle.append($chartButton);
		$divTitle.append($objectType);
		// $divTitle.append($objectInfo);
		$div.append($divTitle);
		$div.append($divId);

		if (objectLevel === 'current' || objectLevel === 'currentAlone') {
			let $table = $("<table/>").addClass('object-table');
			let $tr;

			$.each(object.fields, (fieldIndex, field) => {
				$tr = $('<tr/>');
				let $tdKey = $('<td />').addClass('header');
				let $tdValue = $('<td />').addClass('cell');

				$tdKey.text(field.key);
				let val = '' + object.data[fieldIndex];

				if (field.key.toLowerCase() === 'datatimestamp' && val.length > 0) {
					val = this.formatDate(val);
				}

				$tdValue.text(val);

				$tr.append($tdKey).append($tdValue);
				$table.append($tr);
			});
			$div.append($table);
		}

		return $div;
	}

	panToCenter(e) {
		// e.target._map.panTo(e.latlng);
		// console.log('pan to: ' + e.latlng.lat + ' / ' + e.latlng.lng)
	}

	objectHover(icon, id, objectId, isHover=false) {
		var html = icon.options.icon.options.htmlCache ? icon.options.icon.options.htmlCache : this.makeTable(this.props.data, this.props.objectLevel)[0].outerHTML;

		let iconOption = Icon({
			id: id,
			objectId: objectId,
			className: 'map-marker ' + (isHover ? 'hover' : ''),
			iconSize: null,
			html: html
		});

		icon.setIcon(iconOption);
	}

	onClick(e, id, objectId) {
		this.props.onClick(id, objectId);
	}

	onDblClick(e, id, objectId) {
		this.panToCenter(e);
		this.props.onDblClick(id, objectId);
	}

	onMouseOver(e, id, objectId) {
		this.objectHover(e.target, id, objectId, true);
		this.props.onMouseOver(id, objectId);
	}

	onMouseOut(e, id, objectId) {
		this.objectHover(e.target, id, objectId, false);
		this.props.onMouseOut(id, objectId);
	}

	onDragStart(e, id, objectId) {
		e.target.setOpacity(defaultOpacity.dragging);
		this.props.onDragStart(id, objectId);
	}

	onDrag(e, id, objectId) {
		// console.log('Now dragging: ' + id + ' - ' + objectId);
		this.props.onDrag(id, objectId, e.target._latlng, this.props.map);
	}

	onDragEnd(e, id, objectId) {
		this.objectHover(e.target, id, objectId, false);
		e.target.setOpacity(this.opacity);

		let latLng = e.target.getLatLng();
		let mousePos = e.target._map.latLngToLayerPoint(latLng);

		// console.log('mouse position: ' + e.target._map.latLngToLayerPoint(e.target._latlng));

		this.props.onDragEnd(id, objectId, latLng, mousePos, this.props.map);
	}

	componentWillReceiveProps(nextProps) {
		// console.log(this.props.data.objectId + ' : ' + this.props.position.lat + ' / ' + this.props.position.lng + ' - ' + nextProps.position.lat + ' / ' + nextProps.position.lng);
	}

	componentDidMount() {
		//this.props.onInitArea(this.props.id, this.props.data.objectId, this.calculateObjectArea());
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	// 좌표가 변했거나 objecType이 변한 Object만을 다시 그린다.
	// 	return (this.props.position !== nextProps.position || this.props.objectLevel !== nextProps.objectLevel);
	// }

	render() {
		let id = this.props.id;
		let objectId = this.props.data.objectId;
		let $table = this.makeTable(this.props.data, this.props.objectLevel);

		if (this.props.objectLevel === 'upper') {
			this.opacity = defaultOpacity.upperObject;
		} else {
			this.opacity = defaultOpacity.currentObject;
		}

		// console.log('draw object: ' + objectId);

		let icon = Icon({
			id: id,
			objectId: objectId,
			className: 'map-marker',
			iconSize: null,
			html: $table[0].outerHTML,
			htmlCache: $table[0].outerHTML
		});

		let objectAreaStyle = {
			stroke: false,
			fillColor: 'blue',
			fill: drawAreaPolygon
		};

		// console.log('selected : ' + objectId + ' - ' + this.props.selected);

		return (
			<div>
				<Rectangle bounds={this.props.area}
				           style={objectAreaStyle}
				           map={this.props.map}
				           layerContainer={this.props.layerContainer}
				/>
				<Marker key={id}
				        ref="marker"
				        draggable={true}
				        position={this.props.position}
				        icon={icon}
				        opacity={this.opacity}
				        riseOnHover={false}
				        onClick={(e) => this.onClick(e, id, objectId)}
				        onDblClick={(e) => this.onDblClick(e, id, objectId)}
				        onMouseOver={(e) => this.onMouseOver(e, id, objectId)}
				        onMouseOut={(e) => this.onMouseOut(e, id, objectId)}
				        onDragStart={(e) => this.onDragStart(e, id, objectId)}
				        onDrag={(e) => this.onDrag(e, id, objectId)}
				        onDragEnd={(e) => this.onDragEnd(e, id, objectId)}
				        map={this.props.map}
				        layerContainer={this.props.layerContainer}
				/>
			</div>
		);
	}
}

export default Objects;
