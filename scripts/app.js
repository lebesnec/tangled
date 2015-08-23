var NB_TILES = 100,
    NB_NODES = 20,
    NB_LINKS = 20;

function start() {
    var width = window.innerWidth,
        height = window.innerHeight;

    var svg = d3.select("#d3")
        .append("svg")
            .attr("width", width)
            .attr("height", height);
    
    var data = getData(width, height),
        render = renderData(svg, data);
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