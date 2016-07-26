import {PropTypes} from 'react';
import L, {control} from 'leaflet';
import styles from './css/minimap.css';
import MapControl from './MapControl';
let $ = require('jquery');
let jqueryUI = require('jquery-ui');
// let d3 = require('d3');
// let d3h = require('d3-hierarchy');

class MiniMap extends MapControl {
	constructor(props) {
		super(props);

		this.minimap = L.Control.extend({
			treeData: [],
			options: {
				position: 'topright',
				zoomLevelOffset: -5,
				zoomLevelFixed: false,
				centerFixed: false,
				zoomAnimation: false,
				autoToggleDisplay: false,
				minimized: false,
				width: 500,
				height: 500,
				collapsedWidth: 24,
				collapsedHeight: 24,
				aimingRectOptions: {color: '#ff7800', weight: 1, clickable: false},
				shadowRectOptions: {color: '#000000', weight: 1, clickable: false, opacity: 0, fillOpacity: 0},
				strings: {hideText: 'Hide Diagram', showText: 'Show Diagram'},
				mapOptions: {}  // Allows definition / override of Leaflet map options.
			},
			useCollapse: false,
			duration: 0,
			viewerWidth: 0,
			viewerHeight: 0,
			maxLabelLength: 0,
			svgGroup: null,
			dragListener: null,
			zoomListener: null,
			diagonal: null,
			panTimer: false,
			selectedNode: null,
			draggingNode: null,
			dragStarted: false,

			updateTreeData: function(objects) {
				this.treeData = this._makeTreeData(objects);
			},

			// layer is the map layer to be shown in the minimap
			initialize: function(props) {
				// this.objects = props.objects;
				this.updateTreeData(props.objects);

				function _objectWithoutProperties(obj, keys) {
					var target = {};
					for (var i in obj) {
						if (keys.indexOf(i) >= 0) continue;
						if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
						target[i] = obj[i];
					}
					return target;
				}

				var p = _objectWithoutProperties(props, ["map", "layerContainer"]);

				L.Util.setOptions(this, p);

				this.options.aimingRectOptions.clickable = false;
				this.options.shadowRectOptions.clickable = false;
			},

			onAdd: function(map) {
				// this._mainMap = map;

				this._container = L.DomUtil.create('div', 'leaflet-control-minimap');
				this._container.style.width = this.options.width + 'px';
				this._container.style.height = this.options.height + 'px';
				L.DomEvent.disableClickPropagation(this._container);
				L.DomEvent.on(this._container, 'mousewheel', L.DomEvent.stopPropagation);

				// this._layer = L.DomUtil.create('div', 'leaflet-control-minimap-layer');
				this._init();

				this._userToggledDisplay = false;
				this._minimized = true;

				this._addToggleButton();

				return this._container;
			},

			/**
			 * Diagram에서 그릴 전체 object list를 생성한다.
			 * @returns {Array}
			 * @private
			 */
			_makeTreeData(objects) {
				let newObjects = {};

				// Object 배열을 객체형으로 변환한다.
				objects.map(function(node) {
					let o = {
						_id: node._id,
						name: node.objectId
					};
					newObjects[node.objectId] = o;
				});

				objects.forEach(function(object) {
					let childrenIds = object.children || [];

					childrenIds.forEach(function(childId) {
						let child = _.find(newObjects, {_id: childId});

						if (child) {
							let parent = newObjects[object.objectId];
							(parent.children || (parent.children = [])).push(child);
						}
					})
				});

				// 최상위에 있는 Object은 그들을 children으로 가지고있는 object가 없기 때문에
				// 어떤것들이 최상위인지를 판단할 수 없다.
				// 따라서 zoomLevel이 가장 작은 object의 zoomLevel이 몇인지 확인한 후, 해당 zoomLEvel을 가진
				// 모든 object들을 최상위로 간주하고 이들을 Root object에 추가한다
				let minZoomLevelObject = _.minBy(objects, 'zoomLevel');
				let rootObjects = [];

				if (minZoomLevelObject) {
					rootObjects = _.filter(objects, {zoomLevel: minZoomLevelObject.zoomLevel});
				}

				let rootNewObjects = [];
				rootObjects.forEach(function(rootObject) {
					rootNewObjects.push(newObjects[rootObject.objectId]);
				});

				newObjects['__ROOT__'] = {
					name: 'Root',
					children: rootNewObjects
				};

				let treeData = [];
				treeData.push(newObjects.__ROOT__);

				return treeData;
			},

			_init() {
				let layer = this._container;

				console.log('init diagram');

				// d3.json("/public/flare.json", function(treeData) {
				let treeData = this.treeData;
				let margin = {top: 20, right: 120, bottom: 20, left: 120};
				// let width = 830 - margin.right - margin.left;
				// let height = 830 - margin.top - margin.bottom;
				let width = this.options.width;
				let height = this.options.height;
				let totalNodes = 0;

				// panning variables
				let panSpeed = 200;
				let panBoundary = 5; // Within 20px from edges will pan when dragging.

				// Misc. variables
				let i = 0;
				let root;

				// size of the diagram
				this.viewerWidth = width;
				this.viewerHeight = height;

				this.tree = d3.layout.tree().size([this.viewerHeight, this.viewerWidth]);

				// define a d3 diagonal projection for use by the node paths later on.
				this.diagonal = d3.svg.diagonal().projection(function(d) {
					return [d.y, d.x];
				});

				// Call visit function to establish maxLabelLength
				let self = this;
				this._visit(treeData[0], function(d) {
					totalNodes++;
					self.maxLabelLength = Math.max(d.name.length, self.maxLabelLength);
				}, function(d) {
					return d.children && d.children.length > 0 ? d.children : null;
				});

				// Sort the tree initially incase the JSON isn't in a sorted order.
				// this.sortTree();

				// define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
				this.zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", function() {
					self.svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
				});

				let l = d3.select(layer);
				let baseSvg = l.select('svg');

				// define the baseSvg, attaching a class for styling and the zoomListener
				if (!baseSvg[0][0]) {
					baseSvg = l.append("svg")
						.attr("width", this.viewerWidth)
						.attr("height", this.viewerHeight)
						.attr("class", "overlay")
						.call(this.zoomListener);
				} else {
					baseSvg.selectAll('g.node').remove();
					baseSvg.call(this.zoomListener);
				}

				let domNode;

				// Define the drag listeners for drag/drop behaviour of nodes.
				this.dragListener = d3.behavior.drag()
					.on("dragstart", function(d) {
						if (d == root) {
							return;
						}
						self.dragStarted = true;
						let nodes = self.tree.nodes(d);
						d3.event.sourceEvent.stopPropagation();
						// it's important that we suppress the mouseover event on the node being dragged. Otherwise it will absorb the mouseover event and the underlying node will not detect it d3.select(this).attr('pointer-events', 'none');
					})
					.on("drag", function(d) {
						if (d == root) {
							return;
						}
						if (self.dragStarted) {
							domNode = this;
							self.initiateDrag(self, d, domNode);
						}

						// get coords of mouseEvent relative to svg container to allow for panning
						let relCoords = d3.mouse($('svg').get(0));
						if (relCoords[0] < panBoundary) {
							this.panTimer = true;
							pan(this, 'left');
						} else if (relCoords[0] > ($('svg').width() - panBoundary)) {
							this.panTimer = true;
							pan(this, 'right');
						} else if (relCoords[1] < panBoundary) {
							this.panTimer = true;
							pan(this, 'up');
						} else if (relCoords[1] > ($('svg').height() - panBoundary)) {
							this.panTimer = true;
							pan(this, 'down');
						} else {
							try {
								clearTimeout(this.panTimer);
							} catch (e) {}
						}

						// d.x0 += d3.event.dy;
						// d.y0 += d3.event.dx;
						// var node = d3.select(this);
						// node.attr("transform", "translate(" + d.y0 + "," + d.x0 + ")");
						self.updateTempConnector();
					})
					.on("dragend", function(d) {
						if (d == root) {
							return;
						}
						domNode = this;
						if (self.selectedNode) {
							// now remove the element from the parent, and insert it into the new elements children
							var index = self.draggingNode.parent.children.indexOf(self.draggingNode);
							if (index > -1) {
								self.draggingNode.parent.children.splice(index, 1);
							}
							if (typeof self.selectedNode.children !== 'undefined' || typeof self.selectedNode._children !== 'undefined') {
								if (typeof self.selectedNode.children !== 'undefined') {
									self.selectedNode.children.push(self.draggingNode);
								} else {
									self.selectedNode._children.push(self.draggingNode);
								}
							} else {
								self.selectedNode.children = [];
								self.selectedNode.children.push(self.draggingNode);
							}
							// Make sure that the node being added to is expanded so user can see added node is correctly moved
							expand(self.selectedNode);
							self.sortTree();
							endDrag(self);
						} else {
							endDrag(self);
						}
					});

				function endDrag(self) {
					self.selectedNode = null;
					d3.selectAll('.ghostCircle').attr('class', 'ghostCircle');
					d3.select(domNode).attr('class', 'node');

					// now restore the mouseover event or we won't be able to drag a 2nd time
					d3.select(domNode).select('.ghostCircle').attr('pointer-events', '');
					self.updateTempConnector();

					if (self.draggingNode !== null) {
						self.update();
						// centerNode(draggingNode);
						self.draggingNode = null;
					}
				}

				// Helper functions for collapsing and expanding nodes.
				function collapse(d) {
					if (d.children) {
						d._children = d.children;
						d._children.forEach(collapse);
						d.children = null;
					}
				}

				function expand(d) {
					if (d._children) {
						d.children = d._children;
						d.children.forEach(expand);
						d._children = null;
					}
				}

				// Append a group which holds all nodes and which the zoom Listener can act upon.
				this.svgGroup = baseSvg.append("g");

				// Define the root
				root = treeData[0];
				root.x0 = this.viewerWidth / 2;
				root.y0 = this.viewerHeight / 2;

				// Layout the tree initially and center on the root node.
				this.update(root);
				// centerNode(root);
			},

			// A recursive helper function for performing some setup by walking through all nodes
			_visit: function(parent, visitFn, childrenFn) {
				if (!parent) return;

				visitFn(parent);

				var children = childrenFn(parent);
				if (children) {
					var count = children.length;
					for (var i = 0; i < count; i++) {
						this._visit(children[i], visitFn, childrenFn);
					}
				}
			},

			// sort the tree according to the node names
			sortTree: function() {
				this.tree.sort(function(a, b) {
					return b.name.toLowerCase() < a.name.toLowerCase() ? 1 : -1;
				});
			},

			// Function to update the temporary connector indicating dragging affiliation
			updateTempConnector: function() {
				var data = [];
				if (this.draggingNode !== null && this.selectedNode !== null) {
					// have to flip the source coordinates since we did this for the existing connectors on the original tree
					data = [{
						source: {
							x: this.selectedNode.y0,
							y: this.selectedNode.x0
						},
						target: {
							x: this.draggingNode.y0,
							y: this.draggingNode.x0
						}
					}];

					console.log(data);
				}
				var link = this.svgGroup.selectAll(".templink").data(data);

				link.enter().append("path")
					.attr("class", "templink")
					.attr("d", d3.svg.diagonal())
					.attr('pointer-events', 'none');

				link.attr("d", d3.svg.diagonal());
				link.exit().remove();
			},

			// TODO: Pan function, can be better implemented.
			pan: function(domNode, direction) {
				var speed = panSpeed;

				if (this.panTimer) {
					clearTimeout(this.panTimer);
					translateCoords = d3.transform(this.svgGroup.attr("transform"));
					if (direction == 'left' || direction == 'right') {
						translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
						translateY = translateCoords.translate[1];
					} else if (direction == 'up' || direction == 'down') {
						translateX = translateCoords.translate[0];
						translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
					}
					let scaleX = translateCoords.scale[0];
					let scaleY = translateCoords.scale[1];
					let scale = this.zoomListener.scale();

					this.svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
					d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
					this.zoomListener.scale(this.zoomListener.scale());
					this.zoomListener.translate([translateX, translateY]);
					this.panTimer = setTimeout(function() {
						pan(domNode, speed, direction);
					}, 50);
				}
			},

			initiateDrag: function(self, d, domNode) {
				let nodes = [];
				self.draggingNode = d;

				d3.select(domNode).select('.ghostCircle').attr('pointer-events', 'none');
				d3.selectAll('.ghostCircle').attr('class', 'ghostCircle show');
				d3.select(domNode).attr('class', 'node activeDrag');

				this.svgGroup.selectAll("g.node").sort(function(a, b) { // select the parent and sort the path's
					if (a.id != self.draggingNode.id) return 1; // a is not the hovered element, send "a" to the back
					else return -1; // a is the hovered element, bring "a" to the front
				});

				// if nodes has children, remove the links and nodes
				if (nodes.length > 1) {
					// remove link paths
					let links = self.tree.links(nodes);
					let nodePaths = self.svgGroup.selectAll("path.link")
						.data(links, function(d) {
							return d.target.id;
						}).remove();
					// remove child nodes
					let nodesExit = self.svgGroup.selectAll("g.node")
						.data(nodes, function(d) {
							return d.id;
						}).filter(function(d, i) {
							if (d.id == self.draggingNode.id) {
								return false;
							}
							return true;
						}).remove();
				}

				// remove parent link
				let parentLink = self.tree.links(self.tree.nodes(self.draggingNode.parent));
				self.svgGroup.selectAll('path.link').filter(function(d, i) {
					if (d.target.id == self.draggingNode.id) {
						return true;
					}
					return false;
				}).remove();

				self.dragStarted = null;
			},

			// Toggle children on click.
			click: function(d) {
				if (d3.event.defaultPrevented) return; // click suppressed

				if (this.useCollapse) {
					d = this.toggleChildren(d);
					this.update(d);
					// centerNode(d);
				}
			},

			// Toggle children function
			toggleChildren: function(d) {
				if (d.children) {
					d._children = d.children;
					d.children = null;
				} else if (d._children) {
					d.children = d._children;
					d._children = null;
				}
				return d;
			},

			// Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
			centerNode: function(source) {
				let scale = this.zoomListener.scale();
				let x = -source.y0;
				let y = -source.x0;
				x = x * scale + this.viewerWidth / 2;
				y = y * scale + this.viewerHeight / 2;
				d3.select('g').transition()
					.duration(this.duration)
					.attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
				this.zoomListener.scale(scale);
				this.zoomListener.translate([x, y]);
			},

			update: function(source) {
				console.log('update diagram');

				if (!source) {
					source = this.treeData[0];
				}

				let self = this;

				// Compute the new height, function counts total children of root node and sets tree height accordingly.
				// This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
				// This makes the layout more consistent.
				let levelWidth = [1];
				let childCount = function(level, n) {
					if (n.children && n.children.length > 0) {
						if (levelWidth.length <= level + 1) levelWidth.push(0);

						levelWidth[level + 1] += n.children.length;
						n.children.forEach(function(d) {
							childCount(level + 1, d);
						});
					}
				};
				childCount(0, source);
				let newHeight = d3.max(levelWidth) * 35; // 25 pixels per line
				this.tree = this.tree.size([newHeight, this.viewerWidth]);

				// Compute the new tree layout.
				let nodes = this.tree.nodes(source).reverse();
				let links = this.tree.links(nodes);

				// Set widths between levels based on maxLabelLength.
				nodes.forEach(function(d) {
					d.y = (d.depth * (self.maxLabelLength * 10)); //maxLabelLength * 10px
					// alternatively to keep a fixed scale one can set a fixed depth per level
					// Normalize for fixed-depth by commenting out below line
					// d.y = (d.depth * 500); //500px per level.
				});

				let i = 0;
				// Update the nodes…
				let node = this.svgGroup.selectAll("g.node").data(nodes, function(d) {
					return d.id || (d.id = ++i);
				});

				// Enter any new nodes at the parent's previous position.
				var nodeEnter = node.enter().append("g")
					.call(this.dragListener)
					.attr("class", "node")
					.attr("transform", function(d) {
						if (!source.y0 || !source.x0) {
							source.y0 = source.y;
							source.x0 = source.x;
						}
						return "translate(" + source.y0 + "," + source.x0 + ")";
					})
					.on('click', this.click);

				nodeEnter.append("circle")
					.attr('class', 'nodeCircle')
					.attr("r", 0)
					.style("fill", function(d) {
						return d._children ? "lightsteelblue" : "#fff";
					});

				nodeEnter.append("text")
					.attr("x", function(d) {
						return d.children || d._children ? -10 : 10;
					})
					.attr("dy", ".35em")
					.attr('class', 'nodeText')
					.attr("text-anchor", function(d) {
						return d.children || d._children ? "end" : "start";
					})
					.text(function(d) {
						return d.name;
					})
					.style("fill-opacity", 0);

				// phantom node to give us mouseover in a radius around it
				nodeEnter.append("circle")
					.attr('class', 'ghostCircle')
					.attr("r", 5)
					.attr("opacity", 0.2) // change this to zero to hide the target area
					.style("fill", "red")
					.attr('pointer-events', 'mouseover')
					.on("mouseover", function(node) {
						self.selectedNode = node;
						self.updateTempConnector();
						console.log(self.draggingNode.name + ' -> ' + self.selectedNode.name + ': ' + self.selectedNode.y0 + ' / ' + self.selectedNode.x0 + ' -> ' + self.draggingNode.y0 + ' / ' + self.draggingNode.x0);
					})
					.on("mouseout", function(node) {
						self.selectedNode = null;
						self.updateTempConnector();
					});

				// Update the text to reflect whether node has children or not.
				node.select('text')
					.attr("x", function(d) {
						return d.children || d._children ? -10 : 10;
					})
					.attr("text-anchor", function(d) {
						return d.children || d._children ? "end" : "start";
					})
					.text(function(d) {
						return d.name;
					});

				// Change the circle fill depending on whether it has children and is collapsed
				node.select("circle.nodeCircle")
					.attr("r", 4.5)
					.style("fill", function(d) {
						return d._children ? "lightsteelblue" : "#fff";
					});

				// Transition nodes to their new position.
				var nodeUpdate = node.transition()
					.duration(this.duration)
					.attr("transform", function(d) {
						return "translate(" + d.y + "," + d.x + ")";
					});

				// Fade the text in
				nodeUpdate.select("text").style("fill-opacity", 1);

				// Transition exiting nodes to the parent's new position.
				var nodeExit = node.exit().transition()
					.duration(this.duration)
					.attr("transform", function(d) {
						return "translate(" + source.y + "," + source.x + ")";
					})
					.remove();

				nodeExit.select("circle").attr("r", 0);
				nodeExit.select("text").style("fill-opacity", 0);

				// Update the links…
				var link = this.svgGroup.selectAll("path.link")
					.data(links, function(d) {
						return d.target.id;
					});

				// Enter any new links at the parent's previous position.
				link.enter().insert("path", "g")
					.attr("class", "link")
					.attr("d", function(d) {
						var o = {
							x: source.x0,
							y: source.y0
						};
						return self.diagonal({
							source: o,
							target: o
						});
					});

				// Transition links to their new position.
				link.transition()
					.duration(this.duration)
					.attr("d", self.diagonal);

				// Transition exiting nodes to the parent's new position.
				link.exit().transition()
					.duration(this.duration)
					.attr("d", function(d) {
						var o = {
							x: source.x,
							y: source.y
						};
						return self.diagonal({
							source: o,
							target: o
						});
					})
					.remove();

				// Stash the old positions for transition.
				nodes.forEach(function(d) {
					d.x0 = d.x;
					d.y0 = d.y;
				});
			},

			onRemove: function(map) {
				// this._mainMap.off('moveend', this._onMainMapMoved, this);
				// this._mainMap.off('move', this._onMainMapMoving, this);
				// this._miniMap.off('moveend', this._onMiniMapMoved, this);
				// this._miniMap.removeLayer(this._layer);
			},

			_addToggleButton: function() {
				this._toggleDisplayButton = this._createButton(
					'<i class="icon bars" />',
					this.options.strings.hideText,
					('leaflet-control-minimap-toggle-display leaflet-control-minimap-toggle-display-' + this.options.position),
					this._container,
					this._toggleDisplayButtonClicked, this);

				// this._toggleDisplayButton.style.width = this.options.collapsedWidth + 'px';
				// this._toggleDisplayButton.style.height = this.options.collapsedHeight + 'px';
				this._toggleDisplayButton.style.width = '16px';
				this._toggleDisplayButton.style.height = '16px';
			},

			_createButton: function(html, title, className, container, fn, context) {
				var link = L.DomUtil.create('a', className, container);
				link.innerHTML = html;
				link.href = '#';
				link.title = title;

				var stop = L.DomEvent.stopPropagation;

				L.DomEvent
					.on(link, 'click', stop)
					.on(link, 'mousedown', stop)
					.on(link, 'dblclick', stop)
					.on(link, 'click', L.DomEvent.preventDefault)
					.on(link, 'click', fn, context);

				return link;
			},

			_toggleDisplayButtonClicked: function() {
				this._userToggledDisplay = true;
				if (!this._minimized) {
					this._minimize();
					this._toggleDisplayButton.title = this.options.strings.showText;
				} else {
					this._restore();
					this._toggleDisplayButton.title = this.options.strings.hideText;
				}
			},

			_minimize: function() {
				this._container.style.width = this.options.collapsedWidth + 'px';
				this._container.style.height = this.options.collapsedHeight + 'px';
				this._toggleDisplayButton.className += (' minimized-' + this.options.position);
				this._minimized = true;
			},

			_restore: function() {
				this._container.style.width = this.options.width + 'px';
				this._container.style.height = this.options.height + 'px';
				this._toggleDisplayButton.className = this._toggleDisplayButton.className
					.replace('minimized-' + this.options.position, '');
				this._minimized = false;
			},

			_setDisplay: function(minimize) {
				if (minimize !== this._minimized) {
					if (!this._minimized) {
						this._minimize();
					} else {
						this._restore();
					}
				}
			},

			_onMainMapMoved: function(e) {
				if (!this._miniMapMoving) {
					var center = this.options.centerFixed || this._mainMap.getCenter();

					this._mainMapMoving = true;
					this._miniMap.setView(center, this._decideZoom(true));
					this._setDisplay(this._decideMinimized());
				} else {
					this._miniMapMoving = false;
				}
				this._aimingRect.setBounds(this._mainMap.getBounds());
			},

			_onMainMapMoving: function(e) {
				this._aimingRect.setBounds(this._mainMap.getBounds());
			},

			_onMiniMapMoveStarted: function(e) {
				if (!this.options.centerFixed) {
					var lastAimingRect = this._aimingRect.getBounds();
					var sw = this._miniMap.latLngToContainerPoint(lastAimingRect.getSouthWest());
					var ne = this._miniMap.latLngToContainerPoint(lastAimingRect.getNorthEast());
					this._lastAimingRectPosition = {sw: sw, ne: ne};
				}
			},

			_onMiniMapMoving: function(e) {
				if (!this.options.centerFixed) {
					if (!this._mainMapMoving && this._lastAimingRectPosition) {
						this._shadowRect.setBounds(new L.LatLngBounds(this._miniMap.containerPointToLatLng(this._lastAimingRectPosition.sw), this._miniMap.containerPointToLatLng(this._lastAimingRectPosition.ne)));
						this._shadowRect.setStyle({opacity: 1, fillOpacity: 0.3});
					}
				}
			},

			_onMiniMapMoved: function(e) {
				if (!this._mainMapMoving) {
					this._miniMapMoving = true;
					this._mainMap.setView(this._miniMap.getCenter(), this._decideZoom(false));
					this._shadowRect.setStyle({opacity: 0, fillOpacity: 0});
				} else {
					this._mainMapMoving = false;
				}
			},

			_isZoomLevelFixed: function() {
				var zoomLevelFixed = this.options.zoomLevelFixed;
				return this._isDefined(zoomLevelFixed) && this._isInteger(zoomLevelFixed);
			},

			_decideZoom: function(fromMaintoMini) {
				if (!this._isZoomLevelFixed()) {
					if (fromMaintoMini) {
						return this._mainMap.getZoom() + this.options.zoomLevelOffset;
					} else {
						var currentDiff = this._miniMap.getZoom() - this._mainMap.getZoom();
						var proposedZoom = this._miniMap.getZoom() - this.options.zoomLevelOffset;
						var toRet;

						if (currentDiff > this.options.zoomLevelOffset && this._mainMap.getZoom() < this._miniMap.getMinZoom() - this.options.zoomLevelOffset) {
							// This means the miniMap is zoomed out to the minimum zoom level and can't zoom any more.
							if (this._miniMap.getZoom() > this._lastMiniMapZoom) {
								// This means the user is trying to zoom in by using the minimap, zoom the main map.
								toRet = this._mainMap.getZoom() + 1;
								// Also we cheat and zoom the minimap out again to keep it visually consistent.
								this._miniMap.setZoom(this._miniMap.getZoom() - 1);
							} else {
								// Either the user is trying to zoom out past the mini map's min zoom or has just panned using it, we can't tell the difference.
								// Therefore, we ignore it!
								toRet = this._mainMap.getZoom();
							}
						} else {
							// This is what happens in the majority of cases, and always if you configure the min levels + offset in a sane fashion.
							toRet = proposedZoom;
						}
						this._lastMiniMapZoom = this._miniMap.getZoom();
						return toRet;
					}
				} else {
					if (fromMaintoMini) {
						return this.options.zoomLevelFixed;
					} else {
						return this._mainMap.getZoom();
					}
				}
			},

			_decideMinimized: function() {
				if (this._userToggledDisplay) {
					return this._minimized;
				}

				if (this.options.autoToggleDisplay) {
					if (this._mainMap.getBounds().contains(this._miniMap.getBounds())) {
						return true;
					}
					return false;
				}

				return this._minimized;
			},

			_isInteger: function(value) {
				return typeof value === 'number';
			},

			_isDefined: function(value) {
				return typeof value !== 'undefined';
			}
		});
	}

	componentDidUpdate(prevProps) {
		this.leafletElement.updateTreeData(this.props.objects);
		this.leafletElement.update();
	}

	componentWillMount() {
		this.leafletElement = new this.minimap(this.props);
	}

	render() {
		return null;
	}
}

MiniMap.propTypes = {};

MiniMap.defaultProps = {};

export default MiniMap;
