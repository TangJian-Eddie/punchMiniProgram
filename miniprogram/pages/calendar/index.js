// pages/calendar/index.js
const app = getApp();
import { fetch } from "../../utils/fetch";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    date: new Date().getDate(),
  },

  afterTapDate(e) {
    console.log("afterTapDate", e.detail); // => { year: 2019, month: 12, date: 3, ...}
    const { year, month, date } = e.detail;
    this.setData({
      year,
      month,
      date,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData(
      {
        userId: app.globalData.userInfo.userId,
      },
      () => {
        this.getData();
      }
    );
  },

  getData(id) {
    if (!app.globalData.userInfo) {
      app.toast("请返回首页登陆");
      return;
    }
    const { userId, year, month } = this.data;
    fetch({
      name: "getPunchByMonth",
      data: {
        userId,
        year,
        month,
      },
    }).then((res) => {
      this.setData({
        [`punchList${year}${month}`]: res.data.list,
      });
    });
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
