const levelup = require('levelup');
const leveldown = require('leveldown');

class MyDB {
  constructor(dbPath) {
    this.db = levelup( leveldown(dbPath) );
  }

  put(key, value) {
    return new Promise((resolve, reject) => {
      this.db.put(key, value, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve({code: 1, masaage: "success"});
        }
      });
    });
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.db.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  del(key) {
    return new Promise((resolve, reject) => {
      this.db.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  batch(ops) {
    return new Promise((resolve, reject) => {
      this.db.batch(ops, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = MyDB;
