const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");
const goalCollection = db.collection("punchGoal");
const _ = db.command;

const createPunch = (data) => {
  return new Promise((resolve, reject) => {
    collection
      .add({ data: { ...data } })
      .then(() => {
        goalCollection
          .doc(data.punchGoalId)
          .update({ data: { count: _.inc(1) } })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const updatePunch = (data) => {
  const id = data._id;
  delete data._id;
  return new Promise((resolve, reject) => {
    collection
      .doc(id)
      .update({ data: { ...data } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const checkLimit = (data) => {
  const { date, punchGoalId, id = null } = data;
  return new Promise(async (resolve, reject) => {
    if (id) {
      let dateRes = await collection.doc(id).field({ date: true }).get();
      if (dateRes.data.date === date) resolve(true);
    }
    goalCollection
      .doc(punchGoalId)
      .field({ punchTimes: true })
      .get()
      .then((punchTimesRes) => {
        collection
          .where({ date })
          .count()
          .then((res) => {
            if (punchTimesRes.data.punchTimes < res.total) {
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};
exports.main = async (event, context) => {
  console.log(event);
  if (
    !["comment", "date", "punchGoalId"].every((item) => {
      return Object.keys(event.data).indexOf(item) >= 0;
    })
  ) {
    return {
      code: 500,
      msg: "参数错误！",
    };
  }
  try {
    let res = await checkLimit(event.data);
    if (!res) {
      return {
        code: 403,
        message: "今天打卡次数达到限制，请勿重复打卡",
        result: null,
      };
    }
    if (event.data._id) {
      await updatePunch(event.data);
      return {
        code: 200,
        msg: "修改成功",
      };
    } else {
      await createPunch(event.data);
      return {
        code: 200,
        msg: "新增成功",
      };
    }
  } catch (err) {
    return {
      code: 500,
      msg: "服务器错误！",
      err,
    };
  }
};
