const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");
const $ = db.command.aggregate;
class punchDao {
  constructor() {}
  createPunch(data) {
    return new Promise((resolve, reject) => {
      collection
        .add({ data: { ...data } })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  updatePunch(id, data) {
    return new Promise((resolve, reject) => {
      collection
        .doc(id)
        .update({ data })
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  deletePunch(id) {
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

  deletePunchByGoal(punchGoalId) {
    return new Promise((resolve, reject) => {
      collection
        .where({ punchGoalId })
        .remove()
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getPunchList(punchGoalId, page, size) {
    return new Promise(async (resolve, reject) => {
      collection
        .where({ punchGoalId })
        .orderBy("date", "desc")
        .skip((page - 1) * size)
        .limit(size)
        .get()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getPunchCount(punchGoalId) {
    return new Promise(async (resolve, reject) => {
      collection
        .where({ punchGoalId })
        .count()
        .then((res) => {
          resolve(res.total);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getPunchListByMonth(userId, year, month) {
    return new Promise((resolve, reject) => {
      collection
        .aggregate()
        .project({
          comment: true,
          date: true,
          punchGoalId: true,
          userId: true,
          punchYear: $.year("$date"),
          punchMonth: $.month("$date"),
          punchDate: $.dayOfMonth("$date"),
        })
        .match({ userId, punchYear: year, punchMonth: month })
        .group({
          _id: "$punchDate",
          list: $.push({
            _id: "$_id",
            comment: "$comment",
            date: "$date",
            punchGoalId: "$punchGoalId",
          }),
        })
        .end()
        .then((res) => {
          resolve(res.list);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getPunchById(id) {
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

  getPunchCountByDate(punchGoalId, date) {
    return new Promise((resolve, reject) => {
      collection
        .where({ punchGoalId, date })
        .count()
        .then((res) => {
          resolve(res.total);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
module.exports = punchDao;
