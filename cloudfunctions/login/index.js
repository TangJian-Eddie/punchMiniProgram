const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("users");

const addUser = async (_openid, userInfo) => {
  await collection.doc(_openid).set({ data: userInfo });
  return {
    userId: _openid,
    ...userInfo,
  };
};

exports.main = async (event, context) => {
  console.log(event);
  const { userInfo } = event;
  const { OPENID, APPID, UNIONID } = cloud.getWXContext();
  console.log(OPENID, APPID, UNIONID);
  let res = await addUser(OPENID, userInfo);
  return res;
};
