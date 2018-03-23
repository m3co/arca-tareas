'use strict';
(() => {
var monthSymbol = Symbol();
var APUIdSymbol = Symbol();
var tempSymbol = Symbol();
var tooltip = d3.select("body div.tooltip");
var sharedX;
function Gantt() {

  var edges = { Tasks_start: null, Tasks_end: null, count: null };
  var tasks = [];

  const COLORS = ['brown', 'red', 'blue', 'maroon', 'darkgreen'];
  const rowHeight = 26;
  const padding = 4;
  const monthWidth = 50;
  var width, height;
  var x = d3.scaleTime();
  var sharedXresolve;
  sharedX = new Promise(resolve => {
    sharedXresolve = resolve;
  });

  function dragstarted(d) {
    d[tempSymbol] = d3.event.x - (d.Tasks_start ? x(d.Tasks_start) : 0);
  }
  function dragged(d) {
    d3.select(this)
      .attr('transform', `translate(${d3.event.x - d[tempSymbol]}, 0)`);
    d3.select(this.parentElement).select('rect.btn-expand')
      .attr('transform', `translate(${d3.event.x - d[tempSymbol]}, ${padding})`);
  }
  function dragended(d) {
    var p = x.invert(d3.event.x - d[tempSymbol]);
    var dstart = p - d.Tasks_start.valueOf();
    delete d[tempSymbol];

    d.Tasks_start = new Date(d.Tasks_start.valueOf() + dstart);
    client.arca.update(d);

    d3.select(this)
      .attr('transform', `translate(${d.Tasks_start ?
        x(d.Tasks_start) : 0}, ${padding})`);
    d3.select(this.parentElement).select('rect.btn-expand')
      .attr('transform', `translate(${x(d.Tasks_start)}, ${padding})`);
  }

  function setedges(row) {
    edges.Tasks_start = new Date(row.Tasks_start);
    edges.Tasks_end = new Date(row.Tasks_end);
    edges.count = row.count;
    width = monthWidth * Math.ceil((edges.Tasks_end - edges.Tasks_start) / 2592000000);
    x.range([50, width - 50]).domain([edges.Tasks_start, edges.Tasks_end]);
    sharedXresolve(x);
    d3.select('svg').attr('width', width)
      .select('g#timeline')
      .call(d3.axisBottom(x));
    d3.select('svg g#tasks')
      .attr('transform', `translate(0, 82)`);
  }

  function dodelete(row) {
    var taskIndex = tasks.findIndex(d => d.id == row.id);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
      renderRows();
    }
  }

  function doupdate(row) {
    var task = tasks.find(d => d.id == row.id);
    if (!task) {
      return;
    }
    row.Tasks_start = row.Tasks_start ? new Date(row.Tasks_start) : null;
    row.Tasks_end = row.Tasks_end ? new Date(row.Tasks_end) : null;
    Object.keys(row).forEach(key => {
      task[key] = row[key];
    });
    renderRows();
  }

  function doselect(row) {
    if (tasks.find(d => d.id == row.id)) {
      return;
    }
    insertTask(row);
    renderRows();
  }

  function doinsert(row) {
    if (tasks.find(d => d.id == row.id)) {
      return;
    }
    if (tasks.find(d => d.APU_parent == row.APU_parent)) {
      insertTask(row);
      renderRows();
    }
  }

  function insertTask(row) {
    row.Tasks_start = row.Tasks_start ? new Date(row.Tasks_start) : null;
    row.Tasks_end = row.Tasks_end ? new Date(row.Tasks_end) : null;
    row[APUIdSymbol] = row.APU_id.split('.')
      .reduce((acc, d, i, array) => {
        acc.push(`${'0'.repeat(5 - d.length)}${d}`);
        if (i + 1 == array.length) {
          acc.push(...(new Array(8 - array.length)).fill('00000'));
        }
        return acc;
      }, []).join('');

    tasks.push(row);
    tasks.sort((a, b) => {
      if (a[APUIdSymbol] > b[APUIdSymbol]) return 1;
      if (a[APUIdSymbol] < b[APUIdSymbol]) return -1;
      return 0;
    });
  }

  function drawBackground(selection) {
    selection.attr('class', 'background')
      .attr('fill', (d, i) => i % 2 ? 'white' : 'gray')
      .attr('opacity', 0.2)
      .attr('width', width)
      .attr('height', rowHeight);
  }

  function drawText(selection) {
    selection.attr('class', 'text')
      .attr('fill', 'black')
      .attr('transform', `translate(${rowHeight}, ${(rowHeight / 2) + padding / 2})`)
      .text(d => `${d.APU_id}${d.Tasks_constrain ?
        `::${d.Tasks_constrain}` : ''}`);
  }

  function drawBar(selection) {
    selection.attr('class', 'bar')
      .attr('height', rowHeight - (padding * 2))
      .attr('width', d => d.Tasks_start && d.Tasks_end ?
        (x(d.Tasks_end) - x(d.Tasks_start)) : 0)
      .attr('fill', d => {
        var p = d.APU_id.match(/[.]/g)
        if (p) {
          return COLORS[p.length];
        }
      });
  }

  function drawTask(selection) {
    selection.attr('class', 'task')
      .attr('transform', (d, i) =>
        `translate(${d.Tasks_start ? x(d.Tasks_start) : 0}, ${padding})`)
      .on("mouseover", function(d) {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`
          Desde:${d.Tasks_start ? d.Tasks_start.toLocaleDateString() : ''}<br>
          Hasta:${d.Tasks_end ? d.Tasks_end.toLocaleDateString() : ''}<br>
          ${d.APU_id}${d.Tasks_constrain ? `::${d.Tasks_constrain}` : ''}<br>
          ${d.APU_description}`)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 30) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));
  }

  function eachDrawExpand(d) {
    if (d.APU_expand) {
      if (!this.querySelector('rect.btn-expand')) {
        d3.select(this).append('rect')
          .attr('class', 'btn-expand')
          .attr('fill', 'gold')
          .attr('width', rowHeight - (padding * 2))
          .attr('height', rowHeight - (padding * 2))
      }
      d3.select(this).select('rect.btn-expand')
        .attr('transform', `translate(${x(d.Tasks_start)}, ${padding})`)
        .on('click', () => {
          client.arca.select({
            parent: d.APU_id
          });
        });
    } else {
      d3.select(this).select('rect.btn-expand').remove();
    }
  }

  function renderRows() {
    height = tasks.length * rowHeight
    d3.select('svg').attr('height', height + 88)
      .selectAll('g#timeline .tick line')
        .attr('y2', height + 88)
        .attr('opacity', 0.2);

    var gtasks = d3.select('svg g#tasks').selectAll('g.row').data(tasks);
    gtasks.attr('id', d => d.id);
    gtasks.select('.background').call(drawBackground);
    gtasks.select('.task').call(drawTask);
    gtasks.select('.text').call(drawText);
    gtasks.select('.bar').call(drawBar);
    gtasks.each(eachDrawExpand);

    var grow = gtasks.enter().append('g')
      .attr('transform', (d, i) => `translate(0, ${i * rowHeight})`)
      .attr('class', 'row')
      .attr('id', d => d.id);

    grow.append('rect').call(drawBackground);

    var gtask = grow.append('g').call(drawTask);
    gtask.append('rect').call(drawBar);
    gtask.append('text').call(drawText);

    grow.each(eachDrawExpand);

    gtasks.exit().remove();
  }

  this.doselect = doselect;
  this.doupdate = doupdate;
  this.dodelete = dodelete;
  this.doinsert = doinsert;
  this.setedges = setedges;
}

function CostFlow() {

  var months = [];
  var cf = d3.select('svg g#costflow');
  function doselect(row) { sharedX.then(x => {
    if (months.findIndex(d => d.id == row.id) == -1) {
      [row.start, row.end] = row.id.split(',').map(d => new Date(d));
      row[monthSymbol] = row.start;
      months.push(row);
      months.sort((a, b) => {
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
        return 0;
      });
    }
    cf.selectAll('text.month')
      .data(months)
      .enter()
      .append('text')
        .attr('class', 'month')
        .attr('transform', (d, i) => {
          var px = x(d[monthSymbol]);
          return `translate(${px < 30 ? 30 : px}, ${15 + ((i % 4) * 15)})`
        })
        .attr('fill', 'black')
        .text(d => `$${Number(Number(d.cost).toFixed(0)).toLocaleString()}`)
        .on("mouseover", function(d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(`
            Desde:${d.start ? d.start.toLocaleDateString() : ''}<br>
            Hasta:${d.end ? d.end.toLocaleDateString() : ''}<br>
            Total: $${Number(Number(d.cost).toFixed(0)).toLocaleString()}<br>
            Material: $${Number(Number(d.cost_material).toFixed(0)).toLocaleString()}<br>
            Mano de Obra: $${Number(Number(d.cost_mdo).toFixed(0)).toLocaleString()}<br>
            Equipo: $${Number(Number(d.cost_equipo).toFixed(0)).toLocaleString()}<br>
            Herramienta: $${Number(Number(d.cost_herramienta).toFixed(0)).toLocaleString()}<br>
            Transporte: $${Number(Number(d.cost_transporte).toFixed(0)).toLocaleString()}<br>
            Subcontrato: $${Number(Number(d.cost_subcontrato).toFixed(0)).toLocaleString()}<br>
            `)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 30) + "px")
            .each(function(d) {
              var rect = this.getBoundingClientRect();
              if (rect.right > document.body.offsetWidth) {
                var l = Math.abs(rect.right - document.body.offsetWidth);
                d3.select(this).style('left', (rect.left - l - 10) + "px");
              }
            });
        })
        .on("mouseout", function(d) {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });
  }); }

  this.doselect = doselect;
}

window.gantt = new Gantt();
window.costflow = new CostFlow();

})();
