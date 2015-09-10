var Events = {
	"mainVis": {
		bindEvents: function(elem) {
			setTimeout(function() {
				var svg = elem.SVG;
				var visData = elem.AngularArgs.data;
				svg.selectAll("*").applyToleranceFilter();

				try {
					document.getElementById("togglePhysics").onclick = function() {
						svg.force.physicsToggle();
					};
					
					document.getElementById("innerButton").onclick = function() {
						svg.updateNodes(document.getElementById("txt").value);
						resetBarGraph();
					};
					document.getElementById("innerButton2").onclick = function() {
						svg.updateLinks(document.getElementById("txt2").value);
					};
					document.getElementById("innerButton3").onclick = function() {
						var arg = document.getElementById("txt3").value;
						if (arg !== "" || typeof arg !== "undefined") {
							var argSplit = arg.replaceAll(" ","").split(",");
							svg
								.selectAll(".n")
								.filter(function(d) {
									return argSplit.indexOf(d.label) >= 0;
								})
						};
					};
					document.getElementById("innerButton4").onclick = function() {
						applyFilter(parseInt($("#input-select")[0].value), parseInt($("#input-number")[0].value));
					};
				} catch (exception) {
					console.log("No debug bar. Remove this block if it no longer exists.");
				}

				function applyFilter(min, max) {
					svg.selectAll("*").removeToleranceFilter();
					svg.selectAll(".n").filter(function(d,i) { 
						var currNode = d3.select(this);
						if (d.weight < min || d.weight > max) {
							currNode.applyToleranceFilter();
							svg.selectAll(".s" + d.id).applyToleranceFilter();
							svg.selectAll(".t" + d.id).applyToleranceFilter();
						};
					});
					svg.force.tick();
					resetBarGraph();
				}

				function resetBarGraph() {
					try {
						visualizations.barVis
							.ResetVis(
								svg.selectAll(".n")
									.filter(function() {
										return !d3.select(this).classed("filtered")}).data());
					} catch (exception) {
						console.log("No component graph. Remove this block if it no longer exists.");
					}
				};

				function initFilter(range, mi, ma) {
					var min = range[0];
					var max = range[1];
					if (mi != null) min = mi;
					if (ma != null) max = ma;
					var select = document.getElementById('input-select');
					for ( var i = range[0]; i <= range[1]; i++ ){
						var option = document.createElement("option");
							option.text = i;
							option.value = i;
						select.appendChild(option);
					};
					var html5Slider = document.getElementById('html5');
					noUiSlider.create(html5Slider, {
						start: [min, max],
						connect: true,
						range: {
							'min': range[0],
							'max': range[1]
						}
					});
					var inputNumber = document.getElementById('input-number');
					html5Slider.noUiSlider.on('update', function( values, handle ) {
						var value = values[handle];
						if ( handle ) {
							inputNumber.value = value;
						} else {
							select.value = Math.round(value);
						};
					});
					select.addEventListener('change', function(){
						html5Slider.noUiSlider.set([this.value, null]);
					});
					inputNumber.addEventListener('change', function(){
						html5Slider.noUiSlider.set([null, this.value]);
					});
				};


				try {
					if (!elem.isFirstRun) {
						initFilter(d3.extent(visData.nodes.data, function(a) {
							return a.weight;
						}), 15, null);	
					}
					applyFilter(parseInt($("#input-select")[0].value), parseInt($("#input-number")[0].value));
				} catch (exception) {
					console.log("No debug bar. Remove this block if it no longer exists.");
				}
				


				svg.nodes.on("mouseover", function(d, i) {
					svg.select(".n" + d.id).classed("highlighted", true);
					try {
						var currBar = visualizations.barVis.SVG.selectAll(".b" + d.id);
						currBar.classed("highlighted", true);
					} catch (exception) {
						console.log("No component graph. Remove this block if it no longer exists.");
					}
				}).on("mouseout", function(d, i) {
					svg.select(".n" + d.id).classed("highlighted", false);
					try {
						var currBar = visualizations.barVis.SVG.selectAll(".b" + d.id);
						currBar.classed("highlighted", false);
					} catch (exception) {
						console.log("No component graph. Remove this block if it no longer exists.");
					}
				}).on("mouseup", function(d, i) {
					if(d3.event.shiftKey){
						d.fixed = true;
					} else {
						d.fixed = false;
					}
				})
			},1000);
		}
	},
	//TODO: Reclass the nodes, labels, and groups. That way we have access to each and don't need to worry about subselections. 
	"barVis": {
		bindEvents: function(elem) {
			$(document).ready(function() {
				setTimeout(function() {			
					var svg = elem.SVG;
					var visData = elem.data;
					var parentVis = visualizations.mainVis;
					var parentSVG = parentVis.SVG;
					var parentVisData = parentVis.AngularArgs.data;
					svg.bars.on("mouseover", function(d, i) {
						var currNode = parentSVG.selectAll(".n" + d.id);
						d3.select(this).classed("highlighted", true);
						currNode.classed("highlighted", true);
					}).on("mouseout", function(d, i) {
						var currNode = parentSVG.selectAll(".n" + d.id);
						d3.select(this).classed("highlighted", false);
						currNode.classed("highlighted", false);
					});
				},1000);
			})
		}
	},
	"mainVisSizeLegend": {
		bindEvents: function(elem) {
			$(document).ready(function() {
				setTimeout(function() {			

				},1000);
			})			
		}
	},
	"mainVisColorLegend": {
		bindEvents: function(elem) {
			$(document).ready(function() {
				setTimeout(function() {			

				},1000);
			})			
		}
	}
}