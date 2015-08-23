var NB_TILES = 100,
    NB_NODES = 20,
    NB_LINKS = 20;

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
            dataNodes = Nodes.getDataNodes(this.width, this.height),
            dataLinks = Links.getDataLinks(dataNodes);

        this.data = {
            tiles : dataTiles,
            nodes : dataNodes,
            links : dataLinks
        };
    },

    renderData : function (svg) {
        var d3Tiles = Tiles.renderTiles(this.svg, this.data),
            d3Links = Links.renderLinks(this.svg, this.data),
            d3Nodes = Nodes.renderNodes(this.svg, this.data, d3Links);

        this.render = {
            tiles : d3Tiles,
            links : d3Links,
            nodes : d3Nodes
        };
    }

};