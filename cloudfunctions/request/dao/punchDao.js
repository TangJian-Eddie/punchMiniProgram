const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection('punch');
const $ = db.command.aggregate;
class punchDao {
  constructor() {}
  getPunch(id) {
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
  createPunch(data) {
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
  updatePunch(id, data) {
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
  deletePunch(id) {
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
  getPunchList(punchGoalId, page, size) {
    return new Promise((resolve, reject) => {
      collection
        .where({ punchGoalId })
        .orderBy('date', 'desc')
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
  getPunchListByMonth(userId, year, month) {
    console.log(year + '===' + month);
    return new Promise((resolve, reject) => {
      collection
        .aggregate()
        .project({
          comment: true,
          date: true,
          punchGoalId: true,
          userId: true,
          punchYear: $.year('$date'),
          punchMonth: $.month('$date'),
          punchDate: $.dayOfMonth('$date'),
        })
        .match({ userId, punchYear: year, punchMonth: month })
        .group({
          _id: '$punchDate',
          list: $.push({
            _id: '$_id',
            comment: '$comment',
            date: '$date',
            punchGoalId: '$punchGoalId',
          }),
        })
        .limit(100)
        .end()
        .then((res) => {
          console.log(res);
          resolve(res.list);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getPunchCountByCondition(condition) {
    return new Promise((resolve, reject) => {
      collection
        .where(condition)
        .count()
        .then((res) => {
          resolve(res.total);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  getPunchCountByDate(punchGoalId, year, month, date) {
    return new Promise((resolve, reject) => {
      collection
        .aggregate()
        .project({
          punchGoalId: true,
          punchYear: $.year('$date'),
          punchMonth: $.month('$date'),
          punchDate: $.dayOfMonth('$date'),
        })
        .match({
          punchGoalId,
          punchYear: year,
          punchMonth: month,
          punchDate: date,
        })
        .count('punchCount')
        .end()
        .then((res) => {
          resolve(res.list[0].punchCount);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  deletePunchByGoalId(punchGoalId) {
    return new Promise((resolve, reject) => {
      collection
        .where({ punchGoalId })
        .remove()
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
module.exports = punchDao;
