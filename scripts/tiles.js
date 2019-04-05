var Tiles = {
    
    getDataTiles : function (width, height) {
        // We solve the following equations :
        // (nbRow * nbCol) - (nbRow / 2) = NB_TILES
        // and
        // nbRow / nbCol = height / width => big aproximation here since rows overlap, so nbRow will be an approximation 
        // we will add tiles until the screen is filled anyway.
        var nbRow = Math.ceil((0.5 + Math.sqrt((0.5 * 0.5) + (4 * (width / height) * NB_TILES))) / ((2 * width) / height)),
            nbCol = Math.ceil((nbRow * width) / height),
            widthTile = (width / nbCol),
            heightTile = ((widthTile * 2) / Math.sqrt(3)),
            sizeTile = (heightTile / 2),
            col = 0,
            row = 0,
            data = [],
            stop = false;

        while (!stop) {
            var x = (col * widthTile) + (row % 2 === 1 ? widthTile : (widthTile / 2)),
                y = height - ((row * heightTile * 3 / 4) + sizeTile);

            var tile = {
                id : "tile_" + col + "_" + row,
                x : x,
                y : y,
                col : col,
                row : row,
                node : null,
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
            
            col++;
            if (col >= ((row % 2 === 0) ? nbCol : nbCol - 1)) {
                col = 0;
                row = row + 1;
                
            }
            stop = ((row * heightTile * 3 / 4) + heightTile >= height);
        }

        return {
            data : data,
            nbCol : nbCol,
            nbRow : row,
            widthTile : widthTile
        };
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
    
    getTileAt : function (tiles, row, col) {
        var result = null;
        
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.row == row && tile.col == col) {
                result = tile;
                break;
            }
        };
        
        return result;
    },
    
    getRandomEmptyTile : function(dataTiles) {
        var randomRow = getRandomInt(0, dataTiles.nbRow - 1),
            randomCol = getRandomInt(0, dataTiles.nbCol - 1 - (randomRow % 2 === 0 ? 0 : 1)),
            randomTile = Tiles.getTileAt(dataTiles.data, randomRow, randomCol);
        
        if (randomTile.node == null) {
            return randomTile;
        } else {
            return this.getRandomEmptyTile(dataTiles);
        }
    },

    renderTiles : function (svg, data) {
        var tiles = svg.selectAll("tile").data(data.tiles.data);

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
        
        if (Tangled.a) {
            tiles.attr("y1", function (t) {
                return t.corners[i].x;
            })
        };

        // outline :
        for (var i = 0; i < 6; i++) {
            this.renderSide(i, tileGroup);
        }

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
            })
            .attr("display", function (t) {
                // we hide the left side of the heagon except for the first col
                // this avoid 2px wide line when hexagone are side to side.
                if (i == 2 && t.col != 0) {
                    return 'none';
                }
            });
    }

};