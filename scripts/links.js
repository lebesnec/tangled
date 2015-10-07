var Links = {

    getDataLinks : function (dataTiles, dataNodes) {
        var data = [];
        
        for (var i = 0; i < dataNodes.length; i++) {
            var node = dataNodes[i],
                tile = node.tile,
                rowOffset = (tile.row % 2);
            
            // get the neighbour tiles :
            var tile1 = Tiles.getTileAt(dataTiles.data, tile.row, tile.col - 1);
            var tile2 = Tiles.getTileAt(dataTiles.data, tile.row - 1, tile.col - 1 + rowOffset);
            var tile3 = Tiles.getTileAt(dataTiles.data, tile.row - 1, tile.col + rowOffset);
            
            var link1 = this.createLink(tile, tile1, false);
            if (link1 != null) {
                data.push(link1);
            }
            var link2 = this.createLink(tile, tile2, false);
            if (link2 != null) {
                data.push(link2);
            }
            var link3 = this.createLink(tile, tile3, (link1 == null && link2 == null));
            if (link3 != null) {
                data.push(link3);
            }
            
           /* // fix the first row of dot :
            if (link1 == null && link2 == null && link3 == null) {
                link1 = this.createLink(tile, tile1, true);
                if (link1 != null) {
                    data.push(link1);
                }
            }*/
        }

        return data;
    },
    
    createLink : function(sourceTile, targetTile, forceCreation) {
        var link = null;
        
        if (targetTile != null && targetTile.node != null) {
            var ok = forceCreation || (getRandomInt(0, 1) == 1);
            if (ok) {
                link = {
                    id : "links_" + sourceTile.row + "_" + sourceTile.col 
                                  + "_" + targetTile.row + "_" + targetTile.col,
                    target : targetTile.node,
                    source : sourceTile.node
                };
            }
        }
        
        return link;
    },

    renderLinks : function (svg, data) {
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

};