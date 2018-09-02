'use strict';
((io) => {
  var client = io();
  var ProjectId = location.search.match(/\d+$/);
  client.on('connect', () => {
    console.log('connection');

    client.emit('data', {
      query: 'subscribe',
      module: 'viewAAUTasks'
    });

    if (ProjectId) {
      client.emit('data', {
        query: 'get-edges',
        module: 'viewAAUTasks',
        project: ProjectId
      });

      client.emit('data', {
        query: 'select',
        module: 'viewAAUCosts1MonthFlow',
        id: ProjectId
      });
    }

    client.emit('data', {
      query: 'select',
      module: 'Projects'
    });
  });

  client.arca = {};
  client.arca.update = function update(row) {
    var event = {
      query: 'update',
      module: 'viewAAUTasks',
      from: 'viewAAUTasks',
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
      module: 'viewAAUTasks',
      parent: params.parent
    });
  };

  client.on('response', (data) => {
    var query = data.query;
    if (query == 'select' && data.module == 'viewAAUTasks') {
      gantt.doselect(data.row);
    } else if (query == 'select' && data.module == 'viewAAUCosts1MonthFlow') {
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
        parent: ProjectId
      });
    } else if (query == 'select' && data.module == 'Projects') {
      window.projects.doselect(data.row);
    } else {
      console.log('not processed', data);
    }
  });
  window.client = client;
})(io);
