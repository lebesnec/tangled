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
                    hexCorner(x, y, sizeTile, 0),
                    hexCorner(x, y, sizeTile, 1),
                    hexCorner(x, y, sizeTile, 2),
                    hexCorner(x, y, sizeTile, 3),
                    hexCorner(x, y, sizeTile, 4),
                    hexCorner(x, y, sizeTile, 5)
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

    renderTiles : function (svg, data) {
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
        //TODO un seul tracé ?
        //TODO trais manquant
        for (var i = 0; i < 3; i++) {
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

        return tiles;
    }

};