var Links = {

    getDataLinks : function (dataTiles, dataNodes) {
        var dataLinks = [];
        var result = [];
        
        // generate all possible links :
        for (var i = 0; i < dataNodes.length; i++) {
            var node = dataNodes[i],
                tile = node.tile,
                rowOffset = (tile.row % 2),
                // get the left and 2 top neighbours tiles :
                tile1 = Tiles.getTileAt(dataTiles.data, tile.row, tile.col - 1),
                tile2 = Tiles.getTileAt(dataTiles.data, tile.row - 1, tile.col - 1 + rowOffset),
                tile3 = Tiles.getTileAt(dataTiles.data, tile.row - 1, tile.col + rowOffset), 
                // create a link from the current node to these nodes :
                link1 = this.createLink(tile, tile1),
                link2 = this.createLink(tile, tile2),
                link3 = this.createLink(tile, tile3);
            
            if (link1 != null) {
                dataLinks.push(link1);
            }            
            if (link2 != null) {
                dataLinks.push(link2);
            }
            if (link3 != null) {
                dataLinks.push(link3);
            }
        }
        
        // remove some links randomly :
        for (var i = 0; i < dataLinks.length; i++) {
            var removeLink = (getRandomInt(0, LINKS_DENSITY) == 0),
                link = dataLinks[i];
            
            // test if no node will be left alone :
            if (link.target.linksCount == 1 || link.source.linksCount == 1) {
                removeLink = false;
            }
            
            if (removeLink) {
                link.source.linksCount --;
                link.target.linksCount --;
                
            } else {
                result.push(link);
            }
        }
        

        return result;
    },
    
    createLink : function(sourceTile, targetTile) {
        var link = null;
        
        if (targetTile != null && targetTile.node != null) {
            link = {
                id : "links_" + sourceTile.row + "_" + sourceTile.col + "_" + targetTile.row + "_" + targetTile.col,
                target : targetTile.node,
                source : sourceTile.node
            };
            
            targetTile.node.linksCount ++;
            sourceTile.node.linksCount ++;
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