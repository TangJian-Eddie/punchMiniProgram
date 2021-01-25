const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const $ = db.command.aggregate;
const collection = db.collection("punch");

const getPunchByMonth = (data) => {
  const { userId, year, month } = data;
  return new Promise((resolve, reject) => {
    collection
      .aggregate()
      .project({
        comment: true,
        date: true,
        punchGoalId: true,
        userId: true,
        punchYear: $.year("$date"),
        punchMonth: $.month("$date"),
        punchDate: $.dayOfMonth("$date"),
      })
      .match({
        userId,
        punchYear: year,
        punchMonth: month,
      })
      .sort({ date: -1 })
      .end()
      .then((res) => {
        resolve(res.list);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
exports.main = async (event, context) => {
  console.log(event);
  if (
    !["userId", "year", "month"].every((item) => {
      return Object.keys(event.data).indexOf(item) >= 0;
    })
  ) {
    return {
      code: 500,
      msg: "参数错误！",
    };
  }
  try {
    const list = await getPunchByMonth(event.data);
    return {
      code: 200,
      msg: "查询成功",
      data: {
        list,
      },
    };
  } catch (err) {
    return {
      code: 500,
      msg: "服务器错误！",
      err,
    };
  }
};
