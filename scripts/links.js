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
            var removeLink = (getRandomInt(0, Tangled.linksDensity) == 0),
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
                source : sourceTile.node,
                intersect : false,
                drag : false
            };
            
            targetTile.node.linksCount ++;
            sourceTile.node.linksCount ++;
        }
        
        return link;
    },
    
    checkIntersections : function(links) {
        var result = true;
        
        links.each(function (link1) {
            link1.intersect = false;
            links.each(function (link2) {
                if (link1 != link2) {
                    if (Links.intersect(link1.source, link1.target, link2.source, link2.target)) {
                        link1.intersect = true;
                        result = false;
                        //TODO break;
                    }
                } 
            });

            if (link1.intersect) {
                if (link1.drag) {
                    d3.select(this).style("stroke", STROKE_COLOR_DRAGGED_INTERSECT);
                } else {
                    d3.select(this).style("stroke", STROKE_COLOR_INTERSECT);
                }
            } else {
                if (link1.drag) {
                    d3.select(this).style("stroke", STROKE_COLOR_DRAGGED);
                } else {
                    d3.select(this).style("stroke", STROKE_COLOR);
                }
            }           
        });
        
        return result;
    },
    
    /**
     * http://stackoverflow.com/a/1968345
     */
    intersect : function(p0, p1, p2, p3) {
        if (p0 == p2 || p0 == p3 || p1 == p2 || p1 == p3) {
            return false;
        }
        
        var s1_x = p1.x - p0.x,
            s1_y = p1.y - p0.y,
            s2_x = p3.x - p2.x,
            s2_y = p3.y - p2.y,
            s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y),
            t = ( s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

        return (s >= 0 && s <= 1 && t >= 0 && t <= 1);  
    },

    renderLinks : function (svg, data) {
        var links = svg.selectAll("link").data(data.links);

        links.exit()
            .remove();

        links.enter()
            .append("line")
                .style("stroke", STROKE_COLOR)
                .style("stroke-width", STROKE_WIDTH)
                .attr("x1", function (l) {
                    return l.source.startX;
                })
                .attr("y1", function (l) {
                    return l.source.startY;
                })
                .attr("x2", function (l) {
                    return l.target.startX;
                })
                .attr("y2", function (l) {
                    return l.target.startY;
                })
                // http://stackoverflow.com/questions/24653431/d3js-overlapping-elements-how-to-pass-through-clicks-to-lower-element
                .attr("pointer-events", "none") 
            .transition()
            .duration(APPEAR_ANIMATION_DURATION_MS)
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