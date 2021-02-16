// pages/calendar/index.js
const app = getApp();
import { fetch } from "../../utils/fetch";
import { formatDate } from "../../utils/formatDate";
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
        break;
      }
    }
  },
  afterTapDate(e) {
    console.log("afterTapDate", e.detail); // => { year: 2019, month: 12, date: 3, ...}
    const { year, month, date, todoText } = e.detail;
    const todayPunch = [];
    for (const item of todoText) {
      const punchGoal = this.data.punchGoalList.find(
        (punchGoalItem) => punchGoalItem._id === item.punchGoalId
      );
      punchGoal.comment = item.comment;
      punchGoal.punchId = item._id;
      todayPunch.push(punchGoal);
    }
    this.setData({ selectDate: { year, month, date }, todayPunch });
  },

  whenChangeMonth(e) {
    console.log("whenChangeMonth", e.detail); // => { current: { month: 3, ... }, next: { month: 4, ... }}
    const { year, month } = e.detail.next;
    this.data.currentMonth = { year, month };
    this.data.punchList[`punchList-${year}-${month}`]
      ? this.setTodos(this.data.punchList[`punchList-${year}-${month}`])
      : this.getData(year, month);
  },

  setTodos(punchList) {
    const dates = [];
    for (const item of punchList) {
      if (item.list && item.list.length !== 0) {
        dates.push({
          year: this.data.currentMonth.year,
          month: this.data.currentMonth.month,
          date: item._id,
          todoText: item.list,
        });
      }
    }
    const calendar = this.selectComponent("#calendar").calendar;
    calendar.clearTodos();
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
      this.data.punchGoalList[index] = punchGoal;
      const todayPunch = this.data.todayPunch.map((item) =>
        item._id === punchGoal._id ? { ...item, ...punchGoal } : item
      );
      this.setData({ todayPunch });
    }
    if (type === 3) {
      for (const key in this.data.punchList) {
        for (const issue of this.data.punchList[key]) {
          issue.list = issue.list.filter(
            (item) => item.punchGoalId !== punchGoal._id
          );
        }
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
      const todayPunch = this.data.todayPunch.filter(
        (item) => item._id !== punchGoal._id
      );
      this.setData({ todayPunch });
    }
  },

  punchChange(e) {
    const { type, punch } = e;
    const punchDate = formatDate(punch.date);
    const punchBeforeDate = formatDate(e.punchBeforeDate);
    const year = Number(punchDate.slice(0, 4));
    const month = Number(punchDate.slice(5, 7));
    const date = Number(punchDate.slice(8, 10));
    if (type === 1 && this.data.punchList[`punchList-${year}-${month}`]) {
      this.getData(year, month);
      if (this.isSelectDate(year, month, date)) {
        this.unshiftTodayPunch(punch);
      }
    }
    if (type === 2) {
      const beforeYear = Number(punchBeforeDate.slice(0, 4));
      const beforeMonth = Number(punchBeforeDate.slice(5, 7));
      const beforeDate = Number(punchBeforeDate.slice(8, 10));
      if (beforeYear === year && beforeMonth === month) {
        if (this.data.punchList[`punchList-${year}-${month}`]) {
          if (beforeDate === date) {
            for (let issue of this.data.punchList[
              `punchList-${year}-${month}`
            ]) {
              if (issue._id === date) {
                const index = issue.list.findIndex(
                  (item) => item._id === punch._id
                );
                issue.list[index] = punch;
                break;
              }
            }
          } else {
            this.splicePunchList(
              this.data.punchList[`punchList-${year}-${month}`],
              beforeDate,
              punch._id,
              true,
              date
            );
          }
          if (this.isCurMonth(year, month)) {
            this.setTodos(this.data.punchList[`punchList-${year}-${month}`]);
          }
        }
      } else {
        if (this.data.punchList[`punchList-${beforeYear}-${beforeMonth}`]) {
          this.splicePunchList(
            this.data.punchList[`punchList-${beforeYear}-${beforeMonth}`],
            beforeDate,
            punch._id
          );
          if (this.isCurMonth(beforeYear, beforeMonth)) {
            this.setTodos(
              this.data.punchList[`punchList-${beforeYear}-${beforeMonth}`]
            );
          }
        }
        if (this.data.punchList[`punchList-${year}-${month}`]) {
          punch.punchYear = year;
          punch.punchMonth = month;
          punch.punchDate = date;
          const index = this.data.punchList[
            `punchList-${year}-${month}`
          ].findIndex((item) => item._id === punch.punchDate);
          if (index === -1) {
            this.data.punchList[`punchList-${year}-${month}`].push({
              _id: punch.punchDate,
              list: [punch],
            });
          } else {
            this.data.punchList[`punchList-${year}-${month}`][index].list.push(
              punch
            );
          }
          if (this.isCurMonth(year, month)) {
            this.setTodos(this.data.punchList[`punchList-${year}-${month}`]);
          }
        }
      }
      if (this.isSelectDate(beforeYear, beforeMonth, beforeDate)) {
        this.spliceTodayPunch(punch._id);
      }
      if (this.isSelectDate(year, month, date)) {
        this.unshiftTodayPunch(punch);
      }
    }
    if (type === 3 && this.data.punchList[`punchList-${year}-${month}`]) {
      this.splicePunchList(
        this.data.punchList[`punchList-${year}-${month}`],
        date,
        punch._id
      );
      if (this.isCurMonth(year, month)) {
        this.setTodos(this.data.punchList[`punchList-${year}-${month}`]);
      }
      if (this.isSelectDate(year, month, date)) {
        this.spliceTodayPunch(punch._id);
      }
    }
  },

  isSelectDate(year, month, date) {
    return (
      year === this.data.selectDate.year &&
      month === this.data.selectDate.month &&
      date === this.data.selectDate.date
    );
  },
  isCurMonth(year, month) {
    return (
      year === this.data.currentMonth.year &&
      month === this.data.currentMonth.month
    );
  },
  splicePunchList(punchList, date, id, isPush = false, pushDate) {
    for (const issue of punchList) {
      if (issue._id === date) {
        const index = issue.list.findIndex((item) => item._id === id);
        issue.list.splice(index, 1);
        if (!isPush) break;
      }
      if (isPush && issue._id === pushDate) {
        issue.list.push(punch);
      }
    }
  },
  spliceTodayPunch(id) {
    const { todayPunch } = this.data;
    const index = todayPunch.findIndex((item) => item.id === id);
    todayPunch.splice(index, 1);
    this.setData({ todayPunch });
  },
  unshiftTodayPunch(punch) {
    const { todayPunch } = this.data;
    let punchGoal = this.data.punchGoalList.find(
      (item) => item._id === punch.punchGoalId
    );
    punchGoal.comment = punch.comment;
    punchGoal.punchId = punch._id;
    todayPunch.unshift(punchGoal);
    this.setData({ todayPunch });
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
  onReady: function () {
    setTimeout(() => {
      this.jumpToday();
    }, 500);
  },

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
