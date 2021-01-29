const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("users");

const addUser = (OPENID, userInfo) => {
  return new Promise((resolve, reject) => {
    collection
      .doc(OPENID)
      .set({ data: userInfo })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.main = async (event, context) => {
  const { userInfo } = event.data;
  const { OPENID, APPID, UNIONID } = cloud.getWXContext();
  console.log(event);
  console.log(OPENID, APPID, UNIONID);
  try {
    await addUser(OPENID, userInfo);
    return {
      code: 200,
      msg: "登陆成功",
      data: { userId: OPENID, ...userInfo },
    };
  } catch (err) {
    return { code: 500, msg: "服务器错误！", err };
  }
};
