function startD3() {
    var width = window.innerWidth,
        height = window.innerHeight;

    var svg = d3.select("#d3")
        .append("svg")
            .attr("width", width)
            .attr("height", height);
    
    var data = d3.range(20)
        .map(function(value) { 
            return {
                id : value,
                x : Math.random() * width, 
                y : Math.random() * height
            }; 
        });
    
    var nodes = svg.selectAll("node").data(data, function(d) {
        return d.id;
    });
    
    nodes.exit()
        .transition()
            .attr("r", 0)
        .remove();

    nodes.enter()
        .append("circle")
            .attr("r", 0)
            .attr("class", "node")
        .transition()
            .attr("r", 10);

    nodes
        .attr("cx", function(d) {
            return d.x; 
        })
        .attr("cy", function(d) { 
            return d.y; 
        });
    
    var links = svg.selectAll("link").data(data);
    
    links.exit()
        .remove();

    links.enter()
        .append("line")
            .attr("class", "link");

    links
        .attr("x1", function(l) { 
            var sourceNode = data.nodes.filter(function(d,i){ return i==l.source })[0];
            d3.select(this).attr("y1",sourceNode.y);
            return sourceNode.x
        })
        .attr("x2", function(l) { 
            var targetNode = data.nodes.filter(function(d,i){ return i==l.target })[0];
             d3.select(this).attr("y2",targetNode.y);
            return targetNode.x
        });
}