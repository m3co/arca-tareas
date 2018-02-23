'use strict';
(() => {

var tasks = [
{"start":new Date("Sun Dec 09 01:36:45 EST 2012"),"end":new Date("Sun Dec 09 02:36:45 EST 2012"),"id": "1", "name":"E Job"},
{"start":new Date("Sun Dec 09 04:56:32 EST 2012"),"end":new Date("Sun Dec 09 06:35:47 EST 2012"),"id": "2", "name":"A Job"},
{"start":new Date("Sun Dec 09 06:29:53 EST 2012"),"end":new Date("Sun Dec 09 06:34:04 EST 2012"),"id": "3", "name":"D Job"},
{"start":new Date("Sun Dec 09 05:35:21 EST 2012"),"end":new Date("Sun Dec 09 06:21:22 EST 2012"),"id": "4", "name":"P Job"},
{"start":new Date("Sun Dec 09 05:00:06 EST 2012"),"end":new Date("Sun Dec 09 05:05:07 EST 2012"),"id": "5", "name":"D Job"},
{"start":new Date("Sun Dec 09 03:46:59 EST 2012"),"end":new Date("Sun Dec 09 04:54:19 EST 2012"),"id": "6", "name":"P Job"},
{"start":new Date("Sun Dec 09 04:02:45 EST 2012"),"end":new Date("Sun Dec 09 04:48:56 EST 2012"),"id": "7", "name":"N Job"},
{"start":new Date("Sun Dec 09 03:27:35 EST 2012"),"end":new Date("Sun Dec 09 03:58:43 EST 2012"),"id": "8", "name":"E Job"},
{"start":new Date("Sun Dec 09 01:40:11 EST 2012"),"end":new Date("Sun Dec 09 03:26:35 EST 2012"),"id": "9", "name":"A Job"},
{"start":new Date("Sun Dec 09 03:00:03 EST 2012"),"end":new Date("Sun Dec 09 03:09:51 EST 2012"),"id": "10", "name":"D Job"},
{"start":new Date("Sun Dec 09 01:21:00 EST 2012"),"end":new Date("Sun Dec 09 02:51:42 EST 2012"),"id": "11", "name":"P Job"},
{"start":new Date("Sun Dec 09 01:08:42 EST 2012"),"end":new Date("Sun Dec 09 01:33:42 EST 2012"),"id": "12", "name":"N Job"},
{"start":new Date("Sun Dec 09 00:27:15 EST 2012"),"end":new Date("Sun Dec 09 00:54:56 EST 2012"),"id": "13", "name":"E Job"},
{"start":new Date("Sun Dec 09 00:29:48 EST 2012"),"end":new Date("Sun Dec 09 00:44:50 EST 2012"),"id": "14", "name":"D Job"},
{"start":new Date("Sun Dec 09 07:39:21 EST 2012"),"end":new Date("Sun Dec 09 07:43:22 EST 2012"),"id": "15", "name":"P Job"},
{"start":new Date("Sun Dec 09 07:00:06 EST 2012"),"end":new Date("Sun Dec 09 07:05:07 EST 2012"),"id": "16", "name":"D Job"},
{"start":new Date("Sun Dec 09 08:46:59 EST 2012"),"end":new Date("Sun Dec 09 09:54:19 EST 2012"),"id": "17", "name":"P Job"},
{"start":new Date("Sun Dec 09 09:02:45 EST 2012"),"end":new Date("Sun Dec 09 09:48:56 EST 2012"),"id": "18", "name":"N Job"},
{"start":new Date("Sun Dec 09 08:27:35 EST 2012"),"end":new Date("Sun Dec 09 08:58:43 EST 2012"),"id": "19", "name":"E Job"},
{"start":new Date("Sun Dec 09 08:40:11 EST 2012"),"end":new Date("Sun Dec 09 08:46:35 EST 2012"),"id": "20", "name":"A Job"},
{"start":new Date("Sun Dec 09 08:00:03 EST 2012"),"end":new Date("Sun Dec 09 08:09:51 EST 2012"),"id": "21", "name":"D Job"},
{"start":new Date("Sun Dec 09 10:21:00 EST 2012"),"end":new Date("Sun Dec 09 10:51:42 EST 2012"),"id": "22", "name":"P Job"},
{"start":new Date("Sun Dec 09 11:08:42 EST 2012"),"end":new Date("Sun Dec 09 11:33:42 EST 2012"),"id": "23", "name":"N Job"},
{"start":new Date("Sun Dec 09 12:27:15 EST 2012"),"end":new Date("Sun Dec 09 12:54:56 EST 2012"),"id": "24", "name":"E Job"},
{"start":new Date("Sat Dec 08 23:12:24 EST 2012"),"end":new Date("Sun Dec 09 00:26:13 EST 2012"),"id": "25", "name":"A Job"}];

  var WIDTH = document.querySelector('svg').getAttribute('width');
  var HEIGHT = document.querySelector('svg').getAttribute('height');
  var h = HEIGHT / tasks.length;

  var a = d3.select('svg g').selectAll('rect').data(tasks);
  var g = a.enter().append('g')
    .attr('transform', (d, i) => {
      return `translate(0, ${i * (h + 2)})`
    });
  g.append('rect')
    .attr('height', h)
    .attr('width', 8)
    .attr('fill', 'blue');
  g.append('text')
    .text(d => {
      return `${d.id} -- ${d.name}`;
    })
    .attr('fill', 'black')
    .attr('x', (d, i) => {
      return 15;
    })
    .attr('y', 3 * h / 4);

})();
