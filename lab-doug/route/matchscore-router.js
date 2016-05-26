'use strict';

const Router = require('express').Router;
const matchscoreRouter = module.exports = new Router();
const debug = require('debug')('matchscore:matchscore-router');
const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Matchscore = require('../lib/matchscore');

function createMatchscore(reqBody){
  debug('createMatchscore');
  return new Promise(function(resolve, reject){
    debugger;
    var matchscore;
    try{
      matchscore = new Matchscore(reqBody.content);
    } catch(err){
      reject(err);
    }
    storage.setItem('matchscore', matchscore)
    .then (function(matchscore){
      resolve(matchscore);
    }).catch(function(err){
      reject(err);
    });
  });
}

matchscoreRouter.post('/', function(req, res){
  debug('hit endpoint /api/matscore/POST');
  createMatchscore(req.Body)
  .then(function(matchscore){
    res.status(200).json(matchscore);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode)
      .send(err.responseMessage);
      return;
    }
    res.status(500)
    .send('internal server error');
  });
});

matchscoreRouter.get('/:id', function(req, res){
  storage.fetchItem('note', req.params.id)
  .then(function(matchscore){
    res.status(200).json(matchscore);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode)
      .send(err.responseMessage);
      return;
    }
    res.status(500)
    .send('internal server error');
  });
});
