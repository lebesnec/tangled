function getDataLinks(dataNodes) {
    var data = d3.range(NB_LINKS).map(function (value) {
        return {
            id : "links_" + value,
            target : dataNodes[getRandomInt(0, dataNodes.length - 1)],
            source : dataNodes[getRandomInt(0, dataNodes.length - 1)]
        };
    });
    
    return data;
}

function renderLinks(svg, data) {
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
            d3.select(this).attr("y1", l.source.y);//TODO ?
            return l.source.y;
        })
        .attr("x2", function (l) {
            return l.target.x;
        })
        .attr("y2", function (l) {
            return l.target.y;
        });
    
    return links;
}