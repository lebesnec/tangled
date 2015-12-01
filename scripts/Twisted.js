var NB_TILES_PER_ROW = 25,
    NB_NODES = 100,
    LINKS_DENSITY = 1,
    // Style :
    SIZE_NODE = 20,
    SIZE_NODE_DRAGGED = 25,
    FILL_COLOR = '#575757',
    FILL_COLOR_DRAGGED = '#567dff',
    STROKE_COLOR = '#343434',    
    STROKE_COLOR_DRAGGED = '#3e6bff',
    STROKE_WIDTH = 2,
    STROKE_WIDTH_DRAGGED = 3,
    DRAG_ANMIATION_DURATION_MS = 500;

/**
 * http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
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
        
        Nodes.shuffle(dataNodes, dataTiles)

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