const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("punchGoal");

const createPunchGoal = (data) => {
  return new Promise((resolve, reject) => {
    collection
      .add({ data: { ...data, count: 0 } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const updatePunchGoal = (data) => {
  const id = data._id;
  delete data._id;
  return new Promise((resolve, reject) => {
    collection
      .doc(id)
      .update({ data: { ...data } })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};
exports.main = async (event, context) => {
  console.log(event);
  const params = [
    "goalName",
    "iconName",
    "punchTimes",
    "startTime",
    "endTime",
    "userId",
    "date",
  ];
  if (
    !params.every((item) => {
      return (
        event.data[item] !== "" ||
        event.data[item] !== null ||
        event.data[item] !== undefined
      );
    })
  ) {
    return {
      code: 500,
      msg: "参数错误！",
    };
  }
  const dateList = ["startTime", "endTime", "date"];
  for (let item of dateList) {
    event.data[item] = new Date(event.data[item]);
  }
  try {
    if (event.data._id) {
      await updatePunchGoal(event.data);
      return {
        code: 200,
        msg: "修改成功",
      };
    } else {
      await createPunchGoal(event.data);
      return {
        code: 200,
        msg: "新增成功",
      };
    }
  } catch (err) {
    return {
      code: 500,
      msg: "服务器错误！",
      err,
    };
  }
};
