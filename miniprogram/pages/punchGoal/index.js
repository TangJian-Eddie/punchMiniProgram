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
      comment: "",
      startTime: "",
      endTime: "",
      punchTimes: 1,
    },
    isEndTime: false,
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
  switchChange(e) {
    this.setData({
      isEndTime: e.detail.value,
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
        if (value == "comment" || value == "endTime") return false;
        return goal[value] === "";
      })
    ) {
      app.toast("有未填写完成的信息");
      return;
    }
    const data = goal;
    fetch({
      name: "punchGoal",
      data,
    }).then((res) => {
      app.toast(res.msg);
      if (res.code != 200) {
        return;
      }
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
      if (punchGoal.endTime) {
        this.setData({
          isEndTime: true,
        });
      }
    }
  },
});
