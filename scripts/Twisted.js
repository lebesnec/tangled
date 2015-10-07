var NB_TILES_PER_ROW = 25,
    NB_NODES = 100,
    NB_LINKS = 25;

/**
 * http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Twisted = {
    
    width : null,
    height : null,
    svg : null,
    data : null,
    render : null,

    start : function () {
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.svg = d3.select("#d3")
            .append("svg")
                .attr("width", this.width)
                .attr("height", this.height);

        this.initData();
        this.renderData();
    },

    initData : function () {
        var dataTiles = Tiles.getDataTiles(this.width, this.height),
            dataNodes = Nodes.getDataNodes(dataTiles),
            dataLinks = Links.getDataLinks(dataTiles, dataNodes);

        this.data = {
            tiles : dataTiles.data,
            nodes : dataNodes,
            links : dataLinks
        };
    },

    renderData : function (svg) {
        var d3Tiles = Tiles.renderTiles(this.svg, this.data),
            d3Links = Links.renderLinks(this.svg, this.data),
            d3Nodes = Nodes.renderNodes(this.svg, this.data, d3Tiles, d3Links);

        this.render = {
            tiles : d3Tiles,
            links : d3Links,
            nodes : d3Nodes
        };
    }

};