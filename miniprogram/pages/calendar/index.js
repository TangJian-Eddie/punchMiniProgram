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
    showTodoLabel: false,
    todayPunch: [],
    punchGoalList: [],
  },

  afterTapDate(e) {
    console.log("afterTapDate", e.detail); // => { year: 2019, month: 12, date: 3, ...}
    const { year, month, date, showTodoLabel = false, todoText } = e.detail;
    const todayPunch = [];
    if (showTodoLabel) {
      let punchGoal = this.data.punchGoalList.find((item) => {
        return item._id == todoText.punchGoalId;
      });
      punchGoal.comment = todoText.comment;
      todayPunch.push(punchGoal);
    }
    this.setData({
      year,
      month,
      date,
      showTodoLabel,
      todayPunch,
    });
  },

  whenChangeMonth(e) {
    console.log("whenChangeMonth", e.detail); // => { current: { month: 3, ... }, next: { month: 4, ... }}
    const { year, month } = e.detail.next;
    if (!this.data[`punchList-${year}-${month}`]) {
      this.getData(year, month);
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (!app.globalData.userInfo) return;
    this.setData(
      {
        userId: app.globalData.userInfo.userId,
      },
      () => {
        this.getData(this.data.year, this.data.month);
        this.getGoalData();
      }
    );
  },

  getGoalData() {
    const { userId } = this.data;
    fetch({
      name: "getPunchGoal",
      data: { userId },
    }).then((res) => {
      this.setData({
        punchGoalList: res.data.list,
      });
    });
  },

  getData(year, month) {
    if (!app.globalData.userInfo) {
      app.toast("请返回首页登陆");
      return;
    }
    const { userId } = this.data;
    fetch({
      name: "getPunchByMonth",
      data: {
        userId,
        year,
        month,
      },
    }).then((res) => {
      let dates = [];
      for (let item of res.data.list) {
        dates.push({
          year: item.punchYear,
          month: item.punchMonth,
          date: item.punchDate,
          todoText: { comment: item.comment, punchGoalId: item.punchGoalId },
        });
      }
      console.log(dates);
      this.setData({
        [`punchList-${year}-${month}`]: res.data.list,
      });
      const calendar = this.selectComponent("#calendar").calendar;
      calendar.setTodos({ dates });
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
