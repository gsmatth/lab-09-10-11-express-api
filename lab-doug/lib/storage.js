'use strict';

const debug = require('debug')('matchscore:storage');
const AppError = require('./app-error');
exports.pool = {};

exports.setItem = function(schema, item){
  debug('setItem');
  return new Promise(function(resolve, reject){
    if(!item.id){
      var err = AppError.error400('storage setItem requires id');
      return reject(err);
    }
    if(!this.pool[schema])this.pool[schema] = {};
    this.pool[schema][item.id] = item;
    resolve(item);
  });
};

exports.fetchItem = function(schema, id){
  debug('fetchItem');
  return new Promise((resolve, reject) => {
    if(!this.pool[schema]){
      var err = AppError.error404('storage item not found in fetchItem() storage.js');
      return reject(err);
    }
    resolve(this.pool[schema][id]);
  });
};

exports.deleteItem = function(schema, id){
  debug('deleteItem');
  return new Promise((resolve, reject) => {
    if(!this.pool[schema]){
      var err = AppError.error404('storage schema not found in deleteItem() storage.js');
      return reject(err);
    }
    delete this.pool[schema][id];
    resolve(true);
  });
};
