//During the test the env variable is set to test
process.env.ENV = 'TEST';

let mongoose = require("mongoose");
var assert = require('assert');
let Security = require('../models/Security');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Security', () => {
    beforeEach((done) => { //Before each test we empty the database
        Security.deleteMany({}, (err) => { 
           done();           
        });        
    });

    // Test unauthenticated.
      it('it should not POST a security without auth secret', (done) => {
          let security = {
            symbol: 'VOO',
            'historicPrices': [100, 200]
          }
        chai.request(server)
            .post('/api/securitys')
            .send(security)
            .end((err, res) => {
                  res.should.be.html;
                  res.should.have.status(401);
                  res.text.should.eq('Unauthorized');
              done();
            });
      });

      // Test Authenticated error.
      it('it should not POST a invalid security payload', (done) => {
          let security = {
            key: 'SECURITY_SECRET_TEST',
            symbol: 'VOO',
            'historicPrices': "invalid"
          }
        chai.request(server)
            .post('/api/securitys')
            .send(security)
            .end((err, res) => {
                  res.should.be.html;
                  res.should.have.status(400);
                  res.text.should.eq('Failed to update security price.');
              done();
            });
      });

      // Test Authenticated - valid post.
      it('it should POST a valid security payload', (done) => {
          let security = {
            key: 'SECURITY_SECRET_TEST',
            symbol: 'VOO',
            'historicPrices': [100, 200]
          }
        chai.request(server)
            .post('/api/securitys')
            .send(security)
            .end((err, res) => {
                  res.should.be.html;
                  res.should.have.status(200);
                  res.text.should.eq('Updated');
              done();
            });
      });

});