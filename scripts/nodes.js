var Nodes = {

    getDataNodes : function (dataTiles) {
        var me = this;
        
        var data = d3.range(NB_NODES).map(function (value) {
            var randomTile = me.getRandomTile(dataTiles);
            return {
                id : "node_" + value,
                x : randomTile.x,
                y : randomTile.y,
                tile : randomTile
            };
        });

        return data;
    },
    
    getRandomTile : function(dataTiles) {
        var randomTile = dataTiles[getRandomInt(0, dataTiles.length - 1)];
        
        if (randomTile.node != null) {
            return this.getRandomTile(dataTiles);
        } else {
            randomTile.node = this;
            return randomTile;
        }
    },

    renderNodes : function (svg, data, tiles, links) {
        var drag = d3.behavior.drag()
            .on("drag", function (n) {
                var nearestTile = Nodes.getNearestAvailableTile(n, d3.event.x, d3.event.y, tiles);
                n.x = nearestTile.x;
                n.y = nearestTile.y;                
              
                d3.select(this)
                    .attr("cx", n.x)
                    .attr("cy", n.y)
                    .attr("r", 20)
                    .attr("class", "draggedNode");
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
            })
            .on("dragend", function (n) {
                d3.select(this)
                    .attr("r", 10)
                    .attr("class", "node");
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
    },
    
    getNearestAvailableTile  : function(node, x, y, tiles) {
        var minDistance = 999999,
            nearestTile = null;
        
        tiles.each(function(tile) {
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
        
        // not working after a drop :(
        /*nearestTile.node = node;
        if (node.tile != null) {
            if (node.tile.node != node) {
                node.tile.node = null;
            }            
        }*/
        
        // clean the previous tile of the node being dragged :
        if (node.tile != null) {
            node.tile.node = null;
        }
        // set the tile and node :
        node.tile = nearestTile;
        node.tile.node = node;
        
        return nearestTile;
    }

};