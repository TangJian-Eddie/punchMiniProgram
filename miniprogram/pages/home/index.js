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
  },

  handleAction(e) {
    const { type } = e.detail;
    if (type === "edit") {
      this.handleEdit(e);
    } else if (type === "delete") {
      this.handleDelete(e);
    }
  },
  handleEdit(e) {
    const punchGoal = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: `/pages/punchGoal/index?punchGoal=${punchGoal}`,
    });
  },
  handleDelete(e) {
    const { _id } = e.currentTarget.dataset.item;
    wx.showModal({
      content: "确认删除这个打卡目标",
      success: (result) => {
        if (result.confirm) {
          fetch({
            name: "deletePunchGoal",
            data: { id: _id },
          }).then((res) => {
            if (res.code != 200) {
              app.toast(res.msg);
              return;
            }
            app.toast("删除成功");
            this.getData(app.globalData.userInfo.userId);
          });
        }
      },
    });
  },

  getUserInfo(e) {
    fetch({
      name: "login",
      data: { userInfo: e.detail.userInfo },
    }).then((res) => {
      if (res.code != 200) {
        app.toast(res.msg);
        return;
      }
      wx.setStorageSync("userInfo", res.data);
      this.setData({
        userInfo: res.data,
      });
      this.getData(res.data.userId);
    });
  },

  toCreatePunchGoal() {
    wx.navigateTo({
      url: "/pages/punchGoal/index",
    });
  },

  toDetail(e) {
    const info = JSON.stringify(e.currentTarget.dataset.info);
    wx.navigateTo({
      url: `/pages/detail/index?info=${info}`,
    });
  },
  toPunch(e) {
    const info = JSON.stringify(e.currentTarget.dataset.info);
    wx.navigateTo({
      url: `/pages/punch/index?info=${info}`,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
  },

  getData(userId) {
    fetch({
      name: "getPunchGoal",
      data: { userId },
    }).then((res) => {
      this.setData({
        punchGoalList: res.data.list,
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
  onShow: function () {
    if (app.globalData.userInfo) {
      this.getData(app.globalData.userInfo.userId);
    }
  },

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
