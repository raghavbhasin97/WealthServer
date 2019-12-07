//During the test the env variable is set to test
process.env.ENV = 'TEST';

let mongoose = require("mongoose");
var assert = require('assert');
let Holding = require('../models/Holding');
let Security = require('../models/Security');
let User = require('../models/User');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

let token = ""

chai.use(chaiHttp);
//Our parent block
describe('Holding', () => {
    beforeEach((done) => { //Before each test we empty the database
        Holding.deleteMany({}, (err) => { 
          User.deleteMany({}, (err) => { 
            // Post User.
            let user = {
              email: 'jdoe@email.com',
              name: 'John Doe',
              password: '123456'
            }
            chai.request(server)
              .post('/api/users')
              .send(user)
              .end((err, res) => {
                chai.request(server)
                    .get('/api/users/login')
                    .send(user)
                    .end((err, res2) => {
                      token = res2.body['token']
                      Security.deleteMany({}, (err) => {
                        const security = new Security({
                          symbol: 'VOO',
                          historicPrices: [100]
                        }) 
                        security
                          .save()
                          .then(s => done())
                      });
                    });
              });
          });  
           
        });        
    });

    /*
    * Test the /POST route
    */
    // Test Successfull.
      it('it should POST a holding with authentication and correct payload', (done) => {
          let holding = {
            security: 'VOO',
            costBasis: 267.89,
            quantity: 2.09
          }
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', token)
            .send(holding)
            .end((err, res) => {
                  res.should.be.html;
                  res.should.have.status(201);
                  res.text.should.eq('Holdings created');
              done();
            });
      });

    // Test Unauthorized.
      it('it should not POST a holding without authentication', (done) => {
          let holding = {
            security: 'VOO',
            costBasis: 267.89,
            quantity: 2.09
          }
        chai.request(server)
            .post('/api/holdings')
            .send(holding)
            .end((err, res) => {
                  res.should.have.status(401);
                  res.text.should.eq('Unauthorized');
              done();
            });
      });

      // Test invalid fields
      it('it should not POST a holding without fields', (done) => {
          let holding = {}
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', token)
            .send(holding)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 3);
                  res.body.should.have.property('security').eql('Security Symbol field is required');
                  res.body.should.have.property('costBasis').eql('Cost Basis field is required');
                  res.body.should.have.property('quantity').eql('Quantity field is required');
              done();
            });
      });

      it('it should not POST a holding without valid costBasis fields', (done) => {
          let holding = {
            security: 'VOO',
            costBasis: "abc",
            quantity: 2.09
          }
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', token)
            .send(holding)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('costBasis').eql('Cost Basis should be a number');
              done();
            });
      });

      it('it should not POST a holding without valid quantity fields', (done) => {
          let holding = {
            security: 'VOO',
            costBasis: 289.99,
            quantity: "abc"
          }
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', token)
            .send(holding)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('quantity').eql('Quantity should be a number');
              done();
            });
      });

      it('it should not POST a holding without valid security', (done) => {
          let holding = {
            security: 'ABC',
            costBasis: 289.99,
            quantity: 1.23
          }
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', token)
            .send(holding)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(404);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('save').eql('Invalid security');
              done();
            });
      });

});