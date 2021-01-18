// pages/punchGoal/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: app.globalData.userInfo.userId,
    goal: {
      iconName: "",
      goalName: "",
      startTime: "",
      endTime: "",
      punchTimes: 1,
    },
  },
  chooseImage(e) {
    const { name } = e.currentTarget.dataset;
    this.setData({
      "goal.iconName": name,
    });
  },
  inputChange(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      [`goal.${type}`]: e.detail.value,
    });
  },
  timePick(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      [`goal.${type}`]: e.detail.value,
    });
  },
  createPunchGoal() {
    const { goal } = this.data;
    if (
      Object.keys(goal).some((value) => {
        return goal[value] === "";
      })
    ) {
      app.toast("有未填写完成的信息");
      return;
    }
    const data = {
      userId: this.data.userId,
      ...goal,
      date: new Date(),
    };
    wx.cloud.callFunction({
      name: "punchGoal",
      data: {
        data,
      },
      success: (res) => {
        console.log(res);
        if (res.result.code != 200) {
          app.toast(res.result.msg);
          return;
        }
        wx.navigateBack({
          delta: 1,
        });
      },
      fail: (res) => {
        console.log("创建失败", res);
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.punchGoal) {
      const punchGoal = JSON.parse(options.punchGoal);
      this.setData({
        goal: punchGoal,
      });
    }
  },
});
