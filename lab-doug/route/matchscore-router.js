'use strict';

const bodyParser = require('body-parser').json();
const Router = require('express').Router;
const debug = require('debug')('matchscore:matchscore-router');
const matchscoreRouter = module.exports = new Router();
const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const MatchScoreModel = require('../model/matchscore');

function createMatchscore(reqBody){
  console.log('entered createMatchscore');
  debug('createMatchscore');
  return new Promise(function(resolve, reject){
    var matchscore;
    try{
      console.log('entered try block in createMatchscore');
      matchscore = new MatchScoreModel(reqBody.distance, reqBody.score, reqBody.xCount);
      console.log('value of new object:', matchscore);
    } catch(err){
      console.log('entered catch block in createMatchscore');
      return  reject(err);
    }
    console.log('value of matchscore passed to setItem:', matchscore);
    storage.setItem('matchscore', matchscore)
    .then (function(matchscore){
      console.log('then statement in matchscore-router setItem called');
      resolve(matchscore);
    }).catch(function(err){
      reject(err);
    });
  });
}

matchscoreRouter.post('/', bodyParser, function(req, res){
  debug('hit endpoint /api/matchscore POST');
  console.log('invoking createMatchscore in matchscoreRouter.post');
  createMatchscore(req.body)
  .then(function(matchscore){
    console.log('matchscore object: ', matchscore);
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

//update
matchscoreRouter.put('/:uuid',function(req, res){
  storage.fetchItem('matchscore', req.params.uuid)//this.pool[schema][uuid]);
  .then(function(matchscore){
    console.log('value of matchscore.score: ', matchscore.score);
    console.log('value of matchscore: ', matchscore);
    console.log('req.body content: ', req.body);
    matchscore.distance = req.body.distance;
    matchscore.score = req.body.score;
    matchscore.xCount = req.body.xCount;
    console.log('value of matchscore: ', matchscore);
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

matchscoreRouter.get('/:uuid', function(req, res){
  storage.fetchItem('matchscore', req.params.uuid)
  .then(function(){
    //build updated object
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

//update
matchscoreRouter.delete('/:uuid', function(req, res){
  storage.deleteItem('matchscore', req.params.uuid)
  .then(function(matchscore){
    console.log('deleted object: ', matchscore);
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
