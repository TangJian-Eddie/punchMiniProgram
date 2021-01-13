const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punchGoal");
const createPunchGoal = (data) => {
  collection.add({ data: { ...data, count: 0 } }).then((res) => {
    return res;
  });
};
const updatePunchGoal = (data) => {
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
    updatePunchGoal(event.data);
  } else {
    createPunchGoal(event.data);
  }
};
