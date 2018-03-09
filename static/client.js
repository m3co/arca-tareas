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
    console.log(data);
  });
})(io);
