export function fetch(params) {
  return new Promise((resolve, reject) => {
    const { url, queryString = null, data } = params;
    const method = params.method.toUpperCase();
    wx.cloud.callFunction({
      name: "request",
      data: { $url: url, method, queryString, data },
      success: (res) => {
        resolve(res.result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
