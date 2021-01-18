export function fetch(params) {
  return new Promise((resolve, reject) => {
    const { name, data } = params;
    wx.cloud.callFunction({
      name,
      data: { data },
      success: (res) => {
        resolve(res.result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
