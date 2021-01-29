const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punchGoal");

const getPunchGoalList = (data) => {
  const { userId } = data;
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
};
exports.main = async (event, context) => {
  console.log(event);
  if (!event.data.userId) {
    return { code: 500, msg: "参数错误！" };
  }
  try {
    const list = await getPunchGoalList(event.data);
    return { code: 200, msg: "查询成功", data: { list } };
  } catch (err) {
    return { code: 500, msg: "服务器错误！", err };
  }
};
