// pages/detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    punchList: [],
  },

  rePunch(){
    const info = JSON.stringify(this.data.info);
    wx.navigateTo({
      url: `/pages/punch/index?info=${info}&rePunch=1`,
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
      });
      this.getData(info._id);
    }
  },

  getData(id) {
    const punchGoalId = id;
    wx.cloud.callFunction({
      name: "getPunchList",
      data: {
        data: {
          punchGoalId,
        },
      },
      success: (res) => {
        console.log(res);
        this.setData({
          punchList: res.result.data,
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
