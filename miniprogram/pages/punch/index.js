// pages/punch/index.js
import { formatDate } from "../../utils/formatDate";
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
  onLoad: function (options) {
    if (options.info) {
      const info = JSON.parse(options.info);
      this.setData({
        info,
        "punch.punchGoalId": info._id,
        "punch.date": formatDate(new Date()),
      });
    }
    if (options.rePunch) {
      console.log("补打卡");
      this.setData({
        "punch.date": "",
      });
    }
  },

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
