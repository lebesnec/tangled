function getDataNodes(width, height) {
    var data = d3.range(NB_NODES).map(function (value) {
        return {
            id : "node_" + value,
            x : Math.random() * width,
            y : Math.random() * height
        };
    });
    
    return data;
}

function renderNodes(svg, data, links) {
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
    
    return nodes;
}