var Tiles = {
    
    getDataTiles : function (width, height) {
        var widthTile = Math.sqrt((width * height) / NB_TILES),
            heightTile = (widthTile * 2) / Math.sqrt(3),
            sizeTile = heightTile / 2,
            row = 0,
            col = 0;

        //TODO bien callé la grid dans la page
        var data = d3.range(NB_TILES).map(function (value) {
            row = row + 1;
            if (row * widthTile >= width) {
                row = 0;
                col = col + 1;
            }
            var x = (row * widthTile) + (col % 2 === 1 ? (widthTile / 2) : 0),
                y = col * heightTile * 3 / 4;

            return {
                id : "tile_" + value,
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
        });

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
            .attr("r", 2)
            .attr("cx", function (t) {
                return t.x;
            })
            .attr("cy", function (t) {
                return t.y;
            });

        // outline :
        //TODO un seul tracé ?
        for (var i = 0; i < 6; i++) {
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