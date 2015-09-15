/*
	INDEX:
		CONFIG:
			IND:CONFIG 			-- 		Initial visualization configuration
		FORCE:
			IND:FORCE:FUNC 		--		Visualization function
			IND:FORCE:SCALES 	--	 	Ordinal scale definitions
			IND:FORCE:LAYOUT 	--		Force setup and parameter handling
				IND:FORCE:LAYOUT:TICKS		--		Tick actions
			IND:FORCE:NODES  	--		Node creation, updating
			IND:FORCE:LINKS 	--		Link creation, updating
			IND:FORCE:OTHER 	--		Other general functions for the visualization
*/

/***************************************************************************
  *************************************************************************
   ***********************************************************************
		IND:CONFIG
   ***********************************************************************	
  *************************************************************************
****************************************************************************/
var visualizationFunctions = {
	/****************************************************************************
	  **************************************************************************
		IND:FORCE:FUNC
	  **************************************************************************
	*****************************************************************************/
	forceNetwork: function(element, data, opts) {
		var network = new VisualizationClass();
		var nodeData = data.nodes.data;
		var edgeData = data.edges.data;
		network.AngularArgs.element = element;
		network.AngularArgs.data = data;
		network.AngularArgs.opts = opts;
		network.config = network.CreateBaseConfig();
		network.SVG = network.config.easySVG(element[0])
			.append("g")
			.attr("class", "canvas " + opts.ngIdentifier)
			.attr("transform", "translate(" + (network.config.margins.left + network.config.dims.width / 2) + "," + (network.config.margins.top + network.config.dims.height / 2) + ")")
		Utilities.runJSONFuncs(network.config.meta, [nodeData, network.config]);
		network.VisFunc = function() {
			console.log("Creating Force Network")
			var nodeData = network.AngularArgs.data.nodes.data;
			var edgeData = network.AngularArgs.data.edges.data;
			var initVis = new Object();
			network.meta = network.config.meta;
			/***************************************************************************
				IND:FORCE:SCALES
			  ***************************************************************************/
			network.Scales.nodeSizeScale = null;
			network.Scales.nodeColorScale = null;
			network.Scales.edgeStrokeScale = null;
			network.Scales.edgeOpacityScale = null;
			/***************************************************************************
				IND:FORCE:LAYOUT
			  ***************************************************************************/
			network.SVG.force = d3.layout.force()
				.nodes(nodeData)
				.links(edgeData);
			network.SVG.force.physicsOn = true;
			network.SVG.force.physicsToggle = function() {
				if (network.SVG.force.physicsOn) {
					network.SVG.force.physicsOn = false;
					this.stop();
				} else {
					network.SVG.force.physicsOn = true;
					this.start();
				};
			};
			var drag = network.SVG.force.drag();
			Object.keys(network.meta.visualization.forceLayout).forEach(function(layoutAttr) {
				if (network.meta.visualization.forceLayout[layoutAttr] != null) {
					network.SVG.force[layoutAttr](network.meta.visualization.forceLayout[layoutAttr]);
				};
			});
			network.SVG.force.start();
			/* 	IND:FORCE:LAYOUT:TICKS	*/
			var i = 0;
			network.SVG.force.on("tick", function() {
				if (i % 1 == 0) {
					nodes.each(function() {
						var currNode = d3.select(this);
						if (!currNode.classed("filtered")) {
							currNode.attr("transform", function(d) {
								return "translate(" + forceBoundsCollisionCheck(d.x, network.config.dims.width) + "," + forceBoundsCollisionCheck(d.y, network.config.dims.height) + ")"
							});
						}
					});
					links.each(function() {
						var currLink = d3.select(this);
						if (!currLink.classed("filtered")) {
							currLink.attr("d", function(d) {
								return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
							});
						}
					});
				};
				if (i >= 100) i = 0;
				i++;
			});
			network.SVG.updateAll = function() {
				network.SVG.updateNodes();
				network.SVG.updateLinks();
			}
			/***************************************************************************
				IND:FORCE:LINKS
			  ***************************************************************************/
			var links = network.SVG.selectAll(".link")
				.data(edgeData)
				.enter().append("path")
				.attr("class", function(d, i) {
					var dashed = (Math.floor(Math.random() * 20) % 2 == 0) ? "dashed" : "";
					return dashed + " link e s" + d.source.id + " t" + d.target.id;
				}).call(drag);
			network.SVG.links = links;
			network.SVG.updateLinks = function(args) {
				var width;
				var opacity;
				if (args == "" || typeof args == "undefined") {
					width = network.config.meta.edges.styleEncoding.strokeWidth.attr;
					opacity = network.config.meta.edges.styleEncoding.opacity.attr;
				} else {
					var splitArgs = args.replace(" ", "").split(",");
					width = splitArgs[0];
					opacity = splitArgs[1];
				}

				network.Scales.edgeStrokeScale = d3.scale.linear()
					.domain(makeSimpleRange(edgeData, width))
					.range(network.config.meta.edges.styleEncoding.strokeWidth.range);
				network.Scales.edgeOpacityScale = d3.scale.linear()
					.domain(makeSimpleRange(edgeData, opacity))
					.range(network.config.meta.edges.styleEncoding.opacity.range);

				links
					.style("stroke-width", function(d) {
						return network.Scales.edgeStrokeScale(d[width]);
					})
					.style("opacity", function(d) {
						return network.Scales.edgeOpacityScale(d[opacity]);
					});
			};
			/***************************************************************************
				IND:FORCE:NODES
			  ***************************************************************************/
			var nodes = network.SVG.selectAll(".node")
				.data(nodeData)
				.enter().append("g")
				.attr("class", function(d, i) {
					return "node g g" + d[network.config.meta.nodes.identifier.attr];
				}).call(drag);
			nodes.append("circle")
				.attr("class", function(d, i) {
					return d[network.config.meta.labels.styleEncoding.attr] + " n n" + d[network.config.meta.nodes.identifier.attr];
				});
			network.SVG.nodes = nodes;
			network.SVG.append("g")
				.attr("class", "legendSize")
				.attr("transform", "translate(20, 40)");
			network.SVG.updateNodes = function(arg) {
				if (arg == "" || typeof arg == "undefined") {
					network.SVG.nodeSizeAttr = network.config.meta.nodes.styleEncoding.radius.attr;
					network.SVG.nodeColorAttr = network.config.meta.nodes.styleEncoding.color.attr;
				} else {
					network.SVG.nodeSizeAttr = arg;
					network.SVG.nodeColorAttr = arg;
				}
				network.Scales.nodeSizeScale = d3.scale.linear()
					.domain(makeSimpleRange(nodeData, network.SVG.nodeSizeAttr))
					.range(network.config.meta.nodes.styleEncoding.radius.range);
				network.Scales.nodeColorScale = d3.scale.linear()
					.domain(makeSimpleRange(nodeData, network.SVG.nodeColorAttr))
					.range(network.config.meta.nodes.styleEncoding.color.range);

				network.SVG.selectAll(".n")
					.attr("r", function(d, i) {
						return network.Scales.nodeSizeScale(d[network.SVG.nodeSizeAttr]);
					})
					.style("fill", function(d, i) {
						return network.Scales.nodeColorScale(d[network.SVG.nodeColorAttr]);
					});

				network.SVG.selectAll("text").remove();
				nodes.append("text").attr("class", function(d, i) {
					return "l l" + d[network.config.meta.nodes.identifier.attr];
				});
				network.SVG.selectAll("text")
					.attr("dx", 0)
					.attr("dy", 10)
					.text(function(d, i) {
						if (d[network.SVG.nodeSizeAttr] > network.Scales.nodeSizeScale.domain()[1] * network.config.meta.labels.styleEncoding.displayTolerance) {
							return d[network.config.meta.labels.styleEncoding.attr];
						} else {
							this.remove();
						};
					});
				nodes.moveToFront();
				network.SVG.selectAll("text").moveToFront();
			};
			/***************************************************************************
				IND:FORCE:OTHER
			  ***************************************************************************/
			network.SVG.updateAll();
			function forceBoundsCollisionCheck(val, lim) {
				if (val <= -lim / 2) return -lim / 2;
				if (val >= lim / 2) return lim / 2;
				return val;
			};


			// network.SVG.append("rect")
			// 	.attr("x", 20)
			// 	.attr("y", 20)
			// 	.attr("width", 250)
			// 	.attr("height", 250)
			// 	.style("fill", "none")
			// 	.style("stroke", "#FFF")

			// network.SVG.selectAll(".n").on("dragstart", function(){

			// 	var m = d3.mouse(this);
			// 	console.log(m);
			// 	if (m[0] >= 20 && m[0] <= 270 && m[1] >= 20 && m[1] <= 270) {
			// 		console.log("In")
			// 	}
			// })


			return this;
		}
		return network;
	},
	componentBarGraph: function(element, data, opts) {
		var network = new VisualizationClass();
		network.AngularArgs.element = element;
		network.AngularArgs.data = data;
		network.AngularArgs.opts = opts;
		network.config = network.CreateBaseConfig();

		network.SVG = d3.select(element[0])
			.append("svg")
			.attr("width", network.config.dims.width + network.config.margins.left - network.config.margins.right)
			.attr("height", network.config.dims.height + network.config.margins.top - network.config.margins.bottom)
			// .call(d3.behavior.zoom().on("zoom", function () {
			// 	console.log(d3.mouse(this)[0])
			// 	svg.attr("x", + d3.mouse(this)[0])
			// }))									
			.append("g")
			.attr("class", "canvas " + opts.ngIdentifier)
		network.parentVis = visualizations[opts.ngComponentFor];

		network.VisFunc = function() {
			console.log("Creating Bar Graph");
			// svg.call(d3.behavior.drag().on("dragstart", function() {
			// 	this.__translated__ = d3.event.dx;
			// })					
			// .on("drag", function(d, i) {
			// 	console.log(this.__translated__);
			// 	d3.selectAll("rect").attr("x", function(d) {
			// 			return parseInt(d3.select(this).attr("x")) + Math.min(d3.event.dx)
			// 	})
			// }))
			var initData = network.GetData();
			var orientation = {
				"vertical": {
					"range": network.config.dims.fixedWidth,
					"barWidth": function(d, i) {
						return network.Scales.nodeBarSizeScale(d);
					},
					"barHeight": function(d, i) {
						return network.config.dims.fixedHeight / initData.length;
					},
					"x": function(d, i) {
						return 0;
					},
					"y": function(d, i) {
						return d * i;
					}
				},
				"horizontal": {
					"range": network.config.dims.fixedHeight,
					"barWidth": function(d, i) {
						return network.config.dims.fixedWidth / initData.length;
					},
					"barHeight": function(d, i) {
						return network.Scales.nodeBarSizeScale(d);
					},
					"x": function(d, i) {
						return d * i;
					},
					"y": function(d, i) {
						return network.config.dims.height - d - network.config.margins.bottom;
					}
				}
			}[opts.ngOrientation];
			Utilities.runJSONFuncs(network.config.meta, [initData, network.config]);
			network.Scales.nodeBarSizeScale = d3.scale.linear()
				.domain(makeSimpleRange(initData, network.parentVis.SVG.nodeSizeAttr))
				.range([5, orientation.range]);

			var bars = network.SVG.selectAll(".bar")
				.data(initData)
				.enter()
				.append("rect")
				.attr("class", function(d, i) {
					return "b b" + d.id;
				})

			network.SVG.bars = bars;

			bars.each(function(d, i) {
				var currBar = d3.select(this);
				var barNode = network.parentVis.SVG.selectAll(".n" + d.id);
				var barWidth = orientation.barWidth(d[network.parentVis.SVG.nodeSizeAttr]);
				var barHeight = orientation.barHeight(d[network.parentVis.SVG.nodeSizeAttr]);
				currBar
					.attr("x", orientation.x(barWidth, i))
					.attr("y", orientation.y(barHeight, i))
					.attr("width", barWidth)
					.attr("height", barHeight)
					.attr("fill", barNode.attr().style("fill"))
			})
			return this;
		};
		return network;
	},
	componentNodeSizeLegend: function(element, data, opts) {
		var network = new VisualizationClass();
		network.AngularArgs.element = element;
		network.AngularArgs.data = data;
		network.AngularArgs.opts = opts;
		network.config = network.CreateBaseConfig();
		network.parentVis = visualizations[opts.ngComponentFor];
		
		network.SVG = d3.select(element[0])
			.append("svg")
			.attr("width", network.config.dims.width + network.config.margins.left - network.config.margins.right)
			.attr("height", network.config.dims.height + network.config.margins.top - network.config.margins.bottom)
			.append("g")
			.attr("class", "canvas " + opts.ngIdentifier);
		network.parentVis = visualizations[opts.ngComponentFor];

		network.VisFunc = function() {
			console.log("Creating this thing");
			var legendData = [];
			network.Scales.legendScale = d3.scale.linear()
				.domain([0, 3])
				.range(network.parentVis.Scales.nodeSizeScale.range());
			for (var i = 0; i < 4; i++) {
				legendData.push(network.Scales.legendScale(i));
			}
			var legendGroup = network.SVG.selectAll(".legendItem")
				.data(legendData)
				.enter()
				.append("g")
				.attr("class", "legendItem legend");

			function setCX(d, i) {
				var base = network.Scales.legendScale.range()[1];
				if (i > 0) {
					base += d * i + legendData[0] * i + 10 * i;
				}
				return base;
			}

			function setCY(d, i) {
				var base = network.Scales.legendScale.range()[1] * 2 - 20;
				if (i < legendData.length - 1) {
					base += (legendData[legendData.length - 1] - d);
				}
				return base;
			}
			legendGroup.append("circle")
				.attr("r", function(d, i) {
					return d;
				})
				.attr("cx", function(d, i) {
					return setCX(d, i);
				})
				.attr("cy", function(d, i) {
					return setCY(d, i);
				})
				.style("stroke", "#FFF")
				.style("fill", "none");

			legendGroup.append("text")
				.attr("class", "legendItemText")
				.attr("dx", function(d, i) {
					return setCX(d, i);
				})
				.attr("dy", function(d, i) {
					return setCY(d, i) + d + 13;
				})
				.attr("text-anchor", "middle")
				.text(function(d, i) {
					return d;
				})
			network.SVG.append("text")
				.attr("x", "50%")
				.attr("y", "90%")
				.attr("text-anchor", "middle")
				.text(network.parentVis.SVG.nodeSizeAttr);
			return this;
		}
		return network;
	},
	componentNodeColorLegend: function(element, data, opts) {
		var network = new VisualizationClass();
		network.AngularArgs.element = element;
		network.AngularArgs.data = data;
		network.AngularArgs.opts = opts;
		network.config = network.CreateBaseConfig();
		network.parentVis = visualizations[opts.ngComponentFor];
		
		network.SVG = d3.select(element[0])
			.append("svg")
			.attr("width", network.config.dims.width + network.config.margins.left - network.config.margins.right)
			.attr("height", network.config.dims.height + network.config.margins.top - network.config.margins.bottom)
			.append("g")
			.attr("class", "canvas " + opts.ngIdentifier);
		network.parentVis = visualizations[opts.ngComponentFor];

		network.VisFunc = function() {
			console.log("Creating this other thing");
			var legendData = network.parentVis.Scales.nodeColorScale.range();
			var w = network.config.dims.width * .75;
			var gradient = network.SVG.append("svg:defs")
				.append("svg:linearGradient")
				.attr("id", "gradient")
				.attr("x1", "05%")
				.attr("y1", "0%")
				.attr("x2", "100%")
				.attr("y2", "0%")
				.attr("spreadMethod", "pad");
			for (var i = 0; i < legendData.length; i++) {
				gradient.append("svg:stop")
					.attr("offset", w / legendData.length * i + 12.5 + "%")
					.attr("stop-color", legendData[i])
					.attr("stop-opacity", 1);
				network.SVG.append("text")
					.attr("x", w / legendData.length * i + 12.5 + "%")
					.attr("y", "50%")
					.attr("text-anchor", "middle")
					.text(network.parentVis.Scales.nodeColorScale.domain()[i])
			}
			network.SVG.append("svg:rect")
				.attr("class", "gradientRect")
				.attr("width", w)
				.attr("height", "25%")
				.attr("x", "12.5%")
				.attr("y", "10%")
				.style("fill", "url(#gradient)");
			network.SVG.append("text")
				.attr("x", "50%")
				.attr("y", "90%")
				.attr("text-anchor", "middle")
				.text(network.parentVis.SVG.nodeColorAttr)
			return this;
		}
		return network;
	}
};

d3.selection.prototype.moveToFront = function() {
	return this.each(function() {
		this.parentNode.appendChild(this);
	});
};

d3.selection.prototype.selectAllToleranceFiltered = function() {
	return this.each(function() {
		return d3.select(this).classed("filtered");
	});
};

d3.selection.prototype.applyToleranceFilter = function() {
	return this.each(function() {
		return d3.select(this).classed("filtered", true).style("display", "none");
	});
};

d3.selection.prototype.removeToleranceFilter = function() {
	return this.each(function() {
		return d3.select(this).classed("filtered", false).style("display", "block");
	});
};

function makeSimpleRange(data, attr) {
	return d3.extent(data, function(d) {
		return d[attr];
	});
};


d3.layout.force.physicsOn = false;
d3.layout.force.start = (function() {
	var cached_forceStart = d3.layout.force.start;
	return function() {
		return cached_forceStart.apply(this, arguments);
	};
}());
d3.layout.force.stop = (function() {
	var cached_forceStart = d3.layout.force.stop;
	return function() {
		return cached_forceStart.apply(this, arguments);
	};
}());
