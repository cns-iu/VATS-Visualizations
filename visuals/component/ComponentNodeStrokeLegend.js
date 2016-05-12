visualizationFunctions.ComponentNodeStrokeLegend = function(element, data, opts) {
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
    network.VisFunc = function() {
        network.SVG.area = network.SVG.append("g")
            .attr("transform", "translate(10,20)")
            .selectAll(".rect")
            .data([{"label": "NIH", "class": "nih"}, {"label": "CTSA", "class": "ctsa"}, {"label": "Other", "class": "b"}])
            .enter()
        network.SVG.rectG = network.SVG.area.append("g")
			.attr("transform", function(d, i) {
            	return "translate(0," + (22.5 * i) + ")"
            })
        network.SVG.rectG.append("rect")
        	.attr("class", function(d, i) {
        		return d.class
        	})
            .attr("x", 0)
            .attr("width", 25)
            .attr("height", 12.5)
        network.SVG.rectG.append("text")
        	.attr("x", 37.5)
        	.attr("y", 12.5)
        	.text(function(d, i) {
        		return "   " + d.label
        	})
        $("#cnstl").html("User type");

    }
    return network;
}
