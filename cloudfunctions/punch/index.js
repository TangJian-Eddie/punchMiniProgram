const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");
const goalCollection = db.collection("punchGoal");
const userCollection = db.collection("users");
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

const checkRepunchLimit = (userId) => {
  return new Promise(async (resolve, reject) => {
    userCollection
      .doc(userId)
      .field({ rePunch: true })
      .get()
      .then((res) => {
        if (res.data.rePunch < 1) {
          userCollection
            .doc(userId)
            .update({ data: { rePunch: ++res.data.rePunch } });
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const checkLimit = (data) => {
  const { date, punchGoalId, _id = null } = data;
  return new Promise(async (resolve, reject) => {
    if (_id) {
      let dateRes = await collection.doc(_id).field({ date: true }).get();
      if (String(dateRes.data.date).slice(0, 10) === String(date).slice(0, 10))
        resolve(true);
    }
    goalCollection
      .doc(punchGoalId)
      .field({ punchTimes: true })
      .get()
      .then((punchTimesRes) => {
        collection
          .where({ date, punchGoalId })
          .count()
          .then((res) => {
            if (punchTimesRes.data.punchTimes > res.total) {
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
    !["date", "punchGoalId"].every(
      (item) =>
        event.data[item] !== "" &&
        event.data[item] !== null &&
        event.data[item] !== undefined
    )
  ) {
    return { code: 500, msg: "参数错误！" };
  }
  event.data.date = new Date(event.data.date);
  event.data.userId = cloud.getWXContext().OPENID;
  try {
    if (event.data.rePunch) {
      const res = await checkRepunchLimit(event.data.userId);
      if (!res) {
        return {
          code: 403,
          msg: "一天只可以补打卡一次，今天已达到限制",
        };
      }
    }
    const res = await checkLimit(event.data);
    if (!res) {
      return {
        code: 403,
        msg: "当天此打卡目标打卡次数已达到，请勿重复打卡",
      };
    }
    if (event.data._id) {
      await updatePunch(event.data);
      return { code: 200, msg: "修改成功" };
    } else {
      await createPunch(event.data);
      return { code: 200, msg: "新增成功" };
    }
  } catch (err) {
    return { code: 500, msg: "服务器错误！", err };
  }
};
