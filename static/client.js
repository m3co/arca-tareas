'use strict';
((io) => {
  var client = io();
  client.on('connect', () => {
    console.log('connection');

    client.emit('data', {
      query: 'subscribe',
      module: 'viewAPUTasks'
    });

    client.emit('data', {
      query: 'get-edges',
      module: 'viewAPUTasks',
      project: 2
    });

    client.emit('data', {
      query: 'select',
      module: 'viewAPUTasks',
      project: 2
    });
  });

  client.on('response', (data) => {
    var query = data.query;
    if (query == 'select') {
      gantt.doselect(data.row);
    } else if (query == 'get-edges') {
      gantt.setedges(data.row);
    } else {
      console.log('ok ok ok', data);
    }
  });
})(io);
