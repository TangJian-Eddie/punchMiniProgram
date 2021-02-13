// pages/calendar/index.js
const app = getApp();
import { fetch } from "../../utils/fetch";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectDate: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      date: new Date().getDate(),
    },
    currentMonth: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    },
    todayPunch: [],
    punchGoalList: [],
    punchList: {},
    scrollHeight: "",
  },

  jumpToday() {
    const calendar = this.selectComponent("#calendar").calendar;
    calendar.jump();
    this.whenChangeMonth({
      detail: {
        next: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
        },
      },
    });
    for (const item of calendar.getTodos()) {
      if (
        item.year === new Date().getFullYear() &&
        item.month === new Date().getMonth() + 1 &&
        item.date === new Date().getDate()
      ) {
        this.afterTapDate({ detail: item });
        break
      }
    }
  },
  afterTapDate(e) {
    console.log("afterTapDate", e.detail); // => { year: 2019, month: 12, date: 3, ...}
    const { year, month, date, todoText } = e.detail;
    const todayPunch = [];
    if (todoText) {
      let punchGoal = this.data.punchGoalList.find(
        (item) => item._id === todoText.punchGoalId
      );
      punchGoal.comment = todoText.comment;
      todayPunch.push(punchGoal);
    }
    this.setData({ selectDate: { year, month, date }, todayPunch });
  },

  whenChangeMonth(e) {
    console.log("whenChangeMonth", e.detail); // => { current: { month: 3, ... }, next: { month: 4, ... }}
    const { year, month } = e.detail.next;
    this.data.currentMonth = { year, month };
    if (!this.data.punchList[`punchList-${year}-${month}`]) {
      this.getData(year, month);
    } else {
      this.setTodos(this.data.punchList[`punchList-${year}-${month}`]);
    }
  },

  setTodos(punchList) {
    const dates = [];
    for (const item of punchList) {
      dates.push({
        year: item.punchYear,
        month: item.punchMonth,
        date: item.punchDate,
        todoText: { comment: item.comment, punchGoalId: item.punchGoalId },
      });
    }
    const calendar = this.selectComponent("#calendar").calendar;
    calendar.setTodos({ dates });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    app.event.on("punchGoalChange", this.punchGoalChange, this);
    app.event.on("punchChange", this.punchChange, this);
    const { windowHeight, windowWidth } = wx.getSystemInfoSync();
    this.setData({ scrollHeight: windowHeight - (windowWidth / 750) * 810 });
    this.getData(this.data.selectDate.year, this.data.selectDate.month);
    this.getGoalData();
  },

  punchGoalChange(e) {
    const { type, punchGoal } = e;
    if (type === 1) {
      this.getGoalData();
    }
    if (type === 2) {
      const index = this.data.punchGoalList.findIndex(
        (item) => item._id === punchGoal._id
      );
      this.data[`punchGoalList[${index}]`] = punchGoal;
      const { todayPunch } = this.data;
      for (const item of todayPunch) {
        if (item._id === punchGoal._id) {
          item = { ...item, ...punchGoal };
        }
      }
      this.setData({ todayPunch });
    }
    if (type === 3) {
      for (let key in this.data.punchList) {
        this.data.punchList[key] = this.data.punchList[key].filter(
          (item) => item.punchGoalId !== punchGoal._id
        );
      }
      const index = this.data.punchGoalList.findIndex(
        (item) => item._id === punchGoal._id
      );
      this.data.punchGoalList.splice(index, 1);
      this.setTodos(
        this.data.punchList[
          `punchList-${this.data.currentMonth.year}-${this.data.currentMonth.month}`
        ]
      );
      let { todayPunch } = this.data;
      todayPunch = todayPunch.filter((item) => item._id !== punchGoal._id);
      this.setData({ todayPunch });
    }
  },

  punchChange(e) {
    const { type, punch, punchBeforeDate } = e;
    const year = punch.date.slice(0, 4);
    const month = Number(punch.date.slice(5, 7));
    if (type === 1 && this.data.punchList[`punchList-${year}-${month}`]) {
      this.getData(year, month);
      if (Number(punch.date.slice(8, 10)) === this.data.selectDate.date) {
        const { todayPunch } = this.data;
        let punchGoal = this.data.punchGoalList.find(
          (item) => item._id === punch.punchGoalId
        );
        punchGoal.comment = punch.comment;
        todayPunch.unshift(punchGoal);
        this.setData({ todayPunch });
      }
    }
    if (type === 2) {
      const beforeYear = punchBeforeDate.slice(0, 4);
      const beforeMonth = Number(punchBeforeDate.slice(5, 7));
      if (
        beforeYear === year &&
        beforeMonth === month &&
        this.data.punchList[`punchList-${year}-${month}`]
      ) {
        const index = this.data.punchList[
          `punchList-${year}-${month}`
        ].findIndex((item) => item._id === punch._id);
        this.data.punchList[`punchList-${year}-${month}`][index] = punch;
        if (
          year === this.data.currentMonth.year &&
          month === this.data.currentMonth.month
        ) {
          this.setTodos(this.data.punchList[`punchList-${year}-${month}`]);
        }
      } else {
        if (this.data.punchList[`punchList-${beforeYear}-${beforeMonth}`]) {
          const index = this.data.punchList[
            `punchList-${beforeYear}-${beforeMonth}`
          ].findIndex((item) => item._id === punch._id);
          this.data.punchList[`punchList-${beforeYear}-${beforeMonth}`].splice(
            index,
            1
          );
          if (
            beforeYear === this.data.currentMonth.year &&
            beforeMonth === this.data.currentMonth.month
          ) {
            this.setTodos(
              this.data.punchList[`punchList-${beforeYear}-${beforeMonth}`]
            );
          }
        }
        if (this.data.punchList[`punchList-${year}-${month}`]) {
          this.data.punchList[`punchList-${year}-${month}`].push(punch);
          if (
            year === this.data.currentMonth.year &&
            month === this.data.currentMonth.month
          ) {
            this.setTodos(this.data.punchList[`punchList-${year}-${month}`]);
          }
        }
      }
      if (
        Number(punchBeforeDate.date.slice(8, 10)) === this.data.selectDate.date
      ) {
        const { todayPunch } = this.data;
        // 伪删除，逻辑有漏洞，但是展示效果无影响（假如有一个同目标的打卡且comment相同）
        const index = todayPunch.findIndex(
          (item) =>
            item._id === punch.punchGoalId && item.comment === punch.comment
        );
        todayPunch.splice(index, 1);
        this.setData({ todayPunch });
      }
      if (Number(punch.date.slice(8, 10)) === this.data.selectDate.date) {
        const { todayPunch } = this.data;
        let punchGoal = this.data.punchGoalList.find(
          (item) => item._id === punch.punchGoalId
        );
        punchGoal.comment = punch.comment;
        todayPunch.unshift(punchGoal);
        this.setData({ todayPunch });
      }
    }
    if (type === 3 && this.data.punchList[`punchList-${year}-${month}`]) {
      const index = this.data.punchList[`punchList-${year}-${month}`].findIndex(
        (item) => item._id === punch._id
      );
      this.data.punchList[`punchList-${year}-${month}`].splice(index, 1);
      if (
        year === this.data.currentMonth.year &&
        month === this.data.currentMonth.month
      ) {
        this.setTodos(this.data.punchList[`punchList-${year}-${month}`]);
      }
      if (Number(punch.date.slice(8, 10)) === this.data.selectDate.date) {
        const { todayPunch } = this.data;
        // 伪删除，逻辑有漏洞，但是展示效果无影响（假如有一个同目标的打卡且comment相同）
        const index = todayPunch.findIndex(
          (item) =>
            item._id === punch.punchGoalId && item.comment === punch.comment
        );
        todayPunch.splice(index, 1);
        this.setData({ todayPunch });
      }
    }
  },

  getGoalData() {
    if (!app.globalData.userInfo) {
      app.toast("请返回首页登陆");
      return;
    }
    fetch({
      name: "getPunchGoal",
      data: { userId: app.globalData.userInfo.userId },
    }).then((res) => {
      this.setData({ punchGoalList: res.data.list });
    });
  },

  getData(year, month) {
    if (!app.globalData.userInfo) {
      app.toast("请返回首页登陆");
      return;
    }
    fetch({
      name: "getPunchByMonth",
      data: { userId: app.globalData.userInfo.userId, year, month },
    }).then((res) => {
      this.data.punchList[`punchList-${year}-${month}`] = res.data.list;
      this.setTodos(res.data.list);
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
  onUnload: function () {
    app.event.off("punchGoalChange", this.punchGoalChange);
    app.event.off("punchChange", this.punchChange);
  },

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
