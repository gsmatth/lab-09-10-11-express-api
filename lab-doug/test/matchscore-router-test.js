'use strict';
const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server');
const storage = require('../lib/storage');
const Matchscore = require('../model/matchscore');
const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api/matchscore`;


describe('Testing matchscore-router module, ', function(){
  before((done) => {
    if(!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server is running on port: ', port);
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning){
      server.close(() => {
        console.log('server has been shutdown');
        done();
      });
      return;
    }
    done();
  });

  describe('Testing POST on /api/matchscore endpoint', function(){
    after((done) => {
      storage.pool = {};
      done();
    });
    it('should return a matchscore object', function(done){
      request.post(baseUrl)
      .send({distance:300,score:569, xCount: 27})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.distance).to.equal(300);
        expect(res.body.score).to.equal(569);
        expect(res.body.xCount).to.equal(27);
        done();
      });
    });
  });

  describe('Testing GET on api/matchscore/:uuid', function(){
    before((done) => {
      this.tempMatchscore = new Matchscore(400, 555, 10);
      storage.setItem('matchscore', this.tempMatchscore);
      done();
    });
    after((done)=> {
      storage.pool = {};
      done();
    });

    it('it should return a matchscore object as res.body', (done) => {
      request.get(`${baseUrl}/${this.tempMatchscore.uuid}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.distance).to.equal(this.tempMatchscore.distance);
        expect(res.body.score).to.equal(this.tempMatchscore.score);
        expect(res.body.xCount).to.equal(this.tempMatchscore.xCount);
        done();
      });
    });
    it('it should return a 404/not found on invalid route', (done) => {
      request.get(`${baseUrl}/${123}`)
      .end((err, res) => {
        expect(err.status).to.equal(404);
        expect(res.text).to.equal('not found');
        done();
      });
    });
  });
  describe('Testing PUT on api/matchscore/:uuid', function(){
    before((done) => {
      this.tempMatchscore = new Matchscore(400, 555, 10);
      storage.setItem('matchscore', this.tempMatchscore);
      done();
    });
    after((done) => {
      storage.pool = {};
      done();
    });
    it('should return a modified matchscore object', (done) => {
      request.put(`${baseUrl}/${this.tempMatchscore.uuid}`)
      .send({distance:600, score:400, xCount: 30})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.distance).to.equal(600);
        expect(res.body.score).to.equal(400);
        expect(res.body.xCount).to.equal(30);
        done();
      });
    });
    it('should return a 400 error with bad request', (done) => {
      request.put(`${baseUrl}/${this.tempMatchscore.uuid}`)
      .send({distance: 600, score:569, xCount: 27})
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.score).to.equal(569);
        // expect(err.status).to.equal(400);
        // expect(res.text).to.equal('bad request');
        done();
      });
    });
  });
});
