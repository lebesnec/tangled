function startD3() {

    var width = window.innerWidth,
        height = window.innerHeight;

    var svg = d3.select("#d3")
        .append("svg")
            .attr("width", width)
            .attr("height", height);
    
    var data = d3.range(200)
        .map(function() { return {x : Math.random() * width, y : Math.random() * height}; });
    
    var circles = svg.selectAll("circle").data(data)
    
    circles.exit()
        .transition()
            .attr("r", 0)
        .remove();

    circles.enter()
        .append("circle")
            .attr("r", 0)
        .transition()
            .attr("r", 10);

    circles
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}