const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");
const goalCollection = db.collection("punchGoal");
const _ = db.command;
exports.main = async (event, context) => {
  console.log(event);
  collection.doc(event.id).remove({
    success: function (res) {
      return res;
    },
  });
};
