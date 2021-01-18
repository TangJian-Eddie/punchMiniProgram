// pages/home/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    punchGoalList: [],
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
          wx.cloud.callFunction({
            name: "deletePunchGoal",
            data: {
              id: _id,
            },
            success: (res) => {
              if (res.result.code != 200) {
                app.toast(res.result.msg);
                return;
              }
              app.toast("删除成功");
              this.getData(app.globalData.userInfo.userId);
            },
          });
        }
      },
    });
  },

  getUserInfo(e) {
    wx.cloud.callFunction({
      name: "login",
      data: {
        userInfo: e.detail.userInfo,
      },
      success: (res) => {
        console.log(res);
        if (res.result.code != 200) {
          app.toast(res.result.msg);
          return;
        }
        wx.setStorageSync("userInfo", res.result.data);
        this.setData({
          userInfo: res.result.data,
        });
        this.getData(res.result.data.userId);
      },
      fail: (res) => {
        console.log("登录失败", res);
      },
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
    wx.cloud.callFunction({
      name: "getPunchGoal",
      data: {
        data: {
          userId,
        },
      },
      success: (res) => {
        console.log(res);
        this.setData({
          punchGoalList: res.result.data.list,
        });
      },
      fail: (res) => {
        console.log("登录失败", res);
      },
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
