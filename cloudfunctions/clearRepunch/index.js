const cloud = require("wx-server-sdk");
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const collection = db.collection("users");
const _ = db.command;

const clearRepunch = () => {
  return new Promise((resolve, reject) => {
    collection
      .where({ rePunch: _.neq(0) })
      .update({ data: { rePunch: 0 } })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.main = async () => {
  try {
    const res = await clearRepunch();
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
