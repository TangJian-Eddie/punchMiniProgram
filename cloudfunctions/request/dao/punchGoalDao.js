const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection('punchGoal');

class punchGoalDao {
  constructor() {}
  getPunchGoal(id) {
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
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getPunchGoalList(userId) {
    return new Promise((resolve, reject) => {
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
}
module.exports = punchGoalDao;
