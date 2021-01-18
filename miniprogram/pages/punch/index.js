// pages/punch/index.js
import { formatDate } from "../../utils/formatDate";
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
    fetch({
      name: "punch",
      data: this.data.punch,
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
