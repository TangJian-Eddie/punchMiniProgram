const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punchGoal");
const _ = db.command;

class punchGoalDao {
  constructor() {}
  createPunchGoal(data) {
    return new Promise((resolve, reject) => {
      collection
        .add({ data })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  updatePunchGoal(id, data) {
    return new Promise((resolve, reject) => {
      collection
        .doc(id)
        .update({ data })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  deletePunchGoal(id) {
    return new Promise((resolve, reject) => {
      collection
        .doc(id)
        .remove()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  increaseCount(id) {
    return new Promise((resolve, reject) => {
      collection
        .doc(id)
        .update({ data: { count: _.inc(1) } })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  decreaseCount(id) {
    return new Promise((resolve, reject) => {
      collection
        .doc(id)
        .update({ data: { count: _.inc(-1) } })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getPunchGoalList(userId) {
    return new Promise(async (resolve, reject) => {
      collection
        .where({ userId })
        .get()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getPunchGoalById(id) {
    return new Promise((resolve, reject) => {
      collection
        .doc(id)
        .get()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
module.exports = punchGoalDao;
