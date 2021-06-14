require('dotenv').config();

const Datastore = require('nedb');
const db = new Datastore({
  filename: process.env.DB_FILE || './db/database.nedb',
  autoload: true,
});

class Database {
  async set(payload) {
    await new Promise((resolve, reject) => {
      db.remove({}, { multi: true }, (err, n) => {
        if (err) {
          reject(reject);
        }
        resolve(n);
      });
    });

    db.insert(payload);

    return new Promise((resolve, reject) => {
      db.insert(payload, (err, doc) => {
        if (err) {
          reject(err);
        }
        resolve(doc);
      });
    });
  }

  get() {
    return new Promise((resolve, reject) => {
      db.find({}, (err, docs) => {
        if (err) {
          reject(err);
        }
        resolve(docs.length > 0 ? docs[0] : undefined);
      });
    });
  }
}

module.exports = Database;
