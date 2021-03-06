visualizationFunctions.ComponentNodeSizeLegend = function(element, data, opts) {
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
        var legendData = [];

        network.Scales.legendScale = Utilities.makeDynamicScale(
            [0, 2],
            "",
            "linear",
            network.parentVis.Scales.nodeSizeScale.range()
        );
        network.Scales.legendTextScale = Utilities.makeDynamicScale(
            [0, 2],
            "",
            "linear",
            network.parentVis.Scales.nodeSizeScale.domain()
        );

        for (var i = 0; i < 3; i++) {
            legendData.push(network.Scales.legendScale(i));
        }
        var legendGroupG = network.SVG.append("g");

        var legendGroup = legendGroupG.selectAll(".legendItem")
            .data(legendData)
            .enter()
            .append("g")
            .attr("class", "legendItem legend");

        // function setCX(d, i) {
        //     var base = network.Scales.legendScale.range()[network.Scales.legendScale.range().length - 1];
        //     if (i > 0) {
        //         base += d * i + legendData[0] * i + 10 * i;
        //     }
        //     return base;
        // }

        // function setCY(d, i) {
        //     var base = network.Scales.legendScale.range()[network.Scales.legendScale.range().length - 1] * 2 - 20;
        //     if (i < legendData.length - 1) {
        //         base += (legendData[legendData.length - 1] - d);
        //     }
        //     return base;
        // }
        legendGroup.append("circle")
            .attr("class", "wvf-node")
            .attr("r", function(d, i) {
                return d;
            })
            .attr("cx", function(d, i) {
                // return setCX(d, i);
                return network.config.dims.fixedWidth / 3 * i + (network.config.dims.fixedWidth / 12)
            })
            .attr("cy", function(d, i) {
                // return setCY(d, i);
                return network.config.dims.fixedHeight / 4
            })
            .style("fill", "none")

        legendGroup.append("text")
            .attr("class", "l2")
            .attr("dx", function(d, i) {
                // return setCX(d, i);
                return network.config.dims.fixedWidth / 3 * i + (network.config.dims.fixedWidth / 12)

            })
            .attr("dy", function(d, i) {
                // return setCY(d, i) + d + 26;
                return network.config.dims.fixedHeight / 4 * 2
            })
            .attr("text-anchor", "middle")
            .text(function(d, i) {
                if (network.parentVis.config.meta.nodes.styleEncoding.size.scale == "log") {
                    if (i == 1) {
                        return Math.floor(Math.log(Utilities.format(network.Scales.legendTextScale(i))));
                    }
                }
                return Math.floor(Utilities.format(network.Scales.legendTextScale(i)));
            })

            $("#cnsl").html(network.parentVis.config.meta[network.parentVis.PrimaryDataAttr].prettyMap[network.parentVis.config.meta.nodes.styleEncoding.size.attr] || network.parentVis.config.meta.nodes.styleEncoding.size.attr);
        legendGroupG.attr("transform", "translate(" + ((network.config.dims.width - legendGroupG.node().getBBox().width) / 2) + ",0)")
    }
    return network;
}

// visualizationFunctions.ComponentNodeSizeLegend = function(element, data, opts) {
//  var network = visualizations[opts.ngIdentifier];
//  network.config = network.CreateBaseConfig();
//  network.parentVis = visualizations[opts.ngComponentFor];
//  network.SVG = d3.select(element[0])
//      .append("svg")
//      .attr("width", network.config.dims.width + network.config.margins.left - network.config.margins.right)
//      .attr("height", network.config.dims.height + network.config.margins.top - network.config.margins.bottom)
//      .style("background", "none")
//      .append("g")
//      .attr("class", "canvas " + opts.ngIdentifier);
//  network.VisFunc = function() {
//      var legendData = [];
//      var circleCount = 3;
//      network.Scales.legendScale = Utilities.makeDynamicScale(
//          [0, circleCount - 1],
//          "",
//          "linear",
//          network.parentVis.Scales.nodeSizeScale.range()
//      );
//      network.Scales.legendTextScale = Utilities.makeDynamicScale(
//          [0, circleCount - 1],
//          "",
//          "linear",
//          network.parentVis.Scales.nodeSizeScale.domain()
//      );

//      for (var i = 0; i < circleCount; i++) {
//          legendData.push(network.Scales.legendScale(i));
//      }

//      legendGroup = network.SVG.append("g").selectAll(".legendItem")
//          .data(legendData)
//          .enter()
//          .append("g")
//          .attr("class", "legendItem legend");

//      function setCY(d, i) {
//          var base = network.Scales.legendScale.range()[network.Scales.legendScale.range().length - 1] * 2 - 20;
//          if (i < legendData.length - 1) {
//              base += (legendData[legendData.length - 1] - d);
//          }
//          return base;
//      }
//      legendGroup.append("circle")
//          .attr("class", "n")
//          .attr("r", function(d, i) {
//              return d;
//          })
//          .attr("cx", function(d, i) {
//              return ((network.config.dims.fixedWidth - 20) / circleCount) * i + 20
//          })
//          .attr("cy", function(d, i) {
//              return setCY(d, i);
//          })
//          .style("fill", "none")

//      legendGroup.append("text")
//          .attr("class", "l2")
//          .attr("dx", function(d, i) {
//              return ((network.config.dims.fixedWidth - 20) / circleCount) * i + 20
//          })
//          .attr("dy", function(d, i) {
//              return setCY(d, i) + d + 13;
//          })
//          .attr("text-anchor", "middle")
//          .text(function(d, i) {
//              return Utilities.round(network.Scales.legendTextScale(i), 0);
//          })
//      network.SVG.append("text")
//          .attr("class", "l2")
//          .attr("x", "50%")
//          .attr("y", "90%")
//          .attr("text-anchor", "middle")
//          .text(network.parentVis.config.meta[network.parentVis.PrimaryDataAttr].prettyMap[network.parentVis.config.meta.nodes.styleEncoding.size.attr] || network.parentVis.config.meta.nodes.styleEncoding.size.attr);
//  }
//  return network;
// }
// var huh;