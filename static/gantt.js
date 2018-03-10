'use strict';
(() => {
var APUId_normalized = Symbol();
function Gantt() {

  var edges = { Tasks_start: null, Tasks_end: null, count: null };
  var rows = [];

  const rowHeight = 26;
  const padding = 4;
  var width, height;
  var x = d3.scaleTime();

  function setedges(row) {
    edges.Tasks_start = new Date(row.Tasks_start);
    edges.Tasks_end = new Date(row.Tasks_end);
    edges.count = row.count;
    width = document.body.clientWidth - 14;
    x.range([0, width]).domain([edges.Tasks_start, edges.Tasks_end]);
    d3.select('svg').attr('width', width)
      .select('g#timeline')
      .call(d3.axisBottom(x));
  }

  function doselect(row) {
    row.Tasks_start = row.Tasks_start ? new Date(row.Tasks_start) : null;
    row.Tasks_end = row.Tasks_end ? new Date(row.Tasks_end) : null;
    row[APUId_normalized] = row.APU_id.split('.')
      .reduce((acc, d, i, array) => {
        if (i == 0) {
          acc.unshift((new Array(8 - array.length)).fill('00000'));
        }
        acc.push(`${'0'.repeat(5 - d.length)}${d}`);
        return acc;
      }, [])
      .join('.');

    rows.push(row);
    rows.sort((a, b) => {
      if (a[APUId_normalized] > b[APUId_normalized]) return 1;
      if (a[APUId_normalized] < b[APUId_normalized]) return -1;
      return 0;
    });

    renderRows();
  }

  function renderRows() {
    height = rows.length * rowHeight
    d3.select('svg').attr('height', height)
      .selectAll('g#timeline .tick line')
        .attr('y2', height)
        .attr('opacity', 0.2);
  }

  this.doselect = doselect;
  this.setedges = setedges;
}

window.gantt = new Gantt();
})();
