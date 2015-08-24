var Tiles = {
    
    getDataTiles : function (width, height) {
        var widthTile = (width / NB_TILES_PER_ROW),
            heightTile = ((widthTile * 2) / Math.sqrt(3)),
            sizeTile = (heightTile / 2),
            col = 0,
            row = 0,
            data = [],
            stop = false;

        while (!stop) {
            var x = (col * widthTile) + (row % 2 === 1 ? widthTile : (widthTile / 2)),
                y = (row * heightTile * 3 / 4) + sizeTile;

            var tile = {
                id : "tile_" + col + "_" + row,
                x : x,
                y : y,
                col : col,
                row : row,
                corners : [
                    this.hexCorner(x, y, sizeTile, 0),
                    this.hexCorner(x, y, sizeTile, 1),
                    this.hexCorner(x, y, sizeTile, 2),
                    this.hexCorner(x, y, sizeTile, 3),
                    this.hexCorner(x, y, sizeTile, 4),
                    this.hexCorner(x, y, sizeTile, 5)
                ]
            };
            data.push(tile);
            
            col = col + 1;
            if (col >= ((row % 2 === 0) ? NB_TILES_PER_ROW : NB_TILES_PER_ROW - 1)) {
                col = 0;
                row = row + 1;
            }
            stop = ((row * heightTile * 3 / 4) + heightTile >= height);
        }

        return data;
    },
    
    /**
     * http://www.redblobgames.com/grids/hexagons/#basics
     * In a regular hexagon the interior angles are 120°. 
     * There are six “wedges”, each an equilateral triangle with 60° angles inside. 
     * Corner i is at (60° * i), size units away from the center.
     */
    hexCorner : function (centerX, centerY, size, i) {
        var angleRad = (Math.PI / 180) * ((60 * i) + 30);

        return {
            x : centerX + (size * Math.cos(angleRad)),
            y : centerY + (size * Math.sin(angleRad))
        };
    },

    renderTiles : function (svg, data) {
        var me = this;
        var tiles = svg.selectAll("tile").data(data.tiles);

        tiles.exit()
            .remove();

        var tileGroup = tiles.enter()
            .append("g")
                .attr("class", "tile");

        // center :
        tileGroup.append("circle")
            .attr("r", 1)
            .attr("cx", function (t) {
                return t.x;
            })
            .attr("cy", function (t) {
                return t.y;
            });

        // outline :
        for (var i = 0; i < 6; i++) {
            this.renderSide(i, tileGroup);
        }
        
        /*this.renderSide(0, tileGroup);
        this.renderSide(4, tileGroup);
        this.renderSide(5, tileGroup);
        
        tileGroup
            .filter(function (t) {
                return t.row == 0;
            })
            .each(function (t) {
                me.renderSide(3, d3.select(this));
            });
        
        tileGroup
            .filter(function (t) {
                return t.col == 0;
            })
            .each(function (t) {
                me.renderSide(1, d3.select(this));
                me.renderSide(2, d3.select(this));
                me.renderSide(3, d3.select(this));
            });
        
        tileGroup
            .filter(function (t) {
                return t.col == 0;
            })
            .each(function (t) {
                me.renderSide(1, d3.select(this));
                me.renderSide(2, d3.select(this));
                me.renderSide(3, d3.select(this));
            });*/

        return tiles;
    },
    
    renderSide : function (i, tileGroup) {
        tileGroup.append("line")
            .attr("x1", function (t) {
                return t.corners[i].x;
            })
            .attr("y1", function (t) {
                return t.corners[i].y;
            })
            .attr("x2", function (t) {
                return t.corners[(i + 1) % 6].x;
            })
            .attr("y2", function (t) {
                return t.corners[(i + 1) % 6].y;
            });
    }

};