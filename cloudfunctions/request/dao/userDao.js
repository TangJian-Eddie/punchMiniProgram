const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("user");
const _ = db.command;

class userDao {
  constructor() {}
  login(userID, userInfo) {
    return new Promise((resolve, reject) => {
      collection
        .doc(userID)
        .set({ data: userInfo })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  checkRepunchLimit(userId) {
    return new Promise(async (resolve, reject) => {
      collection
        .doc(userId)
        .field({ rePunch: true })
        .get()
        .then((res) => {
          if (res.data.rePunch < 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  increaseRepunch(userId) {
    return new Promise(async (resolve, reject) => {
      collection
        .doc(userId)
        .update({ data: { rePunch: _.inc(1) } })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
module.exports = userDao;
