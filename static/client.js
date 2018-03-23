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
      project: '2'
    });

    client.emit('data', {
      query: 'select',
      module: 'viewCosts1MonthFlow',
      project: '2'
    });
  });

  client.arca = {};
  client.arca.update = function update(row) {
    var event = {
      query: 'update',
      module: 'viewAPUTasks',
      from: 'viewAPUTasks',
      id: row.id,
      idkey: 'id',
      key: ['Tasks_start'],
      value: [row.Tasks_start.toISOString()]
    };
    client.emit('data', event);
  };
  client.arca.select = function select(params) {
    client.emit('data', {
      query: 'select',
      module: 'viewAPUTasks',
      parent: params.parent
    });
  };

  client.on('response', (data) => {
    var query = data.query;
    if (query == 'select' && data.module == 'viewAPUTasks') {
      gantt.doselect(data.row);
    } else if (query == 'select' && data.module == 'viewCosts1MonthFlow') {
      costflow.doselect(data.row);
    } else if (query == 'update') {
      gantt.doupdate(data.row);
    } else if (query == 'delete') {
      gantt.dodelete(data.row);
    } else if (query == 'insert') {
      gantt.doinsert(data.row);
    } else if (query == 'get-edges') {
      gantt.setedges(data.row);
      client.arca.select({
        parent: 2
      });
    } else {
      console.log('not processed', data);
    }
  });
  window.client = client;
})(io);
