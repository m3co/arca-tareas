'use strict';
(() => {
  const COLORS = ['brown', 'red', 'blue', 'maroon', 'darkgreen'];
  fetch('example.json')
    .then(response => response.json())
    .then(tasks => {
      render(tasks.map(d => {
        if (d.expand) {
          [d.start, d.end] = [null, null];
        } else {
          [d.start, d.end] = [new Date(d.start), new Date(d.end)];
        }
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
    if (d.expand) {
      return acc;
    }
    acc.start = acc.start ? (acc.start > d.start ? d.start : acc.start) : d.start;
    acc.end = acc.end ? (acc.end < d.end ? d.end : acc.end) : d.end;
    return acc;
  }, { start: undefined, end: undefined });

  var padh = 4;
  var a = d3.select('svg g#tasks')
    .attr('transform', `translate(0, ${xaxisHeight})`)
    .selectAll('g.row').data(tasks).enter();

  var g1 = a.append('g')
    .attr('transform', (d, i) => {
      return `translate(0, ${i * (h + 0)})`
    })
    .attr('y', (d, i) => i * h)
    .attr('class', 'row');

  g1.append('rect')
    .attr('fill', (d, i) => i % 2 ? 'green' : 'red')
    .attr('opacity', 0.3)
    .attr('width', svgWidth)
    .attr('height', h);

  var g = g1.append('g')
    .attr('transform', (d, i) => {
      if (d.expand) {
        return 'translate(0,0)';
      }
      return `translate(${
        svgWidth * (d.start - startend.start) / (startend.end - startend.start)
      }, 0)`
    })
    .on("mouseover", function(d) {
      tooltip.transition()
        .duration(200)
        .style("opacity", .9);
      tooltip.html(`${d.id}<br>${d.description}`)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 30) + "px");
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
  g.append('rect')
    .attr('y', (padh / 2))
    .attr('height', h - padh)
    .attr('width', d => {
      if (d.expand) {
        return 0
      }
      return svgWidth * (d.end - d.start) / (startend.end - startend.start);
    })
    .attr('fill', d => {
      var p = d.id.match(/[.]/g);
      if (d.expand) {
        if (p) {
          return COLORS[p.length];
        }
        return COLORS[0];
      } else {
        return COLORS[COLORS.length - 1];
      }
    });
  g.append('text')
    .attr('fill', 'white')
    .attr('y', h - padh)
    .text(d => d.id);

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
