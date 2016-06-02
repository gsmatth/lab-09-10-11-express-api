'use strict';
const uuid = require('node-uuid');
const debug = require('debug')('matchscore:matchscore');
const AppError = require('../lib/app-error');

module.exports = function(distance, score, xCount){
  console.log('entered matchscore constructor');
  debug('creating matchscore');
  if(!distance) throw AppError.error400('matchscore requires distance');
  this.uuid = uuid.v4();
  this.distance = distance;
  this.score = score;
  this.xCount = xCount;
  console.log('this.score value: ', this.score);
};
