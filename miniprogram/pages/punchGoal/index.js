// pages/punchGoal/index.js
import { fetch } from "../../utils/fetch";
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
    fetch({
      name: "punchGoal",
      data,
    }).then((res) => {
      if (res.code != 200) {
        app.toast(res.msg);
        return;
      }
      app.toast(res.msg);
      wx.navigateBack({
        delta: 1,
      });
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
