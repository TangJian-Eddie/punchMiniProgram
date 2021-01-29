// pages/punch/index.js
import { fetch } from "../../utils/fetch";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    punch: {
      punchGoalId: "",
      comment: "",
      date: null,
    },
    todayPunch: true,
    timeText: "打卡时间",
  },

  inputChange(e) {
    this.setData({ "punch.comment": e.detail.value });
  },
  timePick(e) {
    this.setData({ "punch.date": e.detail.value });
  },
  punch() {
    fetch({
      name: "punch",
      data: this.data.punch,
    }).then((res) => {
      app.toast(res.msg);
      if (res.code != 200) return;
      wx.navigateBack();
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const info = JSON.parse(options.info);
    this.data.punch.punchGoalId = info._id;
    this.data.punch.date = new Date();
    this.setData({ info });
    // 修改打卡
    if (options.punch) {
      const punch = JSON.parse(options.punch);
      this.setData({ punch, todayPunch: false });
    }
    // 补打卡
    if (options.rePunch) {
      this.data.punch.date = null;
      this.setData({ todayPunch: false, timeText: "补打卡时间" });
    }
  },
});
