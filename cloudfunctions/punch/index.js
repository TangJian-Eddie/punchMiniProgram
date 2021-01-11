const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");
const goalCollection = db.collection("punchGoal");
const _ = db.command
exports.main = async (event, context) => {
  console.log(event);
  collection.add({ data: { ...event.data } }).then((res) => {
    goalCollection.doc(event.data.punchGoalId).update({
      data: {
        count: _.inc(1),
      },
      success: function (res) {
        return res;
      },
    });
  });
};
