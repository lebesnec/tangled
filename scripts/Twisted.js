var NB_TILES = 300,
    FOOTER_HEIGHT = 30,
    // Styles nodes :
    NODE_FILL_COLOR = '#e8e8e8',
    NODE_FILL_COLOR_DRAGGED = '#d9d9d9',
    NODE_STROKE_COLOR = '#bfbfbf',    
    NODE_STROKE_COLOR_DRAGGED = '#b4b4b4',
    // Styles lines :
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
    clickAudio : new Audio('audio/click.mp3'),
    successAudio : new Audio('audio/success.mp3'),
    
    start : function() {
        this.width = window.innerWidth;
        this.height = window.innerHeight - 57 - FOOTER_HEIGHT; // 57 = toolbar
        
        $('#startGameButton').on('click', function () {
            Twisted.playClick();
            $('#startModal').modal('hide');
            Twisted.startNewGame();
        });
        
        $('#quitGameButton').on('click', function () {
            Twisted.playClick();
            $('#cancelButton').show();
            Twisted.startNewGame();
        });
        
        $('#cancelButton').on('click', function () {
            Twisted.playClick();
            $('#cancelButton').hide();
            $('#difficultyModal').modal('hide');
        });
        
        $('#difficulty1Button').on('click', function () {
            Twisted.playClick();
            Twisted.initGame(1);
        });
        $('#difficulty2Button').on('click', function () {
            Twisted.playClick();
            Twisted.initGame(2);
        });
        $('#difficulty3Button').on('click', function () {
            Twisted.playClick();
            Twisted.initGame(3);
        });
        $('#difficulty4Button').on('click', function () {
            Twisted.playClick();
            Twisted.initGame(4);
        });
        
        $('#startNewGameButton').on('click', function () {
            Twisted.playClick();
            $('#victoryModal').modal('hide');
            Twisted.startNewGame();
        });
        
        
        $('#cancelButton').hide();
        
        this.drawStartBackground();
        
        $('#startModal').modal({
            backdrop : 'static',
            keyboard : false
        });
        
        setInterval($.proxy(Twisted.updateScore, Twisted), 1000);
    },

    startNewGame : function () {
        this.data = null;
        
        $('#difficultyModal').modal({
            backdrop : 'static',
            keyboard : false
        });
    },
    
    drawStartBackground : function() {        
        var dataTiles = Tiles.getDataTiles(this.width, this.height);
       
        this.nbNodes = ((dataTiles.nbCol - 4) * (dataTiles.nbRow - 2));
        this.linksDensity = 1;
        
        var dataNodes = Nodes.getDataNodes(dataTiles),
            dataLinks = Links.getDataLinks(dataTiles, dataNodes);
        
        this.data = {
            tiles : dataTiles,
            nodes : dataNodes,
            links : dataLinks
        };
        this.renderData();
    },
    
    initGame : function(difficulty) {
        $('#cancelButton').hide();
        $('#difficultyModal').modal('hide');
        
        this.difficulty = difficulty;
        
        if (difficulty == 1) {
            this.nbNodes = 5;//TODO 10;
            this.linksDensity = 15;
        } else if (difficulty == 2) {
            this.nbNodes = 25;
            this.linksDensity = 1;
        } else if (difficulty == 3) {
            this.nbNodes = 40;
            this.linksDensity = 1;
        } else {
            this.nbNodes = 70;
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
        this.resetSVG();
        
        var d3Tiles = Tiles.renderTiles(this.svg, this.data),
            d3Nodes = Nodes.renderNodes(this.svg, this.data),
            d3Links = Links.renderLinks(this.svg, this.data);

        this.render = {
            tiles : d3Tiles,
            links : d3Links,
            nodes : d3Nodes
        };
    },
    
    resetSVG : function() {
        d3.select("svg").remove();
        
        this.svg = d3.select("#d3")
            .append("svg")
                .attr("width", this.width)
                .attr("height", this.height);
    },
    
    updateScore : function() {
        if (this.startDate != null) {
            var now = new Date(),
                deltaSeconds = Math.floor((now.getTime() - this.startDate.getTime()) / 1000),
                minutes = Math.floor(deltaSeconds / 60),
                seconds = (deltaSeconds - (minutes * 60)),
                timeText = (minutes <= 0 ? '' : (minutes + (minutes == 1 ? ' minute and ' : ' minutes and '))) + (seconds + (seconds <= 1 ? ' second' :  ' seconds')),
                movetext = (this.nbMove + ' move' + (this.nbMove > 1 ? 's' : ''));

            $("#scoreMove").text(movetext);
            $("#scoreTime").text(timeText);
        }
    },
    
    displayVictoryModal : function() {   
        this.successAudio.play();
        
        $('#victoryModal .glyphicon-star').hide();
        for (var i = 1; i <= this.difficulty; i++) {
            $('#victory' + i + 'Icon').show();
        }
        
        $('#victoryText').html('in <b>' + $("#scoreMove").text() + '</b><br/> and <b>' + $("#scoreTime").text() + "</b>");
        
        $('#victoryModal').modal({
            backdrop : 'static',
            keyboard : false
        });
        
        this.startDate = null;
    },
    
    playClick : function() {
        this.clickAudio.play();
    }

};