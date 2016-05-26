'use strict';
const debug = require = require('debug')('note:server');
const express = require('express');
const bodyParser = require('body-parser');
const matchscore = require('./route/matchscore-router');
const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use('/api/matchscore', matchscore);
app.all('*', function(req, res){
  debug('* 404').send('not found');
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('express app up on port: ', port);
});

server.isRunning = true;
module.exports = server;
