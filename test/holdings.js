//During the test the env variable is set to test
process.env.ENV = 'TEST';

let mongoose = require("mongoose");
var assert = require('assert');
let Holding = require('../models/Holding');
let Security = require('../models/Security');
let User = require('../models/User');
let Account = require('../models/Account');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

let testENV = {}

chai.use(chaiHttp);
//Our parent block
describe('Holding', () => {
    beforeEach((done) => { //Before each test we empty the database
    Account.deleteMany({}, _ => {
      Holding.deleteMany({}, _ => {
        Security.deleteMany({}, _ => {
          User.deleteMany({}, _ => {
            user = new User({
              email: 'jdoe@email.com',
              name: 'John Doe',
              password: '123456'
            })
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, _) => {
                    chai.request(server)
                        .get('/api/users/login')
                        .send(user)
                        .end((_, res) => {
                            testENV['token'] = res.body['token']
                            User.findOne({email: user.email})
                                .then( createdUser => {
                                        let account = new Account({
                                            name: 'Chase You Invest',
                                            userId: createdUser._id,
                                            holdings: []
                                        })
                                        account.save().then(createdAccount => {
                                            testENV['accountId'] = createdAccount._id
                                            const security = new Security({
                                                symbol: 'VOO',
                                                historicPrices: [100]
                                            })
                                            security.save().then( _ => done())
                                        })
                                })
                        })
                })
          })
        })
      })      
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
            quantity: 2.09,
            accountId: testENV.accountId
          }
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', testENV.token)
            .send(holding)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(201);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 5);
                  const holding = res.body
                  // Validate Hlding exists.
                  Holding
                    .findOne({_id: holding._id})
                    .then(_ => {
                        // Validate Account was updated.
                        Account
                            .findOne({_id: testENV.accountId})
                            .then( account => {
                                assert.equal(account.holdings.length, 1)
                                assert.equal(account.holdings[0], holding._id)
                                done();
                            })
                            .catch( _ => assert(false,'Failed to validate update of account'))
                    })
                    .catch( _ => assert(false,'Failed to validate existance of holding'))
            });
      });

    // Test Unauthorized.
      it('it should not POST a holding without authentication', (done) => {
          let holding = {
            security: 'VOO',
            costBasis: 267.89,
            quantity: 2.09,
            accountId: testENV.accountId
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
            .set('Authorization', testENV.token)
            .send(holding)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 4);
                  res.body.should.have.property('security').eql('Security Symbol field is required');
                  res.body.should.have.property('costBasis').eql('Cost Basis field is required');
                  res.body.should.have.property('quantity').eql('Quantity field is required');
                  res.body.should.have.property('accountId').eql('Account Id field is required');
              done();
            });
      });

      it('it should not POST a holding without valid costBasis fields', (done) => {
          let holding = {
            security: 'VOO',
            costBasis: "abc",
            quantity: 2.09,
            accountId: testENV.accountId
          }
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', testENV.token)
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
            quantity: "abc",
            accountId: testENV.accountId
          }
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', testENV.token)
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
            quantity: 1.23,
            accountId: testENV.accountId
          }
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', testENV.token)
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

      it('it should not POST a holding without an account Id', (done) => {
          let holding = {
            security: 'VOO',
            costBasis: 289.99,
            quantity: 1.23
          }
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', testENV.token)
            .send(holding)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('accountId').eql('Account Id field is required');
              done();
            });
      });

      it('it should not POST a holding without an valid account Id', (done) => {
          let holding = {
            security: 'VOO',
            costBasis: 289.99,
            quantity: 1.23,
            accountId: '12345'
          }
        chai.request(server)
            .post('/api/holdings')
            .set('Authorization', testENV.token)
            .send(holding)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('save').eql('Error adding holding.');
                  Holding
                    .find({})
                    .then(holdings => {
                        assert.equal(Object.keys(holdings).length, 0);
                        done();
                    })
            });
      });

});