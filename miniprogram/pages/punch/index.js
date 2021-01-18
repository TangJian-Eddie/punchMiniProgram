// pages/punch/index.js
import { formatDate } from "../../utils/formatDate";
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
      date: "",
    },
    firstPunch: true,
    timeText: "打卡时间",
  },

  inputChange(e) {
    this.setData({
      "punch.comment": e.detail.value,
    });
  },
  timePick(e) {
    this.setData({
      "punch.date": e.detail.value,
    });
  },
  punch() {
    wx.cloud.callFunction({
      name: "punch",
      data: {
        data: this.data.punch,
      },
      success: (res) => {
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
    if (options.info) {
      const info = JSON.parse(options.info);
      this.setData({
        info,
        "punch.punchGoalId": info._id,
        "punch.date": formatDate(new Date()),
      });
    }
    // 修改打卡
    if (options.punch) {
      const punch = JSON.parse(options.punch);
      this.setData({
        punch,
        firstPunch: false,
      });
    }
    // 补打卡
    if (options.rePunch) {
      this.setData({
        "punch.date": "",
        firstPunch: false,
        timeText: "补打卡时间",
      });
    }
  },
});
