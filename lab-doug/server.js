'use strict';
const debug = require('debug')('matchscore:server');
const express = require('express');
const bodyParser = require('body-parser');
const matchscoreRouter = require('./route/matchscore-router');
const port = process.env.PORT || 3000;
/*The app object denotes the Express application.  The app returned by express() is in fact a JavaScript Function, designed to be passed to Node’s HTTP servers as a callback to handle requests.*/
const app = express();
app.use(bodyParser.json());
/*loads the router module in the app, matchscoreRouter is an instance of Router object.  In express, the term "use" mounts the specified middleware function or functions at the specified path*/
app.use('/api/matchscore', matchscoreRouter);
//default for routes that fall through route above.  The 'all' means all methods(GET, POST....)'
app.all('*', function(req, res){
  debug('* route is not registered').send('not found');
});
/*this is both createServer and server.listen
The app.listen() method returns an http.Server object and (for HTTP) is a convenience method*/
const server = app.listen(port, function(){
  debug('listen');
  console.log('express app up on port: ', port);
});

server.isRunning = true;
//we export the server module for use by ?????
module.exports = server;
