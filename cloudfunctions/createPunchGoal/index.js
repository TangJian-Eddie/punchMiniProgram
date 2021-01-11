const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punchGoal");

exports.main = async (event, context) => {
  console.log(event);
  let res = await collection.add({ data: { ...event.data, count: 0 } });
  return res;
};
