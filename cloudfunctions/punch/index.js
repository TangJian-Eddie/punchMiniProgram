const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");
const goalCollection = db.collection("punchGoal");
const _ = db.command;
const createPunch = async (data) => {
  let isLimit = await checkLimit(data.date, data.punchGoalId);
  if (!isLimit) {
    return {
      code: 403,
      message: "今天打卡次数达到限制，请勿重复打卡",
      result: null,
    };
  }
  try {
    await collection.add({ data: { ...data } });
    return goalCollection
      .doc(data.punchGoalId)
      .update({ data: { count: _.inc(1) } })
      .then((res) => {
        return {
          code: 200,
          message: "新增打卡成功",
          result: res,
        };
      })
      .catch((err) => {
        return {
          code: 500,
          message: "打卡天数增加失败",
          result: err,
        };
      });
  } catch (err) {
    return {
      code: 500,
      message: "新增打卡失败",
      result: err,
    };
  }
};
const updatePunch = async (data) => {
  let res = await checkLimit(data.date, data.punchGoalId, data._id);
  if (!res) {
    return {
      code: 403,
      message: "今天打卡次数达到限制，请勿重复打卡",
      result: null,
    };
  }
  const id = data._id;
  delete data._id;
  await collection.doc(id).set({ data: { ...data } });
  return {
    code: 200,
    message: "修改打卡成功",
    result: res,
  };
};
const checkLimit = (date, punchGoalId, id) => {
  return new Promise(async (resolve, reject) => {
    if(id){
      let dateRes = await collection.doc(id).field({ date: true }).get();
      if(dateRes.data.date===date) resolve(true)
    }
    goalCollection
      .doc(punchGoalId)
      .field({ punchTimes: true })
      .get()
      .then((res) => {
        collection
          .where({ date })
          .count()
          .then((res2) => {
            if (res.data.punchTimes < res2.total) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
      });
  });
};
exports.main = (event, context) => {
  console.log(event);
  let res;
  if (event.data._id) {
    res = updatePunch(event.data);
  } else {
    res = createPunch(event.data);
  }
  return res;
};
