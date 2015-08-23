/**
 * http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * http://www.redblobgames.com/grids/hexagons/#basics
 * In a regular hexagon the interior angles are 120°. 
 * There are six “wedges”, each an equilateral triangle with 60° angles inside. 
 * Corner i is at (60° * i), size units away from the center.
 */
function hexCorner(centerX, centerY, size, i) {
    var angleRad = (Math.PI / 180) * ((60 * i) + 30);
    
    return {
        x : centerX + (size * Math.cos(angleRad)),
        y : centerY + (size * Math.sin(angleRad))
    };
}

var NB_TILES = 100,
    NB_NODES = 20,
    NB_LINKS = 20;

function startD3() {
    var width = window.innerWidth,
        height = window.innerHeight;

    var svg = d3.select("#d3")
        .append("svg")
            .attr("width", width)
            .attr("height", height);
    
    var data = getData(width, height);
    var render = renderData(svg, data);   
}

function getData(width, height) {
    var dataTiles = getDataTiles(width, height),
        dataNodes = getDataNodes(width, height),
        dataLinks = getDataLinks(dataNodes);
    
    return {
        tiles : dataTiles,
        nodes : dataNodes,
        links : dataLinks
    };
}

function getDataTiles(width, height) {
    var widthTile = Math.sqrt((width * height) / NB_TILES),
        heightTile = (widthTile * 2) / Math.sqrt(3),
        sizeTile = heightTile / 2,
        row = 0,
        col = 0;

    //TODO bien callé la grid dans la page
    var data = d3.range(NB_TILES).map(function (value) {
        row = row + 1;
        if (row * widthTile >= width) {
            row = 0;
            col = col + 1;
        }
        var x = (row * widthTile) + (col % 2 === 1 ? (widthTile / 2) : 0),
            y = col * heightTile * 3 / 4;
        
        return {
            id : "tile_" + value,
            x : x,
            y : y,
            col : col,
            row : row,
            corners : [
                hexCorner(x, y, sizeTile, 0),
                hexCorner(x, y, sizeTile, 1),
                hexCorner(x, y, sizeTile, 2),
                hexCorner(x, y, sizeTile, 3),
                hexCorner(x, y, sizeTile, 4),
                hexCorner(x, y, sizeTile, 5)
            ]
        };
    });
    
    return data;
}

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

function renderData(svg, data) {
    var d3Tiles = renderTiles(svg, data);
    var d3Links = renderLinks(svg, data);
    var d3Nodes = renderNodes(svg, data, d3Links);
    
    return {
        tiles : d3Tiles,
        links : d3Links,
        nodes : d3Nodes
    };
}

function renderTiles(svg, data) {
    var tiles = svg.selectAll("tile").data(data.tiles);
    
    tiles.exit()
        .remove();

    var tileGroup = tiles.enter()
        .append("g")
            .attr("class", "tile");
    
    // center :
    tileGroup.append("circle")
        .attr("r", 2)
        .attr("cx", function (t) {
            return t.x;
        })
        .attr("cy", function (t) {
            return t.y;
        });
    
    // outline :
    //TODO un seul tracé ?
    for (i = 0; i < 6; i ++) {
        tileGroup.append("line")
            .attr("x1", function (t) {
                return t.corners[i].x;
            })
            .attr("y1", function (t) {
                return t.corners[i].y;
            })
            .attr("x2", function (t) {
                return t.corners[(i + 1) % 6].x;
            })
            .attr("y2", function (t) {
                return t.corners[(i + 1) % 6].y;
            });
    }
    
    return tiles;
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