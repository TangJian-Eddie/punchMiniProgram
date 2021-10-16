const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection('user');
const _ = db.command;

class userDao {
  constructor() {}
  getUser(userId) {
    return new Promise((resolve, reject) => {
      collection
        .doc(userId)
        .get()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  updateUser(userID, userInfo) {
    return new Promise((resolve, reject) => {
      collection
        .doc(userID)
        .set({ data: userInfo })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getRepunch(userId) {
    return new Promise((resolve, reject) => {
      collection
        .doc(userId)
        .field({ rePunch: true })
        .get()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  increaseRepunch(userId) {
    return new Promise((resolve, reject) => {
      collection
        .doc(userId)
        .update({ data: { rePunch: _.inc(1) } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
module.exports = userDao;
