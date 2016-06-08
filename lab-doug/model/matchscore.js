'use strict';
const uuid = require('node-uuid');
const debug = require('debug')('matchscore:matchscore');
const AppError = require('../lib/app-error');

module.exports = function(distance, score, xCount){
  debug('creating matchscore');
  if(!distance || !score || !xCount) throw AppError.error400('bad request');
  this.uuid = uuid.v4();
  this.distance = distance;
  this.score = score;
  this.xCount = xCount;
};
