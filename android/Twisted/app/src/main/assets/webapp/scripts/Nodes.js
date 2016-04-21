var Nodes = {

    getDataNodes : function (dataTiles) {
        var me = this,
            nbNodesRow = Math.round(Math.sqrt((Twisted.nbNodes * dataTiles.nbCol) / dataTiles.nbRow)),
            nbNodesCol = Math.round(Twisted.nbNodes / nbNodesRow),
            deltaRow = Math.floor((dataTiles.nbRow - nbNodesCol) / 2),
            deltaCol = Math.floor((dataTiles.nbCol - nbNodesRow) / 2),
            nb = 0,
            data = [];
        
        for (var i = 0; i < nbNodesCol; i++) {
            for (var j = 0; j < nbNodesRow; j++) {
                if (nb < Twisted.nbNodes) {
                    nb++;
                    var tile = Tiles.getTileAt(dataTiles.data, i + deltaRow, j + deltaCol);
                    var node = {
                        id : "node_" + i + "_" + j,
                        width : 90 * (dataTiles.widthTile / 2) / 100,
                        x : tile.x,
                        y : tile.y,
                        startX : tile.x,
                        startY : tile.y,
                        tile : tile,
                        linksCount : 0,
                        previousTile : null
                    };
                    tile.node = node;
                    data.push(node);
                }
            }
        }

        return data;
    },
    
    shuffle : function(dataNodes, dataTiles) {
        for (var i = 0; i < dataNodes.length; i++) {            
            var node = dataNodes[i],
                randomTile = Tiles.getRandomEmptyTile(dataTiles);
            
            Nodes.moveNodeToTile(node, randomTile);
        }
    },
    
    moveNodeToTile : function(node, tile) {        
        // clean the current tile of the node :
        if (node.tile != null) {
            node.tile.node = null;
        }
        
        node.tile = tile;
        node.tile.node = node;        
        node.x = tile.x;
        node.y = tile.y;
    },

    renderNodes : function (svg, data) {
        var nodes = svg.selectAll("node").data(data.nodes, function (n) {
            return n.id;
        });
        
        nodes.exit()
            .transition()
                .attr("r", 0)
            .remove();

        nodes.enter()
            .append("circle")
                .attr("r", function (n) {
                    return n.width;
                })
                .attr("cx", function (n) {
                    return n.startX;
                })
                .attr("cy", function (n) {
                    return n.startY;
                })
                .attr("class", "node")
                .style("fill", NODE_FILL_COLOR)
                .style("stroke", NODE_STROKE_COLOR)
                .style("stroke-width", 1)
                .on("mouseover", function(n) {      
                    d3.select(this)
                        .transition('mouseover')        
                        .duration(DRAG_START_END_ANIMATION_DURATION_MS)
                            .style("fill", NODE_FILL_COLOR_DRAGGED)
                            .style("stroke", NODE_STROKE_COLOR_DRAGGED);
                    })                  
                .on("mouseout", function(n) {       
                    d3.select(this)
                        .transition('mouseout')        
                        .duration(DRAG_START_END_ANIMATION_DURATION_MS)
                            .style("fill", NODE_FILL_COLOR)
                            .style("stroke", NODE_STROKE_COLOR);
                })
                .call(Nodes.getDragBehaviour())
            .transition()
            .duration(APPEAR_ANIMATION_DURATION_MS)
                .attr("cx", function (n) {
                    return n.x;
                })
                .attr("cy", function (n) {
                    return n.y;
                });

        return nodes;
    },
    

    getDragBehaviour : function() {
        return d3.behavior.drag()
        
            .on("dragstart", function (n) {
                n.previousTile = n.tile;
            
                d3.select(this)
                    .transition('dragstartend')
                    .duration(DRAG_START_END_ANIMATION_DURATION_MS)
                        .style("fill", NODE_FILL_COLOR_DRAGGED)
                        .style("stroke", NODE_STROKE_COLOR_DRAGGED);

                Twisted.render.links.each(function (l) {
                    if (l.source === n || l.target === n) {
                        var strokeColor = STROKE_COLOR_DRAGGED;
                        if (l.intersect) {
                            strokeColor = STROKE_COLOR_DRAGGED_INTERSECT;
                        }
                        d3.select(this)
                            .transition('dragstartend')
                            .duration(DRAG_START_END_ANIMATION_DURATION_MS)
                                .style("stroke", strokeColor)
                                .style("stroke-width", STROKE_WIDTH_DRAGGED);
                    }
                });
            })
        
            .on("drag", function (n) {
                var nearestTile = Nodes.getNearestAvailableTile(n, d3.event.x, d3.event.y, Twisted.render.tiles);
                
                Nodes.moveNodeToTile(n, nearestTile);
              
                d3.select(this)
                    .transition('drag')
                    .ease('linear')
                    .duration(DRAG_ANIMATION_DURATION_MS)
                        .attr("cx", n.x)
                        .attr("cy", n.y);
                
                Twisted.render.links.each(function (l) {
                    if (l.source === n) {
                        l.drag = true;
                        d3.select(this)
                            .transition('drag')
                            .ease('linear')
                            .duration(DRAG_ANIMATION_DURATION_MS)
                                .attr("x1", n.x)
                                .attr("y1", n.y);
                    } else if (l.target === n) {
                        l.drag = true;
                        d3.select(this)
                            .transition('drag')
                            .ease('linear')
                            .duration(DRAG_ANIMATION_DURATION_MS)
                                .attr("x2", n.x)
                                .attr("y2", n.y);
                    }
                });
            
                Links.checkIntersections(Twisted.render.links);
            })
        
            .on("dragend", function (n) {
                var victory = Links.checkIntersections(Twisted.render.links);

               Twisted.playClick();
            
                d3.select(this)
                    .transition('dragstartend')
                    .duration(DRAG_START_END_ANIMATION_DURATION_MS)
                        .style("fill", NODE_FILL_COLOR)
                        .style("stroke", NODE_STROKE_COLOR);
                
                Twisted.render.links.each(function (l) {
                    l.drag = false;
                    if (l.source === n || l.target === n) {
                        var strokeColor = (l.intersect ? STROKE_COLOR_INTERSECT : STROKE_COLOR);
                        d3.select(this)
                            .transition('dragstartend')
                            .duration(DRAG_START_END_ANIMATION_DURATION_MS)
                                .style("stroke", strokeColor)
                                .style("stroke-width", STROKE_WIDTH);
                    }
                });
            
                if (n.previousTile != n.tile) {
                    Twisted.nbMove ++;
                    Twisted.updateScore();
                }
                n.previousTile = null;
            
                if (victory) {
                    Twisted.displayVictoryModal();
                }
            });
    },
    
    getNearestAvailableTile  : function (node, x, y, tiles) {
        var minDistance = 999999,
            nearestTile = null;
        
        tiles.each(function (tile) {
            // ignore tiles with a node, except if it's the node currently dragged :
            if (tile.node == null || tile.node == node) {
                var lx = tile.x - x,
                    ly = tile.y - y,
                    distance = Math.sqrt((lx * lx) + (ly * ly));

                if (minDistance > distance) {
                    minDistance = distance;
                    nearestTile = tile;
                }
            }
        });
        
        return nearestTile;
    }

};