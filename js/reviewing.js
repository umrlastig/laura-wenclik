const CVIS = {
    BOOK_LIST: ["Books"],
    JOUR_LIST: ["IJGIS", "CaGIS", "TiGIS", "JOSIS", "IJGI", "IJC", "Carto", "Other GIS", "SpatialCog", "IEEE", "ISPRS"],
    CONF_LIST: ["ICC", "GIScience", "GeneICA", "SAGEO", "ISPRS", "ISSDQ"],
    TIME_INTERVAL: ["2006", "2021"],
    SVG_W: 800,
    TITLE_Y: 26,
    CAPTION_X: 40,
    TRACK_WIDTH: 300,
    TRACK_HEIGHT: 18,
    TRACK_X: 110,
    CELL_SIZE: 12,
    CELL_STROKE: 2,
    CELL_MARGIN: 2,
};

const LEGENDS = {
    journals: [
        //{type: "JGED1", desc: "Guest Editor"},
        {type: "JREW1", desc: "Reviewer - 1 paper"},
        //{type: "JGED2", desc: "Guest Editor"},
        {type: "JREW2", desc: "Reviewer - 2 papers"},
        {type: "JREW3", desc: "Reviewer - 3+ papers"},
        {type: "JGED3", desc: "Guest Editor"},
    ],
    conferences: [
        {type: "CHAIR", desc: "Chair"},
        {type: "PCM", desc: "PC Member/Associate Chair"},
        {type: "CREW", desc: "Reviewer"},
    ],
    books: [
        {type: "BED", desc: "Editor"},
        {type: "BREW", desc: "Reviewer"},
    ],
};

/* ---------------------------------- */
const timeParser = d3.timeParse("%Y");

// time axis
var timeScale = d3.scaleTime()
                  .domain(d3.extent(CVIS.TIME_INTERVAL, (d) => timeParser(d)))
                  .rangeRound([0, (CVIS.TIME_INTERVAL[1]-CVIS.TIME_INTERVAL[0])*(CVIS.CELL_SIZE+CVIS.CELL_STROKE+2*CVIS.CELL_MARGIN)]);

/* ---------------------------------- */

var _reviewing4x = function(data, venueList, jobList, parentEl, svg_h, heading){
    var svgEl = d3.select(parentEl).append("svg").classed("rev", true);
    svgEl.attr("width", CVIS.SVG_W);
    svgEl.attr("height", svg_h);
    svgEl.append("text")
         .classed("venueType", true)
         .attr("transform", "translate(0,"+CVIS.TITLE_Y+")")
         .text(heading);

    var legendEl = svgEl.append("g")
                        .attr("transform",
                              "translate("+CVIS.CAPTION_X+",54)");
    legendEl.selectAll("rect.job")
            .data(jobList)
            .enter()
            .append("rect")
            .classed("job", true)
            .attr("x", CVIS.TRACK_X+CVIS.TRACK_WIDTH)
            .attr("y", (d,i) => (i*CVIS.TRACK_HEIGHT-CVIS.CELL_SIZE))
            .attr("width", CVIS.CELL_SIZE)
            .attr("height", CVIS.CELL_SIZE)
            .attr("class", (d) => (d.type));
    legendEl.selectAll("text.job")
            .data(jobList)
            .enter()
            .append("text")
            .classed("job", true)
            .attr("x", CVIS.TRACK_X+CVIS.TRACK_WIDTH+CVIS.CELL_SIZE+4)
            .attr("y", (d,i) => (i*CVIS.TRACK_HEIGHT))
            .text((d) => (d.desc));

    svgEl.append("g")
         .attr("id", heading.toLowerCase())
         .attr("transform", "translate(0,60)");
    svgEl.append("g")
         .attr("transform", "translate("+CVIS.TRACK_X+",54)")
         .call(d3.axisTop(timeScale).tickValues([timeParser("2010"), timeParser("2015"), timeParser("2020")]).tickSizeOuter(0));

    venueGs = d3.select("g#"+heading.toLowerCase())
                .selectAll("g.venues")
                .data(venueList)
                .enter()
                .append("g")
                .classed("venues", true)
                .attr("transform", (d,i) => ("translate("+(CVIS.TRACK_X-10)+","+((i+1)*CVIS.TRACK_HEIGHT)+")"));
    venueGs.append("text")
           .attr("text-anchor", "end")
           .text((d) => (d));
    venueGs.append("rect")
           .attr("x", 10)
           .attr("y", 0)
           .attr("width", CVIS.TRACK_WIDTH)
           .attr("height", 1)
           .attr("fill", "#DDD");
    var jg = d3.select("g#"+heading.toLowerCase()).append("g")
               .attr("transform", "translate("+CVIS.TRACK_X+",0)");
    jg.selectAll("a")
      .data(data)
      .enter()
      .append("a")
      .attr("xlink:href", (d) => (d.url))
      .attr("xlink:title", (d) => (d.description))
      .append("rect")
      .attr("x", (d) => (timeScale(timeParser(d.year))-(CVIS.CELL_SIZE)/2))
      .attr("y", (d) => ((venueList.indexOf(d.name)+1)*CVIS.TRACK_HEIGHT-CVIS.CELL_SIZE))
      .attr("width", CVIS.CELL_SIZE)
      .attr("height", CVIS.CELL_SIZE)
      .attr("class", (d) => (d.type))
      .attr("title", (d) => (d.description));
};

var reviewingVis = function(dataURL){
    d3.json(dataURL).then(
        function(data){
            _reviewing4x(data.journals, CVIS.JOUR_LIST, LEGENDS.journals, "#revj", 320, "Journals");
            _reviewing4x(data.conferences, CVIS.CONF_LIST, LEGENDS.conferences, "#revc", 280, "Conferences");
            _reviewing4x(data.books, CVIS.BOOK_LIST, LEGENDS.books, "#revb", 110, "Books");
        }
    ).catch(function(err){console.log(err);});
};
