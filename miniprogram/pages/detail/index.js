// pages/detail/index.js
import { fetch } from "../../utils/fetch";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    punchList: [],
    fetchConf: {
      page: 1,
      pageSize: 10,
      hasNext: true,
    },
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
    const info = JSON.stringify(this.data.info);
    const punch = JSON.stringify(e.currentTarget.dataset.item);
    wx.navigateTo({
      url: `/pages/punch/index?info=${info}&punch=${punch}`,
    });
  },
  handleDelete(e) {
    const { _id, punchGoalId } = e.currentTarget.dataset.item;
    wx.showModal({
      content: "确认删除这次打卡记录",
      success: (result) => {
        if (result.confirm) {
          fetch({
            name: "deletePunch",
            data: {
              id: _id,
              punchGoalId,
            },
          }).then((res) => {
            if (res.code != 200) {
              app.toast(res.msg);
              return;
            }
            app.toast("删除成功");
            this.resetData();
          });
        }
      },
    });
  },
  rePunch() {
    const info = JSON.stringify(this.data.info);
    wx.navigateTo({
      url: `/pages/punch/index?info=${info}&rePunch=1`,
    });
  },
  toPunch() {
    const info = JSON.stringify(this.data.info);
    wx.navigateTo({
      url: `/pages/punch/index?info=${info}`,
    });
  },
  resetData() {
    this.setData({
      punchList: [],
      fetchConf: {
        page: 1,
        pageSize: 10,
        hasNext: true,
      },
    });
    this.getData(this.data.info._id);
  },
  loadMore() {
    const { page, hasNext } = this.data.fetchConf;
    if (hasNext) {
      this.setData({
        "fetchConf.page": page + 1,
      });
      this.getData(this.data.info._id);
    }
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
    }
  },

  getData(id) {
    const punchGoalId = id;
    const { page, pageSize } = this.data.fetchConf;
    fetch({
      name: "getPunchList",
      data: {
        punchGoalId,
        page,
        pageSize,
      },
    }).then((res) => {
      let hasNext = true;
      if (res.total <= page * pageSize) {
        hasNext = false;
      }
      this.setData({
        punchList: this.data.punchList.concat(res.data.list),
        "fetchConf.hasNext": hasNext,
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
    this.resetData();
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
