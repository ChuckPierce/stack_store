'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Product = require('./product.model'),
    Category = require('../category/category.model')

describe('GET /api/products', function() {

  xit('should respond wxith JSON array', function(done) {
    request(app)
      .get('/api/products')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});

var prod;
describe('Product model', function() {
  afterEach(function(done) {
    Product.remove().exec().then(function(){done();});
  })
  it('should require a title', function(done) {
    var product = new Product({
      price: 1,
      description: {blurb: "a", full: "abc"}
    });
    product.save(function(err) {
      should.exist(err);
      done();
    });
  });
  it('should require a price', function(done) {
    var product = new Product({
      name: "a",
      description: {blurb: "a", full: "abc"}
    });
    product.save(function(err) {
      should.exist(err);
      done();
    });
  });
  it('should require a blurb', function(done) {
    var product = new Product({
      name: "a",
      price: 1,
      description: {full: "abc"}
    });
    product.save(function(err) {
      should.exist(err);
      done();
    });
  });
  it('should require a full description', function(done) {
    var product = new Product({
      name: "a",
      price: 1,
      description: {blurb: "a"}
    });
    product.save(function(err) {
      should.exist(err);
      done();
    });
  });
  xit('should require at least one category', function(done) {
    var product = new Product({
      name: "Deal",
      price: 1,
      description: {blurb: "a", full: "abc"}
    });
    product.save(function(err) {
      console.log(err);
        should.exist(err);
        done();
   });
  });
  it('should reject duplicate titles', function(done) {
    var product = new Product({
      name: "Deal",
      price: 1,
      description: {blurb: "a", full: "abc"},
      categories: ['hay']
    });
    product.save(function() {
      var newProduct = new Product({
        name: "Deal",
        price: 9999,
        description: {blurb: "ahhh", full: "abcdefghijklmnop"},
        categories: ['hay']
      });
      newProduct.save(function(err) {
        console.log("errrrrr", err);
        should.exist(err);
        done();
      });
    });
  });
  it('should have a placeholder photo if there is no photo', function() {
    var product = new Product({
      name: "a",
      price: 1,
      description: {blurb: "a", full: "abc"}
    });
    return product.images[0].should.be.instanceof(String);
  });
});