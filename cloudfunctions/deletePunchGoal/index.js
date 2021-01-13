const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");
const goalCollection = db.collection("punchGoal");
exports.main = async (event, context) => {
  console.log(event);
  collection
    .where({ punchGoalId: event.id })
    .remove()
    .then(() => {
      goalCollection
        .doc(event.id)
        .remove()
        .then((res) => {
          return res;
        });
    });
};
