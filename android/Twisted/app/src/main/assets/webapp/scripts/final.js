var Tiles={getDataTiles:function(a,b){for(var c=Math.ceil(Math.ceil((.5+Math.sqrt(.25+a/b*4*NB_TILES))/(2*a/b))*a/b),d=a/c,f=2*d/Math.sqrt(3),e=f/2,l=0,g=0,h=[],k=!1;!k;){var k=l*d+(1===g%2?d:d/2),m=b-(g*f*3/4+e),k={id:"tile_"+l+"_"+g,x:k,y:m,col:l,row:g,node:null,corners:[this.hexCorner(k,m,e,0),this.hexCorner(k,m,e,1),this.hexCorner(k,m,e,2),this.hexCorner(k,m,e,3),this.hexCorner(k,m,e,4),this.hexCorner(k,m,e,5)]};h.push(k);l++;l>=(0===g%2?c:c-1)&&(l=0,g+=1);k=g*f*3/4+f>=b}return{data:h,nbCol:c,
nbRow:g,widthTile:d}},hexCorner:function(a,b,c,d){d=Math.PI/180*(60*d+30);return{x:a+c*Math.cos(d),y:b+c*Math.sin(d)}},getTileAt:function(a,b,c){for(var d=null,f=0;f<a.length;f++){var e=a[f];if(e.row==b&&e.col==c){d=e;break}}return d},getRandomEmptyTile:function(a){var b=getRandomInt(0,a.nbRow-1),c=getRandomInt(0,a.nbCol-1-(0===b%2?0:1)),b=Tiles.getTileAt(a.data,b,c);return null==b.node?b:this.getRandomEmptyTile(a)},renderTiles:function(a,b){var c=a.selectAll("tile").data(b.tiles.data);c.exit().remove();
var d=c.enter().append("g").attr("class","tile");d.append("circle").attr("r",1).attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y});Tangled.a&&c.attr("y1",function(a){return a.corners[f].x});for(var f=0;6>f;f++)this.renderSide(f,d);return c},renderSide:function(a,b){b.append("line").attr("x1",function(b){return b.corners[a].x}).attr("y1",function(b){return b.corners[a].y}).attr("x2",function(b){return b.corners[(a+1)%6].x}).attr("y2",function(b){return b.corners[(a+1)%6].y}).attr("display",
function(b){if(2==a&&0!=b.col)return"none"})}},Nodes={currentDraggedNode:null,getDataNodes:function(a){for(var b=Math.round(Math.sqrt(Tangled.nbNodes*a.nbCol/a.nbRow)),c=Math.round(Tangled.nbNodes/b),d=Math.floor((a.nbRow-c)/2),f=Math.floor((a.nbCol-b)/2),e=0,l=[],g=0;g<c;g++)for(var h=0;h<b;h++)if(e<Tangled.nbNodes){e++;var k=Tiles.getTileAt(a.data,g+d,h+f),m={id:"node_"+g+"_"+h,width:a.widthTile/2*90/100,x:k.x,y:k.y,startX:k.x,startY:k.y,tile:k,linksCount:0,previousTile:null};k.node=m;l.push(m)}return l},
shuffle:function(a,b){for(var c=0;c<a.length;c++){var d=a[c],f=Tiles.getRandomEmptyTile(b);Nodes.moveNodeToTile(d,f)}},moveNodeToTile:function(a,b){null!=a.tile&&(a.tile.node=null);a.tile=b;a.tile.node=a;a.x=b.x;a.y=b.y},renderNodes:function(a,b){var c=a.selectAll("node").data(b.nodes,function(a){return a.id});c.exit().transition().attr("r",0).remove();c.enter().append("circle").attr("r",function(a){return a.width}).attr("cx",function(a){return a.startX}).attr("cy",function(a){return a.startY}).attr("class",
"node").style("fill",NODE_FILL_COLOR).style("stroke",NODE_STROKE_COLOR).style("stroke-width",1).on("mouseover",function(a){d3.select(this).transition("mouseover").duration(DRAG_START_END_ANIMATION_DURATION_MS).style("fill",NODE_FILL_COLOR_DRAGGED).style("stroke",NODE_STROKE_COLOR_DRAGGED)}).on("mouseout",function(a){d3.select(this).transition("mouseout").duration(DRAG_START_END_ANIMATION_DURATION_MS).style("fill",NODE_FILL_COLOR).style("stroke",NODE_STROKE_COLOR)}).call(Nodes.getDragBehaviour()).transition().duration(APPEAR_ANIMATION_DURATION_MS).attr("cx",
function(a){return a.x}).attr("cy",function(a){return a.y});return c},getDragBehaviour:function(){return d3.behavior.drag().on("dragstart",function(a){null==Nodes.currentDraggedNode&&(Nodes.currentDraggedNode=a,a.previousTile=a.tile,d3.select(this).transition("dragstartend").duration(DRAG_START_END_ANIMATION_DURATION_MS).style("fill",NODE_FILL_COLOR_DRAGGED).style("stroke",NODE_STROKE_COLOR_DRAGGED),Tangled.render.links.each(function(b){if(b.source===a||b.target===a){var c=STROKE_COLOR_DRAGGED;b.intersect&&
(c=STROKE_COLOR_DRAGGED_INTERSECT);d3.select(this).transition("dragstartend").duration(DRAG_START_END_ANIMATION_DURATION_MS).style("stroke",c).style("stroke-width",STROKE_WIDTH_DRAGGED)}}))}).on("drag",function(a){if(Nodes.currentDraggedNode==a){var b=Nodes.getNearestAvailableTile(a,d3.event.x,d3.event.y,Tangled.render.tiles);Nodes.moveNodeToTile(a,b);d3.select(this).transition("drag").ease("linear").duration(DRAG_ANIMATION_DURATION_MS).attr("cx",a.x).attr("cy",a.y);Tangled.render.links.each(function(b){b.source===
a?(b.drag=!0,d3.select(this).transition("drag").ease("linear").duration(DRAG_ANIMATION_DURATION_MS).attr("x1",a.x).attr("y1",a.y)):b.target===a&&(b.drag=!0,d3.select(this).transition("drag").ease("linear").duration(DRAG_ANIMATION_DURATION_MS).attr("x2",a.x).attr("y2",a.y))});Links.checkIntersections(Tangled.render.links)}}).on("dragend",function(a){if(Nodes.currentDraggedNode==a){var b=Links.checkIntersections(Tangled.render.links);Tangled.playClick();d3.select(this).transition("dragstartend").duration(DRAG_START_END_ANIMATION_DURATION_MS).style("fill",
NODE_FILL_COLOR).style("stroke",NODE_STROKE_COLOR);Tangled.render.links.each(function(b){b.drag=!1;if(b.source===a||b.target===a)b=b.intersect?STROKE_COLOR_INTERSECT:STROKE_COLOR,d3.select(this).transition("dragstartend").duration(DRAG_START_END_ANIMATION_DURATION_MS).style("stroke",b).style("stroke-width",STROKE_WIDTH)});a.previousTile!=a.tile&&(Tangled.nbMove++,Tangled.updateScore());a.previousTile=null;b&&Tangled.displayVictoryModal();Nodes.currentDraggedNode=null}})},getNearestAvailableTile:function(a,
b,c,d){var f=999999,e=null;d.each(function(d){if(null==d.node||d.node==a){var g=d.x-b,h=d.y-c,g=Math.sqrt(g*g+h*h);f>g&&(f=g,e=d)}});return e}},Links={getDataLinks:function(a,b){for(var c=[],d=[],f=0;f<b.length;f++){var e=b[f].tile,l=e.row%2,g=Tiles.getTileAt(a.data,e.row,e.col-1),h=Tiles.getTileAt(a.data,e.row-1,e.col-1+l),l=Tiles.getTileAt(a.data,e.row-1,e.col+l),g=this.createLink(e,g),h=this.createLink(e,h),e=this.createLink(e,l);null!=g&&c.push(g);null!=h&&c.push(h);null!=e&&c.push(e)}for(f=0;f<
c.length;f++){e=0==getRandomInt(0,Tangled.linksDensity);h=c[f];if(1==h.target.linksCount||1==h.source.linksCount)e=!1;e?(h.source.linksCount--,h.target.linksCount--):d.push(h)}return d},createLink:function(a,b){var c=null;null!=b&&null!=b.node&&(c={id:"links_"+a.row+"_"+a.col+"_"+b.row+"_"+b.col,target:b.node,source:a.node,intersect:!1,drag:!1},b.node.linksCount++,a.node.linksCount++);return c},checkIntersections:function(a){var b=!0;a.each(function(c){c.intersect=!1;a.each(function(a){c!=a&&Links.intersect(c.source,
c.target,a.source,a.target)&&(c.intersect=!0,b=!1)});c.intersect?c.drag?d3.select(this).style("stroke",STROKE_COLOR_DRAGGED_INTERSECT):d3.select(this).style("stroke",STROKE_COLOR_INTERSECT):c.drag?d3.select(this).style("stroke",STROKE_COLOR_DRAGGED):d3.select(this).style("stroke",STROKE_COLOR)});return b},intersect:function(a,b,c,d){if(a==c||a==d||b==c||b==d)return!1;var f=b.x-a.x;b=b.y-a.y;var e=d.x-c.x,l=d.y-c.y;d=(-b*(a.x-c.x)+f*(a.y-c.y))/(-e*b+f*l);a=(e*(a.y-c.y)-l*(a.x-c.x))/(-e*b+f*l);return 0<=
d&&1>=d&&0<=a&&1>=a},renderLinks:function(a,b){var c=a.selectAll("link").data(b.links);c.exit().remove();c.enter().append("line").style("stroke",STROKE_COLOR).style("stroke-width",STROKE_WIDTH).attr("x1",function(a){return a.source.startX}).attr("y1",function(a){return a.source.startY}).attr("x2",function(a){return a.target.startX}).attr("y2",function(a){return a.target.startY}).attr("pointer-events","none").transition().duration(APPEAR_ANIMATION_DURATION_MS).attr("x1",function(a){return a.source.x}).attr("y1",
function(a){return a.source.y}).attr("x2",function(a){return a.target.x}).attr("y2",function(a){return a.target.y});return c}},NB_TILES=120,FOOTER_HEIGHT=30,ANDROID="undefined"!=typeof Android,NODE_FILL_COLOR="#e8e8e8",NODE_FILL_COLOR_DRAGGED="#9a9a9a",NODE_STROKE_COLOR="#bfbfbf",NODE_STROKE_COLOR_DRAGGED="#777777",STROKE_COLOR="#343434",STROKE_COLOR_DRAGGED="#3e6bff",STROKE_COLOR_INTERSECT="#ff3e3e",STROKE_COLOR_DRAGGED_INTERSECT="#b100d1",STROKE_WIDTH=2,STROKE_WIDTH_DRAGGED=3,APPEAR_ANIMATION_DURATION_MS=
1500,DRAG_START_END_ANIMATION_DURATION_MS=300,DRAG_ANIMATION_DURATION_MS=100;function getRandomInt(a,b){return Math.floor(Math.random()*(b-a+1))+a}
var Tangled={width:null,height:null,svg:null,data:null,render:null,startDate:null,nbMove:0,nbNodes:10,linksDensity:10,difficulty:1,clickAudio:new Audio("audio/click.mp3"),successAudio:new Audio("audio/success.mp3"),start:function(){$('[data-toggle="tooltip"]').tooltip();this.width=window.innerWidth;this.height=window.innerHeight-57-FOOTER_HEIGHT;$("#startGameButton").on("click",function(){Tangled.playClick();$("#startModal").modal("hide");Tangled.startNewGame()});$("#quitGameButton").on("click",function(){Tangled.playClick();
$("#cancelButton").show();Tangled.startNewGame()});$("#closeTutorialButton").on("click",function(){Tangled.playClick();$("#tutorialModal").modal("hide")});$("#cancelButton").on("click",function(){Tangled.playClick();$("#cancelButton").hide();$("#difficultyModal").modal("hide")});$("#difficulty1Button").on("click",function(){Tangled.playClick();Tangled.initGame(1)});$("#difficulty2Button").on("click",function(){Tangled.playClick();Tangled.initGame(2)});$("#difficulty3Button").on("click",function(){Tangled.playClick();
Tangled.initGame(3)});$("#difficulty4Button").on("click",function(){Tangled.playClick();Tangled.initGame(4)});$("#startNewGameButton").on("click",function(){Tangled.playClick();$("#victoryModal").modal("hide");Tangled.startNewGame()});$("#highscoreButton").on("click",function(){Tangled.playClick();Tangled.displayHighscoreModal()});$("#closeHighscoreButton").on("click",function(){Tangled.playClick();$("#highscoreModal").modal("hide");Tangled.startNewGame()});$("#cancelButton").hide();this.drawStartBackground();
$("#startModal").modal({backdrop:"static",keyboard:!1});setInterval($.proxy(Tangled.updateScore,Tangled),1E3)},startNewGame:function(){this.data=null;$("#difficultyModal").modal({backdrop:"static",keyboard:!1})},drawStartBackground:function(){var a=Tiles.getDataTiles(this.width,this.height);this.nbNodes=(a.nbCol-4)*(a.nbRow-2);this.linksDensity=1;var b=Nodes.getDataNodes(a),c=Links.getDataLinks(a,b);this.a=!("127.0.0.1"==document.domain||"tangled.eu"==document.domain||"www.tangled.eu"==document.domain||
ANDROID);this.data={tiles:a,nodes:b,links:c};this.renderData()},initGame:function(a){$("#cancelButton").hide();$("#difficultyModal").modal("hide");"false"!=localStorage.getItem("tutorial")&&($("#tutorialModal").modal({backdrop:"static",keyboard:!1}),localStorage.setItem("tutorial","false"));this.difficulty=a;1==a?(this.nbNodes=25,this.linksDensity=10):2==a?(this.nbNodes=40,this.linksDensity=2):3==a?(this.nbNodes=70,this.linksDensity=2):(this.nbNodes=100,this.linksDensity=5);this.initData();this.renderData();
Links.checkIntersections(this.render.links)},initData:function(){var a=Tiles.getDataTiles(this.width,this.height),b=Nodes.getDataNodes(a),c=Links.getDataLinks(a,b);Nodes.shuffle(b,a);this.data={tiles:a,nodes:b,links:c};this.startDate=new Date;this.nbMove=0},renderData:function(a){this.resetSVG();a=Tiles.renderTiles(this.svg,this.data);var b=Nodes.renderNodes(this.svg,this.data),c=Links.renderLinks(this.svg,this.data);this.render={tiles:a,links:c,nodes:b}},resetSVG:function(){d3.select("svg").remove();
this.svg=d3.select("#d3").append("svg").attr("width",this.width).attr("height",this.height)},updateScore:function(){if(null!=this.startDate){var a=Math.floor(((new Date).getTime()-this.startDate.getTime())/1E3),b=Math.floor(a/60),a=a-60*b,b=(0>=b?"":b+(1==b?" minute ":" minutes "))+(a+(1>=a?" second":" seconds")),a=this.nbMove+" move"+(1<this.nbMove?"s":"");$("#scoreMove").text(a);$("#scoreTime").text(b)}},displayVictoryModal:function(){this.successAudio.play();var a=localStorage.getItem("highscore.moves."+
this.difficulty);null==a&&(a="999999");a=parseInt(a);$("#highscoreMovesNew").hide();a>this.nbMove&&(a=this.nbMove,$("#highscoreMovesNew").show());localStorage.setItem("highscore.moves."+this.difficulty,a);$("#highscoreMovesText").html(a+" move"+(1<a?"s":""));var a=localStorage.getItem("highscore.time."+this.difficulty),b=Math.floor(((new Date).getTime()-this.startDate.getTime())/1E3);null==a&&(a="999999");a=parseInt(a);$("#highscoreTimeNew").hide();a>b&&(a=b,$("#highscoreTimeNew").show());localStorage.setItem("highscore.time."+
this.difficulty,a);b=Math.floor(a/60);a-=60*b;a=(0>=b?"":b+(1==b?" minute ":" minutes "))+(a+(1>=a?" second":" seconds"));$("#highscoreTimeText").html(a);$("#victoryModal .glyphicon-star").hide();for(a=1;a<=this.difficulty;a++)$("#victory"+a+"Icon").show();$("#victoryText").html("in <b>"+$("#scoreMove").text()+"</b><br/> and <b>"+$("#scoreTime").text()+"</b>");$("#victoryModal").modal({backdrop:"static",keyboard:!1});this.startDate=null},displayHighscoreModal:function(){$("#difficultyModal").modal("hide");
$("#highscoreModal").modal({backdrop:"static",keyboard:!1});for(var a=1;4>=a;a++){var b=localStorage.getItem("highscore.moves."+a);null!=b&&$("#highscoreMovesText"+a).html(b+" move"+(1<b?"s":""));var c=localStorage.getItem("highscore.time."+a);null!=c&&(c=parseInt(c),b=Math.floor(c/60),c-=60*b,b=(0>=b?"":b+(1==b?" minute ":" minutes "))+(c+(1>=c?" second":" seconds")),$("#highscoreTimeText"+a).html(b))}},playClick:function(){this.clickAudio.play()}};