const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");

exports.main = async (event, context) => {
  console.log(event);
  const { punchGoalId } = event.data;
  let res = await collection.where({ punchGoalId }).get();
  return res;
};
