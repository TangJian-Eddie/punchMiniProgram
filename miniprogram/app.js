//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: "eddie-7gd5wyqw65fac4df",
        traceUser: true,
      });
    }
    const userInfo = wx.getStorageSync("userInfo");
    this.globalData = {
      userInfo,
    };
  },
  toast(title) {
    wx.showToast({
      title,
      icon: "none",
    });
  },
});
