/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function (done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function (err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function () {
    var savedId;


    suite('POST /api/books with title => create book object/expect book object', function () {
      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Test POST /api/books with title'
          })
          .end(function (err, res) {
            savedId = res.body._id;
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.property(res.body, 'comments', 'Books in array should contain comments');
            assert.equal(res.body.title, 'Test POST /api/books with title');
            assert.isArray(res.body.comments, 'comments should be an empty array');
            done();
          });
      });

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, "missing title");
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function () {

      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body);
            assert.property(res.body[0], 'title');
            assert.property(res.body[0], 'commentcount');
            assert.property(res.body[0], 'comments');
            assert.property(res.body[0], '_id');
            assert.isArray(res.body[0].comments, 'comments should be an empty array');

            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function () {

      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/1c4fa7090fa7a3467065da1d')
          // .query({
          //   id: '1c4fa7090fa7a3467065da1d'
          // })
          .end(function (err, res) {
            console.log("RESUTS");
            console.log(res.text);
            assert.equal(res.status, 200);
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get('/api/books/' + savedId)
          // .query({ _id: savedId })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.property(res.body, '_id');
            assert.equal(res.body.title, 'Test POST /api/books with title');
            assert.equal(res.body._id, savedId);
            assert.isArray(res.body.comments, 'comments should be an empty array');

          });
        done();
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function () {

      test('Test POST /api/books/[id] with comment', function (done) {
        var url = '/api/books/5c4f9876ac38f13bf8a80a37'
        chai.request(server)
          .post('/api/books/' + savedId)
          // .set('content-type', 'application/x-www-form-urlencoded')
          .send({
            comment: 'Test comment'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
            assert.property(res.body, 'comments', 'Books in array should contain comments');
            assert.equal(res.body.title, 'Test POST /api/books with title');
            assert.isArray(res.body.comments, 'comments should be an empty array');
            done();
          });
        // done();
      });

    });


  });

});
