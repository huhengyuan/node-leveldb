const { Level } = require('level')
const path = require('path')
const log = path.resolve(__dirname, './log')
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'leveldb' },
  transports: [
    new winston.transports.File({ filename: log + '/error.log', level: 'error' }),
    new winston.transports.File({ filename: log + '/leveldb.log' }),
  ],
});


class LevelDB {
  constructor(path) {
    this.db =new Level(path, { valueEncoding: 'json' });
  }

  async put(key, value) {
    return new Promise((resolve, reject) => {
      this.db.put(key, value, (err) => {
        if (err) {
          logger.error('Error writing value to LevelDB', { error: err });
          reject(err);
        } else {
          logger.info('Value written to LevelDB', { key: key, value: value });
          resolve("OK");
        }
      });
    });
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.db.get(key, (err, value) => {
        if (err) {
          logger.error('Error reading value from LevelDB', { error: err });
          reject(err);
        } else {
          logger.info('Value read from LevelDB', { key: key, value: value });
          resolve(value);
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      this.db.del(key, (err) => {
        if (err) {
          logger.error('Error deleting value from LevelDB', { error: err });
          reject(err);
        } else {
          logger.info('Value deleted from LevelDB', { key: 'key', value: value });
          resolve('ok');
        }
      });
    });
  }

  async getAllData() {
    try {
        let data = []
        for await (const [key, value] of this.db.iterator()) {
            // console.log(value);
            data.push([key, value])
        }
        return {code: 1, message: "获取数据成功！", data: data}
    } catch (error) {
        return {code: -1, message:"该数据不存在，请校验key！" + error}
    }
    // return  new Promise((resolve, reject) => {
    //   const stream = this.db.createReadStream();

    //   stream.on('data', (chunk) => {
    //     data.push(chunk);
    //   });

    //   stream.on('error', (err) => {
    //     reject(err);
    //   });

    //   stream.on('end', () => {
    //     resolve(data);
    //   });
    // });
  }

  async close() {
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

module.exports = LevelDB;
