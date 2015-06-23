function startD3() {
    var width = window.innerWidth,
        height = window.innerHeight;

    var svg = d3.select("#d3")
        .append("svg")
            .attr("width", width)
            .attr("height", height);
    
    // NODES :
    var dataNodes = d3.range(20).map(function(value) { 
        return {
            id : "node_" + value,
            x : Math.random() * width, 
            y : Math.random() * height
        }; 
    });
    
    var nodes = svg.selectAll("node").data(dataNodes, function(n) {
        return n.id;
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
        .attr("cx", function(n) {
            return n.x; 
        })
        .attr("cy", function(n) { 
            return n.y; 
        });
    
    // LINKS :
    var dataLinks = d3.range(20).map(function(value) { 
        return {
            id : "links_" + value,
            target : "node_" + value, //TODO
            source : "node_" + (value == 19 ? 0 : value + 1)
        }; 
    });
    
    var links = svg.selectAll("link").data(dataLinks);
    
    links.exit()
        .remove();

    links.enter()
        .append("line")
            .attr("class", "link");

    links
        .attr("x1", function(l) { 
            var sourceNode = dataNodes.filter(function(n) {
                return n.id == l.source;
            })[0];

            d3.select(this).attr("y1", sourceNode.y);
            return sourceNode.x
        })
        .attr("x2", function(l) { 
            var targetNode = dataNodes.filter(function(n) {
                return n.id == l.target;
            })[0];
        
            d3.select(this).attr("y2", targetNode.y);
            return targetNode.x
        });
}