'use strict'

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

let db;

module.exports = {
  connectToServer: async (callback) => {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
        db = client.db('admin');
        return callback(err);
    });
  },
  getDb: () => {
    return db;
  }
};