//During the test the env variable is set to test
process.env.ENV = 'TEST';

let mongoose = require("mongoose");
var assert = require('assert');
let User = require('../models/User');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('User', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.deleteMany({}, (err) => { 
           done();           
        });        
    });
  /*
  * Test the /POST route
  */
  describe('/POST api/users/', () => {
    // Test All missing fields.
      it('it should not POST a user without name, email and password field', (done) => {
          let user = {}
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 3);
                  res.body.should.have.property('name').eql('Name field is required');
                  res.body.should.have.property('email').eql('Email field is required');
                  res.body.should.have.property('password').eql('Password field is required');
              done();
            });
      });

    // Test All fields missing one by one.

      it('it should not POST a user without name field', (done) => {
          let user = {
              email: "jdoe@email.com",
              password: "123456"
          }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('name').eql('Name field is required');
              done();
            });
      });
      it('it should not POST a user without email field', (done) => {
          let user = {
              name: "John Doe",
              password: "123456"
          }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('email').eql('Email field is required');
              done();
            });
      });
      it('it should not POST a user without password field', (done) => {
          let user = {
              name: "John Doe",
              email: "jdoe@email.com"
          }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('password').eql('Password field is required');
              done();
            });
      });

      // Test All fields valid one by one.

      it('it should not POST a user without valid name field (more than 2 characters)', (done) => {
          let user = {
              name: "j",
              email: "jdoe@email.com",
              password: "123456"
          }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('name').eql('Name must be between 2 and 30 characters');
              done();
            });
      });
      it('it should not POST a user without valid name field (no more than 30 characters)', (done) => {
          let user = {
              name: "abcdefghijklmnopqrtsuvwxzy12345",
              email: "jdoe@email.com",
              password: "123456"
          }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('name').eql('Name must be between 2 and 30 characters');
              done();
            });
      });
      it('it should not POST a user without valid email field', (done) => {
          let user = {
              email: "jhondoe",
              name: "John Doe",
              password: "123456"
          }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('email').eql('Email is invalid');
              done();
            });
      });
      it('it should not POST a user without password field (Atleast 6 characters)', (done) => {
          let user = {
              password: "12345",
              name: "John Doe",
              email: "jdoe@email.com"
          }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('password').eql('Password must be at least 6 characters');
              done();
            });
      });

      // Test a valid user.
      it('it should create a valid user', (done) => {
          let user = {
              password: "123456",
              name: "John Doe",
              email: "jdoe@email.com"
          }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.html;
                  res.should.have.status(201);
                  res.text.should.eq('User created')
              done();
            });
      });

      // Test a duplicate user.
      it('it should not POST a duplicate user', (done) => {
          let user = {
              password: "123456",
              name: "John Doe",
              email: "jdoe@email.com"
          }
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  chai.request(server)
                      .post('/api/users')
                      .send(user)
                      .end((err, res) => {
                            res.should.be.json;
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            assert.equal(Object.keys(res.body).length, 1);
                            res.body.should.have.property('email').eql('Email already exists');
                          done();
                      });
            });
      });

  });
   /*
  * Test the login  route
  */
  describe('/GET api/users/login', () => {
      // Test All missing fields.
      it('it should not login a user without email and password field', (done) => {
          let user = {}
        chai.request(server)
            .get('/api/users/login')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 2);
                  res.body.should.have.property('email').eql('Email field is required');
                  res.body.should.have.property('password').eql('Password field is required');
              done();
            });
      });

      // Test All missing fields one by one.
      it('it should not login a user without password field', (done) => {
          let user = {password: '123445'}
        chai.request(server)
            .get('/api/users/login')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('email').eql('Email field is required');
              done();
            });
      });

      it('it should not login a user without email field', (done) => {
          let user = {email: 'jdoe@email.com'}
        chai.request(server)
            .get('/api/users/login')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('password').eql('Password field is required');
              done();
            });
      });

      // Test field validations
      it('it should not login a user without valid email', (done) => {
          let user = {
            email: 'jdoe',
            password: '123445'
          }
        chai.request(server)
            .get('/api/users/login')
            .send(user)
            .end((err, res) => {
                  res.should.be.json;
                  res.should.have.status(400);
                  res.body.should.be.a('object');
                  assert.equal(Object.keys(res.body).length, 1);
                  res.body.should.have.property('email').eql('Email is invalid');
              done();
            });
      });

      it('it should not login a user without password match', (done) => {
          let user = {
              password: "123456",
              name: "John Doe",
              email: "jdoe@email.com"
          }
          // Create a user to use.
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.html;
                  res.should.have.status(201);
                  res.text.should.eq('User created')
                  let wrongUser = {
                    email: 'jdoe@email.com',
                    password: "1234456"
                  }
                  chai.request(server)
                      .get('/api/users/login')
                      .send(wrongUser)
                      .end((err, res) => {
                            res.should.be.json;
                            res.should.have.status(400);
                            res.body.should.be.a('object');
                            assert.equal(Object.keys(res.body).length, 1);
                            res.body.should.have.property('password').eql('Password incorrect');
                        done();
                      });
            });
      });

      // Test User Not Found
      it('it should not login if user email not found in DB', (done) => {
          let user = {
              password: "123456",
              name: "John Doe",
              email: "jdoe@email.com"
          }
          // Create a user to use.
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.html;
                  res.should.have.status(201);
                  res.text.should.eq('User created')
                  let wrongUser = {
                    email: 'jdoe1@email.com',
                    password: "123456"
                  }
                  chai.request(server)
                      .get('/api/users/login')
                      .send(wrongUser)
                      .end((err, res) => {
                            res.should.be.json;
                            res.should.have.status(404);
                            res.body.should.be.a('object');
                            assert.equal(Object.keys(res.body).length, 1);
                            res.body.should.have.property('email').eql('User not found');
                        done();
                      });
            });
      });

      // Test Login Success
      it('it should login a valid user', (done) => {
          let user = {
              password: "123456",
              name: "John Doe",
              email: "jdoe@email.com"
          }
          // Create a user to use.
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                  res.should.be.html;
                  res.should.have.status(201);
                  res.text.should.eq('User created')
                  let wrongUser = {
                    email: 'jdoe@email.com',
                    password: "123456"
                  }
                  chai.request(server)
                      .get('/api/users/login')
                      .send(wrongUser)
                      .end((err, res) => {
                            res.should.be.json;
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            assert.equal(Object.keys(res.body).length, 1);
                            res.body.should.have.property('token').include('Bearer');
                        done();
                      });
            });
      });

  });

});

