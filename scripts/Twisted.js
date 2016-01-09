var NB_TILES_PER_ROW = 25,
    // Style :
    SIZE_NODE = 20,
    SIZE_NODE_DRAGGED = 25,
    FILL_COLOR = '#575757',
    FILL_COLOR_DRAGGED = '#567dff',
    STROKE_COLOR = '#343434',    
    STROKE_COLOR_DRAGGED = '#3e6bff',
    STROKE_COLOR_INTERSECT = '#ff3e3e',
    STROKE_COLOR_DRAGGED_INTERSECT = '#b100d1',
    STROKE_WIDTH = 2,
    STROKE_WIDTH_DRAGGED = 3,
    // Animation duration :
    APPEAR_ANIMATION_DURATION_MS = 1500,
    DRAG_START_END_ANIMATION_DURATION_MS = 300,
    DRAG_ANIMATION_DURATION_MS = 100;

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
    startDate : null,
    nbMove : 0,
    nbNodes : 10,
    linksDensity : 10,
    difficulty : 1,
    
    start : function() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        $('#start1Button').on('click', function () {
            Twisted.initGame(1);
        });
        $('#start2Button').on('click', function () {
            Twisted.initGame(2);
        });
        $('#start3Button').on('click', function () {
            Twisted.initGame(3);
        });
        $('#start4Button').on('click', function () {
            Twisted.initGame(4);
        });
        
        $('#startNewGameButton').on('click', function () {
            $('#victoryModal').modal('hide');
            Twisted.startNewGame();
        });
        
        this.startNewGame();
    },

    startNewGame : function () {
        this.data = null;
        
        d3.select("svg").remove();
        
        this.svg = d3.select("#d3")
            .append("svg")
                .attr("width", this.width)
                .attr("height", this.height);        
        
        this.displayStartModal();
    },
    
    initGame : function(difficulty) {
        $('#startModal').modal('hide');
        
        this.difficulty = difficulty;
        
        if (difficulty == 1) {
            this.nbNodes = 5;//10;
            this.linksDensity = 15;
        } else if (difficulty == 2) {
            this.nbNodes = 5;//25;
            this.linksDensity = 1;
        } else if (difficulty == 3) {
            this.nbNodes = 5;//40;
            this.linksDensity = 1;
        } else {
            this.nbNodes = 5;//70;
            this.linksDensity = 1;
        }
        
        this.initData();
        this.renderData();
        Links.checkIntersections(this.render.links);
    },

    initData : function () {
        var dataTiles = Tiles.getDataTiles(this.width, this.height),
            dataNodes = Nodes.getDataNodes(dataTiles),
            dataLinks = Links.getDataLinks(dataTiles, dataNodes);

        Nodes.shuffle(dataNodes, dataTiles);
        
        this.data = {
            tiles : dataTiles,
            nodes : dataNodes,
            links : dataLinks
        };
        
        this.startDate = new Date();
        this.nbMove = 0;
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
    },
    
    displayStartModal : function() {
         $('#startModal').modal({
            backdrop : 'static',
            keyboard : false
        });
    },
    
    displayVictoryModal : function() {
        var now = new Date(),
            minutes = Math.round((((now.getTime() - this.startDate.getTime()) % 86400000) % 3600000) / 60000),
            timeText = (minutes <= 1 ? 'less than a minute' : (minutes + ' minutes')),
            movetext = (this.nbMove + ' move' + (this.nbMove > 1 ? 's' : ''));
        
        $('#victoryModal .glyphicon-star').hide();
        for (var i = 1; i <= this.difficulty; i++) {
            $('#victory' + i + 'Icon').show();
        }
        
        $('#victoryText').html('in ' + timeText + '<br/> and ' + movetext);
        
        $('#victoryModal').modal({
            backdrop : 'static',
            keyboard : false
        });
    }

};