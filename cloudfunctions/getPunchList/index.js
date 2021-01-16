const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");

const getPunchList = (data) => {
  const { punchGoalId, page, pageSize } = data;
  return new Promise(async (resolve, reject) => {
    collection
      .where({ punchGoalId })
      .orderBy("date", "desc")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const getPunchListTotal = (data) => {
  const { punchGoalId } = data;
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
    const total = await getPunchListTotal(event.data);
    const list = await getPunchList(event.data);
    return {
      code: 200,
      msg: "新增成功",
      data: {
        total,
        list,
      },
    };
  } catch (err) {
    return {
      code: 500,
      msg: "服务器错误！",
      err,
    };
  }
};
