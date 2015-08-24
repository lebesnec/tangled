var Links = {

    getDataLinks : function (dataNodes) {
        var me = this;
        
        var data = d3.range(NB_LINKS).map(function (value) {
            return {
                id : "links_" + value,
                target : dataNodes[me.getRandomInt(0, dataNodes.length - 1)],
                source : dataNodes[me.getRandomInt(0, dataNodes.length - 1)]
            };
        });

        return data;
    },
    
    /**
     * http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    getRandomInt : function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
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
                //d3.select(this).attr("y1", l.source.y);//TODO ?
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