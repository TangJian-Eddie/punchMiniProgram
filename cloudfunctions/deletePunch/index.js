const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");
const goalCollection = db.collection("punchGoal");
const _ = db.command;

const deletePunch = (id, punchGoalId) => {
  return new Promise((resolve, reject) => {
    collection
      .doc(id)
      .remove()
      .then(() => {
        goalCollection
          .doc(punchGoalId)
          .update({ data: { count: _.inc(-1) } })
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

exports.main = async (event, context) => {
  console.log(event);
  if (!event.data.id || !event.data.punchGoalId) {
    return { code: 400, msg: "参数错误！" };
  }
  try {
    await deletePunch(event.data.id, event.data.punchGoalId);
    return { code: 200, msg: "删除成功" };
  } catch (err) {
    return { code: 500, msg: "服务器错误！", err };
  }
};
