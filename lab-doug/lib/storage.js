'use strict';

const debug = require('debug')('matchscore:storage');
const AppError = require('./app-error');
exports.pool = {};

exports.setItem = (function(schema, item) {
  debug('setItem in storage.js');
  return new Promise((resolve, reject) => {
    if(!item.uuid){
      // console.log('entered error block in setItem');
      var err = AppError.error400('storage.js setItem method requires uuid');
      return reject(err);
    }
    if(!this.pool[schema]){
      // console.log('an object with this schema does not exist, create it storage.js');
      this.pool[schema] = {};
    }
    this.pool[schema][item.uuid] = item;
    // console.log('pool content: ', this.pool);
    resolve(item);
  });
});

exports.fetchItem = function(schema, uuid){
  debug('fetchItem');
  return new Promise((resolve, reject) => {
    if(!this.pool[schema]){
      var err = AppError.error404('storage item not found in fetchItem() storage.js');
      return reject(err);
    }
    if(!this.pool[schema][uuid]){
      err = AppError.error404('UUID not found in memory pool');
      return reject(err);
    }
    resolve(this.pool[schema][uuid]);
  });
};

exports.deleteItem = function(schema, uuid){
  debug('deleteItem');
  return new Promise((resolve, reject) => {
    if(!this.pool[schema]){
      var err = AppError.error404('storage schema not found in deleteItem() storage.js');
      return reject(err);
    }
    // console.log('entering delete in storage.js deleteItem(): ', this.pool[schema][uuid]);
    delete this.pool[schema][uuid];
    resolve(true);
  });
};
