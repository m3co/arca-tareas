'use strict';
(() => {
  fetch('example.json')
    .then(response => response.json())
    .then(tasks => {
      render(tasks.map(d => {
        d.start = new Date(d.start);
        d.end = new Date(d.end);
        return d;
      }));
    });
function render(tasks) {
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
}
})();
