// pages/punch/index.js
import { fetch } from "../../utils/fetch";
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
      date: null,
    },
    todayPunch: true,
    punchBeforeDate: null,
    pickerEnd: '',
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
      if (res.code !== 200) return;
      app.event.emit("punchChange", {
        punch: this.data.punch,
        punchBeforeDate: this.data.punchBeforeDate,
        /* type 
                   1 新增打卡
                   2 修改打卡
                   3 删除打卡 */
        type: this.data.punch._id ? 2 : 1,
      });
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
    this.setData({ info, pickerEnd: formatDate(new Date()) });
    // 修改打卡
    if (options.punch) {
      const punch = JSON.parse(options.punch);
      this.data.punchBeforeDate = punch.date;
      this.setData({ punch, todayPunch: false });
    }
    // 补打卡
    if (options.rePunch) {
      this.data.punch.date = null;
      this.setData({ todayPunch: false });
    }
  },
});
