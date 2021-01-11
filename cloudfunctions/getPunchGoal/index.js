const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punchGoal");

exports.main = async (event, context) => {
  console.log(event);
  const { userId } = event.data;
  let res = await collection.where({ userId }).get();
  return res;
};
