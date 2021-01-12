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
      name: "createPunchGoal",
      data: {
        data,
      },
      success: (res) => {
        console.log(res);
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
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
