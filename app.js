'use strict';
(() => {

var tasks = [
{"start":new Date("Sun Dec 09 01:36:45"),"end":new Date("Sun Dec 09 02:36:45"),"id": "1", "description":"E Job"},
{"start":new Date("Sun Dec 09 04:56:32"),"end":new Date("Sun Dec 09 06:35:47"),"id": "2", "description":"A Job"},
{"start":new Date("Sun Dec 09 06:29:53"),"end":new Date("Sun Dec 09 06:34:04"),"id": "3", "description":"D Job"},
{"start":new Date("Sun Dec 09 05:35:21"),"end":new Date("Sun Dec 09 06:21:22"),"id": "4", "description":"P Job"},
{"start":new Date("Sun Dec 09 05:00:06"),"end":new Date("Sun Dec 09 05:05:07"),"id": "5", "description":"D Job"},
{"start":new Date("Sun Dec 09 03:46:59"),"end":new Date("Sun Dec 09 04:54:19"),"id": "6", "description":"P Job"},
{"start":new Date("Sun Dec 09 04:02:45"),"end":new Date("Sun Dec 09 04:48:56"),"id": "7", "description":"N Job"},
{"start":new Date("Sun Dec 09 03:27:35"),"end":new Date("Sun Dec 09 03:58:43"),"id": "8", "description":"E Job"},
{"start":new Date("Sun Dec 09 01:40:11"),"end":new Date("Sun Dec 09 03:26:35"),"id": "9", "description":"A Job"},
{"start":new Date("Sun Dec 09 03:00:03"),"end":new Date("Sun Dec 09 03:09:51"),"id": "10", "description":"D Job"},
{"start":new Date("Sun Dec 09 01:21:00"),"end":new Date("Sun Dec 09 02:51:42"),"id": "11", "description":"P Job"},
{"start":new Date("Sun Dec 09 01:08:42"),"end":new Date("Sun Dec 09 01:33:42"),"id": "12", "description":"N Job"},
{"start":new Date("Sun Dec 09 00:27:15"),"end":new Date("Sun Dec 09 00:54:56"),"id": "13", "description":"E Job"},
{"start":new Date("Sun Dec 09 00:29:48"),"end":new Date("Sun Dec 09 00:44:50"),"id": "14", "description":"D Job"},
{"start":new Date("Sun Dec 09 07:39:21"),"end":new Date("Sun Dec 09 07:43:22"),"id": "15", "description":"P Job"},
{"start":new Date("Sun Dec 09 07:00:06"),"end":new Date("Sun Dec 09 07:05:07"),"id": "16", "description":"D Job"},
{"start":new Date("Sun Dec 09 08:46:59"),"end":new Date("Sun Dec 09 09:54:19"),"id": "17", "description":"P Job"},
{"start":new Date("Sun Dec 09 09:02:45"),"end":new Date("Sun Dec 09 09:48:56"),"id": "18", "description":"N Job"},
{"start":new Date("Sun Dec 09 08:27:35"),"end":new Date("Sun Dec 09 08:58:43"),"id": "19", "description":"E Job"},
{"start":new Date("Sun Dec 09 08:40:11"),"end":new Date("Sun Dec 09 08:46:35"),"id": "20", "description":"A Job"},
{"start":new Date("Sun Dec 09 08:00:03"),"end":new Date("Sun Dec 09 08:09:51"),"id": "21", "description":"D Job"},
{"start":new Date("Sun Dec 09 10:21:00"),"end":new Date("Sun Dec 09 10:51:42"),"id": "22", "description":"P Job"},
{"start":new Date("Sun Dec 09 11:08:42"),"end":new Date("Sun Dec 09 11:33:42"),"id": "23", "description":"N Job"},
{"start":new Date("Sun Dec 09 12:27:15"),"end":new Date("Sun Dec 09 12:54:56"),"id": "24", "description":"E Job"},
{"start":new Date("Sat Dec 08 23:12:24"),"end":new Date("Sun Dec 09 10:26:13"),"id": "25", "description":"A Job"}];

// Define the div for the tooltip
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  var svgWidth = document.querySelector('svg').getAttribute('width');
  var svgHeight = document.querySelector('svg').getAttribute('height');
  var xaxisHeight = 22;

  var tasksHeight = svgHeight - xaxisHeight;
  var h = tasksHeight / tasks.length;
  var startend = tasks.reduce((acc, d) => {
    acc.start = acc.start ? (acc.start > d.start ? d.start : acc.start) : d.start;
    acc.end = acc.end ? (acc.end < d.end ? d.end : acc.end) : d.end;
    return acc;
  }, { start: undefined, end: undefined });

  var padh = 4;
  var a = d3.select('svg g#tasks')
    .attr('transform', `translate(0, ${xaxisHeight})`)
    .selectAll('rect.row').data(tasks);

  var g1 = a.enter();
  g1.append('rect')
    .attr('fill', (d, i) => i % 2 ? 'green' : 'red')
    .attr('opacity', 0.3)
    .attr('x', 0)
    .attr('y', (d, i) => i * h)
    .attr('width', svgWidth)
    .attr('height', h);

  var g = g1.append('g')
    .attr('transform', (d, i) => {
      return `translate(${
        svgWidth * (d.start - startend.start) / (startend.end - startend.start)
      }, ${i * (h + 0)})`
    });
  g.append('rect')
    .attr('class', 'row')
    .attr('y', (padh / 2))
    .attr('height', h - padh)
    .attr('width', d => {
      return svgWidth * (d.end - d.start) / (startend.end - startend.start);
    })
    .attr('fill', 'blue')
    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(`1.1.5<br>${d.description}`)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

  // set the ranges
  var x = d3.scaleTime().range([0, svgWidth]);
  x.domain([startend.start, startend.end]);

  var b = d3.select('svg g#xaxis')
    .call(d3.axisBottom(x))
    .selectAll('svg g#xaxis .tick line')
      .attr('y2', svgHeight)
      .attr('opacity', 0.2);
})();
