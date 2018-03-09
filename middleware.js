'use strict';
const fs = require('fs');
const Ini = require('ini');
const express = require('express');
const proxy = require('http-proxy-middleware');
const app = express();
const config = Ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

const wsProxy = proxy('/socket.io', config.socketio);
app.use(wsProxy);
app.use('/socket.io', wsProxy);

app.use('/', proxy({
  target: 'http://localhost:9001',
  changeOrigin: true,
  logLevel: 'debug',
  secure: false,
  xfwd: true
}));

console.log('Listening to http://localhost:1133');
const server = app.listen(1133);
server.on('upgrade', wsProxy.upgrade);
