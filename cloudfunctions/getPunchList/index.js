const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");

exports.main = async (event, context) => {
  console.log(event);
  const { punchGoalId, page, pageSize } = event.data;
  const total = (await collection.where({ punchGoalId }).count()).total;
  const list = (
    await collection
      .where({ punchGoalId })
      .orderBy("date", "desc")
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
  ).data;
  return {
    list: list,
    total: total,
  };
};
