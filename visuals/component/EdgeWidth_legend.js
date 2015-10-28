visualizationFunctions.componentEdgeWidthLegend = function(element, data, opts) {
	var network = visualizations[opts.ngIdentifier];
	network.config = network.CreateBaseConfig();
	network.parentVis = visualizations[opts.ngComponentFor];

	network.SVG = d3.select(element[0])
		.append("svg")
		.attr("width", network.config.dims.width + network.config.margins.left - network.config.margins.right)
		.attr("height", network.config.dims.height + network.config.margins.top - network.config.margins.bottom)
		.style("background", "none")
		.append("g")
		.attr("class", "canvas " + opts.ngIdentifier);
	network.parentVis = visualizations[opts.ngComponentFor];

	network.VisFunc = function() {
		var legendData = network.parentVis.Scales.edgeStrokeScale;
		var w = network.config.dims.width * .75;
		network.SVG.append("line")
			.attr("class", "e")
			.attr("x1", "10%")
			.attr("y1", "10%")
			.attr("x2", "70%")
			.attr("y2", "10%")
			.style("stroke-width", legendData.range()[0])
			.style("stroke", "black")
		network.SVG.append("line")
			.attr("class", "e")
			.attr("x1", "10%")
			.attr("y1", "30%")
			.attr("x2", "70%")
			.attr("y2", "30%")
			.style("stroke-width", legendData.range()[1])
			.style("stroke", "black")
		network.SVG.append("line")
			.attr("class", "e")
			.attr("x1", "10%")
			.attr("y1", "50%")
			.attr("x2", "70%")
			.attr("y2", "50%")
			.style("stroke-width", legendData.range()[2])
			.style("stroke", "black")
		network.SVG.append("text")
			.attr("class", "l2")
			.attr("x", "80%")
			.attr("y", "15%")
			.attr("text-anchor", "middle")
			.text(legendData.domain()[0])
		network.SVG.append("text")
			.attr("class", "l2")
			.attr("x", "80%")
			.attr("y", "35%")
			.attr("text-anchor", "middle")
			.text(legendData.domain()[1])
		network.SVG.append("text")
			.attr("class", "l2")
			.attr("x", "80%")
			.attr("y", "55%")
			.attr("text-anchor", "middle")
			.text(legendData.domain()[2])
		network.SVG.append("text")
			.attr("class", "l2")
			.attr("x", "50%")
			.attr("y", "90%")
			.attr("text-anchor", "middle")
			.text(network.parentVis.config.meta.edges.styleEncoding.strokeWidth.attr)
	}
	return network;
}