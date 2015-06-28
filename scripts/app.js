/**
 * http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getData(width, height) {
    var dataNodes = d3.range(20).map(function (value) {
        return {
            id : "node_" + value,
            x : Math.random() * width,
            y : Math.random() * height
        };
    });
    
    var dataLinks = d3.range(20).map(function (value) {
        return {
            id : "links_" + value,
            target : dataNodes[getRandomInt(0, dataNodes.length - 1)],
            source : dataNodes[getRandomInt(0, dataNodes.length - 1)]
        };
    });
    
    return {
        nodes : dataNodes,
        links : dataLinks
    };
}

function startD3() {
    var width = window.innerWidth,
        height = window.innerHeight;

    var svg = d3.select("#d3")
        .append("svg")
            .attr("width", width)
            .attr("height", height);
    
    var data = getData(width, height);    
    
    // LINKS :    
    var links = svg.selectAll("link").data(data.links);
    
    links.exit()
        .remove();

    links.enter()
        .append("line")
            .attr("class", "link");

    links
        .attr("x1", function (l) {
            return l.source.x;
        })
        .attr("y1", function (l) {
            d3.select(this).attr("y1", l.source.y);
            return l.source.y;
        })
        .attr("x2", function (l) {
            return l.target.x;
        })
        .attr("y2", function (l) {
            return l.target.y;
        });
    
    // NODES :
    var drag = d3.behavior.drag()
        .on("drag", function (n) {
            n.x += d3.event.dx;
            n.y += d3.event.dy;
            d3.select(this)
                .attr("cx", n.x)
                .attr("cy", n.y);
            links.each(function (l) {
                if (l.source === n) {
                   d3.select(this)
                       .attr("x1", n.x)
                       .attr("y1", n.y);
                } else if (l.target === n) {
                   d3.select(this)
                       .attr("x2", n.x)
                       .attr("y2", n.y);
                }
            });
        });
    
    var nodes = svg.selectAll("node").data(data.nodes, function (n) {
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
            .call(drag)
        .transition()
            .attr("r", 10);

    nodes
        .attr("cx", function (n) {
            return n.x;
        })
        .attr("cy", function (n) {
            return n.y;
        });
}