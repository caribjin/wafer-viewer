import L from 'leaflet';
import {Map, TileLayer, Marker, ScaleControl, ZoomControl, ZoomLabel, Button, MiniMap } from '../../../client/libs/react-leaflet/src';
import Objects from './Objects';
// import ChartPlayer from '../chart/ChartPlayer';
// import LeftSideBar from './plugin/LeftSideBar';
// import RightSideBar from './plugin/RightSideBar';
import store from './store';
// import _ from 'lodash';

// var MarkerCluster = L.MarkerCluster;
// require('leaflet.markercluster');

const _siteId = 2;
const displayLog = false;

const objectDrawOption = {
	initXOffset: 0,
	initYOffset: 60,
	objectWidth: 245,
	columnSize: 2,
	margin: 10,
	titleHeight: 54,
	rowHeight: 31
};

const defaultOpacity = {
	default: 1,
	upperObject: 0.5,
	currentObject: 1,
	dragging: 0.6,
	readyToDrop: 0.6
};


module.exports = React.createClass({
	displayName: 'Mapper',
	mixins: [store.mixin()],

	dragObject: '',
	dropObject: '',

	log: function(message, enable=true) {
		if (displayLog && enable) {
			console.log(message);
		}
	},

	getInitialState: function() {
		return {
			zoomLevel: 4,
			minZoom: 4,
			maxZoom: 18,
			center: {
				lat: 0,
				lng: 0
			},
			selectedObjectId: '',
			chartObjectId: '',
			objects: {
				define: [],
				data: {},
				position: {},
				zoomLevel: {}
			},
			objectList: []
		};
	},

	componentWillMount: function() {
		this.log('will mount');
		var self = this;

		store.read(_siteId, function(data) {
			if (data.success) {
				self.log('store read complete');

				self.mergeObjectDetail(data.body, function(list) {
					self.setState({
						objects: list
					});
				});
			} else {
				throw new Error('ADP ERROR: Error in fetch to objects list data');
			}
		});
	},

	mergeObjectDetail: function(objects, callback) {
		let objectIds = _.map(objects, 'objectId').join(',');

		store.detail(_siteId, objectIds, function(objects, data) {
			if (data.success) {
				this.log('store detail complete');

				let defines = data.result.define;
				let datas = data.result.data;

				defines.forEach(function(define) {
					let objectId = define.objectId;
					let fields = define.fields;
					let data = datas[objectId][0];

					let os = _.filter(objects, function(object) {
						return object.objectId == objectId;
					});

					os.forEach(function(o) {
						o.fields = fields;
						o.data = data;
					});
				});

				// define에서 fields 정보를 찾지 못한 object는 mapper에는 정보가 있으나 adp server에서 정보가 없는 것들이다.
				// 기본값으로 채워서 출력만은 가능하게 해준다
				objects.forEach(function(object) {
					if (!object.fields || object.fields.length === 0) {
						object.fields = [];
						object.data = [];
					}
				});

				callback(objects);
			}
		}.bind(this, objects));
	},

	componentDidMount: function() {
		this.log('did mount');
		// this.getObjectList();
		window.mapper = this;
	},

	componentWillUpdate: function() {
		this.log('will update');
	},

	componentDidUpdate: function() {
		this.log('will update');
	},

	/**
	 * 현재 스탭에서 그려지는 Object들을 포함하는 Bounds 내에서의 Center로 화면을 맞춘다.
	 */
	fitBoundsExtendObjects: function(displayObjects) {
		let objectAreas = [];
		let leaflet = this.refs.map.getLeafletElement();

		displayObjects.forEach(function(displayObject) {
			objectAreas.push(displayObject.area);
		});

		let extendArea = L.latLngBounds(objectAreas);
		let center = extendArea.getCenter();

		leaflet.panTo(center);
		return center;
	},

	observeData: function() {
		return {
			// objects: store.find({}),
		};
	},

	openChartPlayer: function(objectId) {
		console.log(objectId);
		// this.setState({
		// 	chartObjectId: objectId
		// });
		//
		// let dialog = this.refs.dialogChartPlayer;
		// dialog.show();
	},

	addObjectTemp: function() {
		let define = [
			{
				"objectId": "$OBJECTID$",
				"fields": [
					{
						"key": "datatimestamp",
						"type": "Int64"
					},
					{
						"key": "CPU",
						"type": "String"
					},
					{
						"key": "Memory",
						"type": "String"
					}
				]
			}
		];

		let dataString = '{"$OBJECTID$": [[1462948722223,"12.23","85.78"]]}';

		let s = this.state;
		let objectId = 'OBJECT ' + (parseInt(s.objects.define.length, 10) + 1);

		define[0].objectId = objectId;
		dataString = dataString.replace(/\$OBJECTID\$/gi, objectId);
		let data = JSON.parse(dataString);

		s.objects.define = defineConcat = s.objects.define.concat(define);

		// debugger;
		for (let key in data) {
			if (key !== '_id') {
				s.objects.data[key] = data[key];
			}
		}

		s.objects.position[objectId] = e.latlng;
		s.objects.zoomLevel[objectId] = this.state.zoomLevel;
		this.setState(s);
	},

	addObjects: function(objects, instanceObjectList) {
		let self = this;
		let doAddObjects = [];

		objects.forEach(function(object) {
			let exist = _.filter(self.state.objects, {objectId: object.dataItem.Name});
			if (!exist || exist.length === 0) {
				doAddObjects.push(object.dataItem.Name);
			}
		});

		let doAddObjectIds = doAddObjects.join(',');

		store.detail(_siteId, doAddObjectIds, function(data) {
			if (data.success) {
				let defines = data.result.define;
				let datas = data.result.data;

				defines.forEach(function(define) {
					let objectId = define.objectId;
					let fields = define.fields;
					let data = datas[objectId][0];

					let newObject = {
						objectId: objectId,
						objectType: 'object',
						objectLevel: 'current',
						area: [],
						children: [],
						fields: define.fields,
						data: data,
						width: 0,
						height: 0
					};

					self.createObject(newObject);
				});
			}
		});
	},

	_generateGuid: function() {
		let result = (m = Math, d = Date, h = 16, s = s => m.floor(s).toString(h)) => s(d.now() / 1000) + ' '.repeat(h).replace(/./g, () => s(m.random() * h));
		return result();
	},

	removeObject: function() {
		let targetObjectId = this.state.selectedObjectId;
		let self = this;

		if (targetObjectId) {
			n.msg.confirm('Remove Object', 'Are you sure remove this object?', function(status) {
				if (status) {
					let targetObject = _.find(self.state.objects, {_id: targetObjectId});
					let effectedObjects = [];

					if (targetObject) {
						self.removeObjectRecursive(self.state.objects, targetObject, effectedObjects);

						store.remove(_siteId, effectedObjects, function(data) {
							if (!data.success) {
								throw new Error(data.message);
							} else {
								self.setState({});
							}
						});
					}

					// parent object의 child에서 제거 (upper이면서 자기 자신이 아닌 object)
					let parentObject = _.find(self.state.objects, function(object) {
						return object._id !== targetObjectId && object.children.indexOf(targetObjectId) > -1;
					});

					if (parentObject) {
						_.remove(parentObject.children, function(val) {
							return val === targetObjectId;
						});

						store.save(_siteId, [parentObject], function(data) {
							if (!data.success) {
								throw new Error(data.message);
							} else {
								self.setState({});
							}
						});
					}
				}
			});
		}
	},

	removeObjectRecursive: function(objects, parent, refChildren) {
		refChildren.push(parent);

		if (parent && parent.children) {
			for (var i = 0, l = parent.children.length; i < l; i++) {
				let childId = parent.children[i];
				let childChild = _.find(objects, {_id: childId});

				this.removeObjectRecursive(objects, childChild, refChildren);
			}
		}

		_.remove(objects, {_id: parent._id});
	},

	createObject: function(newObject) {
		let self = this;
		let leaflet = this.refs.map.getLeafletElement();

		let leftTopPosition = leaflet.getBounds().getNorthWest();
		let leftTopPoint = leaflet.latLngToContainerPoint(leftTopPosition);
		let initPosition = leaflet.containerPointToLatLng([leftTopPoint.x + 70, leftTopPoint.y + 35]);

		if (!newObject) {
			let newObjects = _.filter(self.state.objects, function(object) {
				return object.objectId.indexOf('NEW OBJECT ') > -1
			});

			newObject = {
				objectId: 'NEW OBJECT ' + (parseInt(newObjects.length, 10) + 1),
				objectType: 'custom',
				objectLevel: 'current',
				area: [],
				children: [],
				fields: [],
				data: [],
				width: 0,
				height: 0
			};
		}

		newObject._id = this._generateGuid();
		newObject.position = initPosition;
		newObject.zoomLevel = this.state.zoomLevel;

		this.state.objects.push(newObject);

		store.save(_siteId, [newObject], function(data) {
			if (!data.success) {
				throw new Error(data.message);
			} else {
				self.setState({});
			}
		});
	},

	createMap: function() {
		//this.refs.sidebarRight.setActiveMenu();
	},

	handleWindowOnShow: function() {
		// this.refs.grid.resize();
	},

	handleWindowOnHide: function() {
		$('#divCursor').hide();
	},

	onChangeZoomLevel: function(zoomLevel) {
		this.log('zoomLevel changed: ' + zoomLevel, false);
		this.setState({zoomLevel: zoomLevel});
	},

	onObjectClick: function(id, objectId) {
		this.setState({
			selectedObjectId: id
		})
	},

	onObjectDblClick: function(id, objectId) {
		this.refs.sidebarRight.setActive(objectId);
	},

	onObjectMouseOver: function(id, objectId) {
		this.log('Mouse Over: ' + objectId, false);
	},

	onObjectMouseOut: function(id, objectId) {
		this.log('Mouse Out: ' + objectId, false);
	},

	onObjectDragStart: function(id, objectId) {
		this.dragObject = id;
		this.log('Drag Start: ' + objectId, false);
	},

	/**
	 * Object를 Drag해서 Object위로 올렸을때의 처리. Drag중인 Object의 시각적 표현
	 * @param sourceObjectId  {string} Drag 중인 Object의 Id
	 * @param targetObjectId  {string} Hover 중인 Object의 Id
	 */
	handleReadyToDrop: function(sourceId, sourceObjectId, targetId, targetObjectId, map) {
		this.log('Ready to Drop : ' + sourceObjectId + ' -> ' + targetObjectId);

		let targetMarker = this.findMarkerIcon(targetId, map);
		targetMarker.setOpacity(defaultOpacity.readyToDrop);
	},

	handleRestoreFromReadyToDrop: function(sourceId, sourceObjectId, targetId, targetObjectId, targetObjectLevel, map) {
		this.log('Restore ready to drop: ' + sourceObjectId + ' - ' + targetObjectId + ' : ' + targetObjectLevel);

		let targetMarker = this.findMarkerIcon(targetId, map);
		let opacity = targetObjectLevel === 'upper' ? defaultOpacity.upperObject : defaultOpacity.currentObject;
		targetMarker.setOpacity(opacity);
	},

	/**
	 * layer들을 검사하여 targetObjectId에 해당하는 marker의 instance를 찾는다.
	 * @param id    찾을 마커 아이콘의 id(object key)
	 * @param map   map
	 * @returns {T} marker object
	 */
	findMarkerIcon: function(id, map) {
		let targetMarker = _.find(map._layers, function(layer) {
			let icon = layer.options.icon;
			if (icon && icon.options) {
				return icon.options.id && icon.options.id === id;
			}
		});

		return targetMarker;
	},

	/**
	 * Object를 Object위로 끌어다 놨을때의 처리.
	 * targetObject와 그 하위의 Object의 zoomLevel을 sourceObjectId의 zoomLevel 하위로 설정한다.
	 * @param sourceId  {string} Drop할 Object의 Id
	 * @param targetId  {string} 대상 Object의 Id
	 */
	handleActionToDrop: function(sourceId, targetId, map) {
		this.log(sourceId + ' - ' + targetId);

		let sourceObject = _.find(this.state.objects, {_id: sourceId});
		let targetObject = null;

		if (targetId.length > 0) {
			targetObject = _.find(this.state.objects, {_id: targetId});
		}

		this.log('OK! Drop ' + sourceObject.objectId + ' -> ' + (targetObject ? targetObject.objectId : 'AIR'));

		let effectedObjects = [];

		// 특정 Object 하위로 들어간다.
		if (targetObject) {
			this.zoomLevelNormalize(this.state.objects, sourceObject, targetObject, effectedObjects);

			// 대상 object의 children에 이미 들어있는 object가 아니라면
			if (targetObject.children.indexOf(sourceId) === -1) {
				// 기존 parent object의 child에서 제거 (upper이면서 자기 자신이 아닌 object)
				let parentObject = _.find(this.state.objects, function(object) {
					return object._id !== sourceId && object.children.indexOf(sourceId) > -1;
				});

				if (parentObject) {
					_.remove(parentObject.children, function(val) {
						return val === sourceId;
					});

					effectedObjects.push(parentObject);
				}

				// 새로운 대상 object에 추가
				targetObject.children.push(sourceId);
				effectedObjects.push(targetObject);
			}

			let targetMarker = this.findMarkerIcon(targetId, map);
			let opacity = targetObject.objectLevel === 'upper' ? defaultOpacity.upperObject : defaultOpacity.currentObject;
			targetMarker.setOpacity(opacity);
		// 허공으로 들어간다.
		} else {
			// upper나 currentAlone object일 경우는 허공으로 drop할 일이 없다(원래부터 허공이다). 따라서 skip한다.
			if (sourceObject.objectLevel === 'upper' || sourceObject.objectLevel === 'currentAlone') return;

			this.zoomLevelNormalize(this.state.objects, sourceObject, targetObject, effectedObjects, sourceObject.zoomLevel - 1);

			// parent 객체를 찾는다.
			let parentObject = _.find(this.state.objects, function(object) {
				return object._id !== sourceId && object.children.indexOf(sourceId) > -1;
			});

			// 기존 parent object의 child에서 제거 (upper이면서 자기 자신이 아닌 object)
			if (parentObject) {
				_.remove(parentObject.children, function(val) {
					return val === sourceId;
				});

				effectedObjects.push(parentObject);
			}
		}

		// 모든 변화된 객체를 리턴한다
		return effectedObjects;
	},

	/**
	 * Object를 특정 Object의 zoomLevel 하위로 평준화
	 * 재귀호출을 통해 Object 하위의 모든 Object들도 함께 평준화한다.
	 * @param objects         objects list
	 * @param child           평준화할 object
	 * @param parent          기준 parent 객체
	 * @param refChildren     영향받은 모든 객체의 배열 (ref 변수
	 * @param initZoomLevel   기준 parent 객체가 없을 경우의 초기 zoomLevel
	 *                        (허공으로 drop 됐을 경우 parent가 없으므로, 한 스탭 zoomLevel로 평준화)
	 */
	zoomLevelNormalize: function(objects, child, parent, refChildren, initZoomLevel) {
		if (parent) {
			child.zoomLevel = parent.zoomLevel + 1;
		} else {
			child.zoomLevel = initZoomLevel;
		}

		refChildren.push(child);

		if (child && child.children) {
			for (var i = 0, l = child.children.length; i < l; i++) {
				let childId = child.children[i];
				let childChild = _.find(objects, {_id: childId});

				this.zoomLevelNormalize(objects, childChild, child, refChildren);
			}
		}
	},

	/**
	 * Object와 Object의 충돌 테스트
	 * 현재 마우스 위치가 Object Marker 영역안에 들어왔는지를 검사한다.
	 * 실제적으로는 Object Marker가 아니라, 해당 영역을 커버하는 Box polygon의 위치좌표안에 Drag중인 현재 마우스위 위치좌표가
	 * 들어왔는지를 검사.
	 * @param left      {number}    좌측 좌표
	 * @param top       {number}    상단 좌표
	 * @param right     {number}    우측 좌표
	 * @param bottom    {number}    하단 좌표
	 * @param position  {L.LatLng}  현재 마우스 좌표
	 * @returns         {boolean}   영역안에 있으면 true, 아니면 false
	 */
	checkObjectCollision: function(area, position) {
		let bounds = L.latLngBounds(area);
		return bounds.contains([position.lat, position.lng]);
	},

	/**
	 * 현재 Drag 중인 Object가 대상 Object로 Drop할 수 있는 Object인지를 검사.
	 * @param sourceId        Drag 중인 object의 _id
	 * @param sourceObjectId  Drag 중인 object의 objectId
	 * @param targetObject    검사 대상 object
	 */
	validateDropable: function(sourceId, sourceObjectId, targetObject) {
		let result = false;

		// 대상 Object가 현재 zoomLevel이 아니거나 Drag중인 object 자신이라면 검사 Skip
		if ((targetObject.zoomLevel === this.state.zoomLevel || targetObject.zoomLevel === this.state.zoomLevel - 1) && targetObject._id !== sourceId) {
			// 대상 Object가 Drag 중인 Object의 child중 하나라면 Skip (자기 자식에는 drop할 수 없다)
			let sourceObject = _.find(this.state.objects, {_id: sourceId});

			if (sourceObject) {
				let childrenIds = sourceObject.children;
				if (childrenIds.indexOf(targetObject._id) === -1) {
					result = true;
				}
			}
		}

		this.log('validate: source: ' + sourceObjectId + ' / target: ' + targetObject.objectId + ' - ' + result, false);

		return result;
	},

	onObjectDrag: function(draggingId, draggingObjectId, position, map) {
		// 충돌테스트는 밑에 놓여있는것(upper) 보다 위쪽에 떠있는것(child)가 먼저 검사되어야 하므로, zoomLevel에 따라 역순으로 sort한다.
		let objects = _.sortBy(this.state.objects, ['zoomLevel']).reverse();
		let searchContinue = true;

		objects.forEach(function(position, object) {
			if (searchContinue && this.validateDropable(draggingId, draggingObjectId, object)) {
				if (object.area && object.area.length > 0) {
					let isCollision = this.checkObjectCollision(object.area, position);

					this.log('collision: ' + isCollision + ' - ' + object.objectId + ' - ' + draggingId + ' : ' + draggingObjectId + ' / ' + object.area[0].lng + '/' + object.area[0].lat + ' - ' + object.area[1].lng + '/' + object.area[1].lng, false);

					if (isCollision) {
						this.dropObject = object._id;
						this.handleReadyToDrop(draggingId, draggingObjectId, object._id, object.objectId, map);
						searchContinue = false;
					} else {
						this.dropObject = '';
						this.handleRestoreFromReadyToDrop(draggingId, draggingObjectId, object._id, object.objectId, object.objectLevel, map);
					}
				}
			}
		}.bind(this, position));
	},

	onObjectDragEnd: function(id, objectId, latLng, mousePos, map) {
		this.log('Drop END: ' + id + ' - ' + objectId + ' / ' + latLng, false);

		let changedObjects = [];

		// state의 해당 object에 대한 position값을 갱신
		let targetObject = _.find(this.state.objects, {_id: id});

		if (targetObject) {
			targetObject.position = latLng;
			changedObjects.push(targetObject);
		}

		// Drop
		let effectedObjects = this.handleActionToDrop(this.dragObject, this.dropObject, map);

		if (effectedObjects && effectedObjects.length > 0) {
			changedObjects.push(effectedObjects);
			changedObjects = _.flatten(changedObjects);
		}

		changedObjects = _.uniq(changedObjects);

		if (changedObjects.length > 0) {
			store.save(_siteId, changedObjects, function(data) {
				if (!data.success) {
					throw new Error(data.message);
				}
			});
		}

		this.setState({});

		this.dragObject = '';
		this.dropObject = '';
	},

	onInitObjectArea: function(id, objectId, objectArea) {
		var objectsClone = this.state.objects;
		let targetObject = _.find(objectsClone, {_id: id});

		// object area bounds를 저장한다. state에는 반영하지 않는다.
		targetObject.area = objectArea;
	},

	getDisplayObjects: function() {
		let displayObjects = [];
		let self = this;

		// 상위 객체들을 출력 목록에 추가한다.
		let upperObjects = [];
		this.state.objects.forEach(function(object) {
			if (object.zoomLevel === self.state.zoomLevel - 1) {
				object.objectLevel = 'upper';
				upperObjects.push(object);
				displayObjects.push(object);
			}
		});

		// 현재 스탭의 객체들의 ID 목록을 구한다.
		let currentObjects = [];
		upperObjects.forEach(function(upperObject) {
			if (upperObject.children && upperObject.children.length > 0) {
				currentObjects.push(upperObject.children);
			}
		});
		currentObjects = _.flatten(currentObjects);

		// 현재 스탭의 실제 객체들을 구하여 출력목록에 추가한다.
		this.state.objects.forEach(function(object) {
			// 상위 객체에 소속되 있는 객체들
			if (currentObjects.indexOf(object._id) >= 0) {
				object.objectLevel = 'current';
				displayObjects.push(object);
			// 상위 객체에 소속되어 있지 않지만 현재 step에 해당되는 객체들
			} else if (currentObjects.indexOf(object._id) === -1 && object.zoomLevel === self.state.zoomLevel) {
				object.objectLevel = 'currentAlone';
				displayObjects.push(object);
			}
		});

		return displayObjects;
	},

	calculateObjectHeight: function(rowCount) {
		return objectDrawOption.titleHeight + (rowCount * objectDrawOption.rowHeight);
	},

	/**
	 * 현재 Object의 위치좌표를 계산한다. 계산 과정은 아래와 같다.
	 * 1. object type이 upper인 object들 찾는다.
	 * 2. 찾은 parent object의 좌표를 확인한다.
	 * 3. upper children들을 loop한다.
	 * 3. parent object의 좌표를 기준점으로 child index 만큼에 해당하는 좌표를 구한다.
	 *    이 때 object width = 245, column size = 2로 하여 계산한다.
	 * 4. child들을 다 그렸다면 upper들을 대상으로 하여 child들의 area 전체를 포괄하는 area를 turf로 계산한 뒤 그것을 upper의 area로 사용한다
	 * 5. 해당 upper의 area 정보로 pixel 단위의 width와 height로 변환한다
	 * 6. 계산된 width, height값으로 upper의 marker icon을 다시 그린다.
	 * @returns {LatLng}  object 좌표
	 */
	calculateObjectPosition: function(displayObjects) {
		let self = this;
		let upperObjects = _.filter(displayObjects, {objectLevel: 'upper'});
		let leaflet = this.refs.map.getLeafletElement();

		upperObjects.forEach(function(upperObject) {
			let upperObjectPosition = upperObject.position;
			let upperObjectPoint = leaflet.project(L.latLng(upperObjectPosition.lat, upperObjectPosition.lng), self.state.zoomLevel);
			let children = upperObject.children;
			let heightSummary = [0, 0];

			children.forEach(function(childId, index) {
				let child = _.find(self.state.objects, {_id: childId});
				if (child) {
					let objectHeight = self.calculateObjectHeight(child.fields.length);

					let column = (index % objectDrawOption.columnSize);
					let xOffset = objectDrawOption.initXOffset + (column * objectDrawOption.objectWidth) + (column > 0 ? objectDrawOption.margin : 0);
					let yOffset = objectDrawOption.initYOffset + heightSummary[column];

					heightSummary[column] += (objectHeight + objectDrawOption.margin);

					let point = upperObjectPoint.add([xOffset, yOffset]);
					child.position = leaflet.unproject(point, self.state.zoomLevel);
				}
			});
		});

		return displayObjects;
	},

	/**
	 * 현재 Object의 영역을 계산한다
	 * @param displayObjects    초기 좌표. 좌표가 넘어오면 해당 좌표로 그리고, 없다면 props에 넘어온 최초 좌표로 그린다.
	 * @returns {*[]}
	 */
	calculateObjectArea: function(displayObjects) {
		let areaLeftTop;
		let objectHeight = 0;
		let self = this;
		let leaflet = this.refs.map.getLeafletElement();

		displayObjects.forEach(function(displayObject) {
			areaLeftTop = new L.LatLng(displayObject.position.lat, displayObject.position.lng);

			objectHeight = self.calculateObjectHeight(displayObject.fields.length);

			let projectedAreaLeftTop = leaflet.project(areaLeftTop, self.state.zoomLevel);
			let x = projectedAreaLeftTop.x + objectDrawOption.objectWidth;
			let y = projectedAreaLeftTop.y + objectHeight;
			let areaRightBottom = leaflet.unproject([x, y], self.state.zoomLevel);

			let o = _.find(self.state.objects, {_id: displayObject._id});
			o.area = [areaLeftTop, areaRightBottom];
			o.width = 0;
			o.height = 0;
		});

		// 최종 upper object들의 area를 재계산한다. upper object는 child object들의 모든 area를 포괄하는 새로운 area를 갖는다.
		let upperObjects = _.filter(displayObjects, {objectLevel: 'upper'});

		upperObjects.forEach(function(upperObject) {
			let children = upperObject.children;
			let childrenAreas = [];

			children.forEach(function(childId, index) {
				let child = _.find(self.state.objects, {_id: childId});
				if (child) {
					childrenAreas.push(child.area);
				}
			});

			if (childrenAreas.length > 0) {
				let extendArea = L.latLngBounds(childrenAreas);
				let southEastPoint = leaflet.latLngToContainerPoint(extendArea.getSouthEast());
				// 하단 margin을 추가한 새로운 좌표를 구한다.
				let newSouthEastLatLng = leaflet.containerPointToLatLng([southEastPoint.x, southEastPoint.y + objectDrawOption.margin]);
				upperObject.area = [L.latLng(upperObject.position.lat, upperObject.position.lng), newSouthEastLatLng];
			}

			// upper object의 area 정보를 가지고 point 단위의 size를 구한다.
			let leftTopPoint = leaflet.latLngToContainerPoint(upperObject.area[0]);
			let rightBottomPoint = leaflet.latLngToContainerPoint(upperObject.area[1]);
			let bounds = L.bounds([leftTopPoint.x, leftTopPoint.y], [rightBottomPoint.x, rightBottomPoint.y]);
			let size = bounds.getSize();

			upperObject.width = size.x;
			upperObject.height = size.y;
		});

		return displayObjects;
	},

	handleMenuChange(menu, item){
		this.refs.sidebarLeft.setActiveMenu(item);
	},

	render: function() {
		this.log('render');
		let objects = [];

		if (this.state.objects && this.state.objects.length > 0) {
			// // 최종적으로 출력할 object 목록을 구한다.
			let displayObjects = this.getDisplayObjects();

			// 모든 출력 object들의 position을 재계산
			displayObjects = this.calculateObjectPosition(displayObjects);

			// 모든 출력 object들의 area를 재계산
			displayObjects = this.calculateObjectArea(displayObjects);

			// this.fitBoundsExtendObjects(displayObjects);

			displayObjects.forEach(function(object) {
				// position의 변화에 대해서만 redraw를 하기 위해, position만 별도 props로 전달한다.
				let position = object.position;
				let clone = Object.assign({}, object);
				delete clone['position'];

				let isSelected = this.state.selectedObjectId === object._id;

				objects.push(
					<Objects key={object._id}
					         id={object._id}
					         objectLevel={object.objectLevel}
					         data={clone}
					         position={object.position}
					         selected={isSelected}
					         area={object.area}
					         width={object.width}
					         height={object.height}
					         onInitArea={this.onInitObjectArea}
					         onClick={this.onObjectClick}
					         onDblClick={this.onObjectDblClick}
					         onMouseOver={this.onObjectMouseOver}
					         onMouseOut={this.onObjectMouseOut}
					         onDragStart={this.onObjectDragStart}
					         onDrag={this.onObjectDrag}
					         onDragEnd={this.onObjectDragEnd}
					/>
				);
			}.bind(this));
		}

		return (
			<n.FlexLayout direction="horizontal">
				<n.Menu
					ui={"icon"}
					options={[
	            {icon: 'th-large', value: 'OBJECTS'},
	            {icon: 'map-o', value: 'MAPS'},
	            {icon: 'bookmark', value: 'BOOKMARKS'}
	          ]}
					direction="vertical"
					width={36}
					fit={true}
					style={{borderTop: 'none'}}
					onChange={this.handleMenuChange} />

				<div flex={1} id="mapper-wrapper" className="layout-fit">
					<div ref="pusher" className="pusher" style={{ transform: 'none' }}>
						<div className="layout-fit">
							{/* object map */}
							<Map ref="map"
									 center={this.state.center}
							     zoom={this.state.zoomLevel}
							     minZoom={this.state.minZoom}
							     maxZoom={this.state.maxZoom}
							     zoomControl={false}
							     onChangeZoomLevel={this.onChangeZoomLevel}>
								<MiniMap position="topright" objects={this.state.objects} />
								<ZoomControl position={'bottomleft'} />
								<TileLayer tileSize={'350'} useCache={true} />
								<Button icon='square-o' onClick={() => {this.createObject()}} title="Create Custom Object" id="createCustomObject" />
								{/*
								<Button icon='map-o' onClick={this.createMap} title="Create Map" id="createMap" />
								 */}
								<Button icon='trash-o' onClick={this.removeObject} title="Remove Object" id="removeObject" />
								<ZoomLabel position="bottomleft" />
								{objects}
							</Map>
						</div>
					</div>
				</div>
			</n.FlexLayout>
		);
	}
});
