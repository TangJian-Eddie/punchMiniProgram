const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punch");
const goalCollection = db.collection("punchGoal");
const _ = db.command;
const createPunch = (data) => {
  collection.add({ data: { ...data } }).then(() => {
    goalCollection
      .doc(data.punchGoalId)
      .update({ data: { count: _.inc(1) } })
      .then((res) => {
        return res;
      });
  });
};
const updatePunch = (data) => {
  const id = data._id;
  delete data._id;
  collection
    .doc(id)
    .set({ data: { ...data } })
    .then((res) => {
      return res;
    });
};
exports.main = async (event, context) => {
  console.log(event);
  if (event.data._id) {
    updatePunch(event.data);
  } else {
    createPunch(event.data);
  }
};
