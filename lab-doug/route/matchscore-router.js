'use strict';

const Router = require('express').Router;
const debug = require('debug')('matchscore:matchscore-router');
const matchscoreRouter = module.exports = new Router();
const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Matchscore = require('../model/matchscore');

function createMatchscore(reqBody){
  debug('createMatchscore');
  return new Promise(function(resolve, reject){
    var matchscore;
    try{
      matchscore = new Matchscore(reqBody.distance, reqBody.score, reqBody.xCount);
    } catch(err){
      return  reject(err);
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
  debug('hit endpoint /api/matchscore POST');
  createMatchscore(req.body)
  .then(function(matchscore){
    res.status(200).json(matchscore);
  })
  .catch(res.sendError);
});

matchscoreRouter.put('/:uuid',function(req, res){
  storage.fetchItem('matchscore', req.params.uuid)
  .then(function(matchscore){
    if(!req.body.distance || !req.body.score || !req.body.xCount) throw AppError.error400('bad req.body submitted on PUT route');
    matchscore.distance = req.body.distance;
    matchscore.score = req.body.score;
    matchscore.xCount = req.body.xCount;
    res.status(200).json(matchscore);
  }).catch(res.sendError);
});

matchscoreRouter.get('/:uuid', function(req, res){
  storage.fetchItem('matchscore', req.params.uuid)
  .then(function(matchscore){
    res.status(200).json(matchscore);
  }).catch(res.sendError);
});

matchscoreRouter.delete('/:uuid', function(req, res){
  storage.deleteItem('matchscore', req.params.uuid)
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
