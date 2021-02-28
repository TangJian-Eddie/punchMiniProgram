// pages/home/index.js
const app = getApp();
import { fetch } from "../../utils/fetch";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    punchGoalList: [],
    slideButtons: [
      {
        text: "修改",
        data: 'edit'
      },
      {
        type: "warn",
        data: 'delete',
        text: "删除",
      },
    ],
  },

  handleAction(e) {
    console.log(e)
    const { data } = e.detail;
    if (data === "edit") {
      this.handleEdit(e);
    } else if (data === "delete") {
      this.handleDelete(e);
    }
  },
  handleEdit(e) {
    const punchGoal = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({ url: `/pages/punchGoal/index?punchGoal=${punchGoal}` });
  },
  handleDelete(e) {
    const { item, index } = e.currentTarget.dataset;
    wx.showModal({
      content: "确认删除这个打卡目标",
      success: (result) => {
        if (result.confirm) {
          wx.showLoading({ mask: true });
          fetch({
            url: "punchgoals",
            method: "DELETE",
            data: { id: item._id },
          }).then((res) => {
            wx.hideLoading();
            app.toast(res.msg);
            if (res.code !== 200) return;
            const { punchGoalList } = this.data;
            punchGoalList.splice(index, 1);
            this.setData({ punchGoalList });
            app.event.emit("punchGoalChange", {
              punchGoal: item,
              /* type 
                   1 新增打卡目标
                   2 修改打卡目标
                   3 删除打卡目标 */
              type: 3,
            });
          });
        }
      },
    });
  },

  getUserInfo(e) {
    fetch({
      url: "login",
      method: "POST",
      data: { userInfo: e.detail.userInfo },
    }).then((res) => {
      app.toast(res.msg);
      if (res.code !== 200) return;
      wx.setStorageSync("userInfo", res.data);
      app.globalData.userInfo = res.dataÏ;
      app.event.emit("login");
      this.setData({ userInfo: res.data });
      this.getData(res.data.userId);
    });
  },
  toCreatePunchGoal() {
    wx.navigateTo({ url: "/pages/punchGoal/icon/index" });
  },
  toDetail(e) {
    const info = JSON.stringify(e.currentTarget.dataset.info);
    wx.navigateTo({ url: `/pages/detail/index?info=${info}` });
  },
  toPunch(e) {
    if (e.currentTarget.dataset.info.isEnd) {
      app.toast("打卡目标已经结束~");
      return;
    }
    const info = JSON.stringify(e.currentTarget.dataset.info);
    wx.navigateTo({ url: `/pages/punch/index?info=${info}` });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.event.on("punchGoalChange", this.punchGoalChange, this);
    app.event.on("punchChange", this.punchChange, this);
    if (app.globalData.userInfo) {
      this.setData({ userInfo: app.globalData.userInfo });
      this.getData(app.globalData.userInfo.userId);
    }
  },

  punchGoalChange(e) {
    const { type, punchGoal } = e;
    const { punchGoalList } = this.data;
    if (type === 1) {
      this.getData(this.data.userInfo.userId);
      return;
    }
    if (type === 2) {
      const index = punchGoalList.findIndex(
        (item) => item._id === punchGoal._id
      );
      this.setData({ [`punchGoalList[${index}]`]: punchGoal });
    }
  },

  punchChange(e) {
    const { type, punch } = e;
    const { punchGoalList } = this.data;
    if (type === 2) return;
    const index = punchGoalList.findIndex(
      (item) => item._id === punch.punchGoalId
    );
    let count;
    if (type === 1) {
      count = ++punchGoalList[index].count;
    } else if (type === 3) {
      count = --punchGoalList[index].count;
    }
    this.setData({
      [`punchGoalList[${index}].count`]: count,
    });
  },
  getData(userId) {
    fetch({
      url: "punchgoals",
      method: "GET",
      data: { userId },
    }).then((res) => {
      for (const item of res.data.list) {
        if (item.endTime && new Date(item.endTime) < new Date()) {
          item.isEnd = true;
        }
      }
      this.setData({ punchGoalList: res.data.list });
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
