/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
require('dotenv').config();  // load environment variables

const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});
const db = require("../models/");
const Book = require("../models/book.js");

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      // response will be array of book objects
      // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.aggregate([
        {
          "$project": {
            "_id": 1,
            "title": 1,
            "comments": 1,
            "commentcount": { "$size": "$comments" }
          }
        }
      ]).exec((err, books) => {
        if (err) return res.status(500).send(err)
        // send the list of all books

        res.status(200).send(books);
      });
      // console.log(aggregate);
    })

    .post(function (req, res) {
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      console.log(title);
      if (title === undefined) res.status(200).send('missing title')
      else {
        const newBook = new Book({ title });
        newBook.save(err => {
          if (err) res.status(500).send(err);
          res.status(200).send(newBook);
        });
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany().exec(function (err, delOK) {
        if (err) res.status(500).send(err);
        res.status(200).send('complete delete successful');
      });
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      var bookid = req.params.id;
      console.log(bookid);
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, function (err, docs) {
        console.log("GET");
        console.log(docs);
        if (err) res.status(500).send(err);
        else if (docs == null) res.status(200).send("no book exists");
        else res.status(200).send(docs);
      });

    })

    .post(function (req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
      Book.findByIdAndUpdate(bookid, { $push: { comments: comment } }, { new: true },
        function (err, doc) {
          if (err) {
            res.status(500).send(err);
          } else
            res.status(200).send(doc);
        });

    })

    .delete(function (req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'

      Book.findByIdAndDelete(bookid, function (err, docs) {
        console.log(docs);
        if (err) res.status(500).send(err);
        res.status(200).send('delete successful');
      });
    });

};
