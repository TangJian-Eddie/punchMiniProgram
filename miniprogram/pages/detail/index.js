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
    const { item, index } = e.currentTarget.dataset;
    wx.showModal({
      content: "确认删除这次打卡记录",
      success: (result) => {
        if (result.confirm) {
          wx.showLoading({ mask: true });
          fetch({
            name: "deletePunch",
            data: {
              id: item._id,
              punchGoalId: item.punchGoalId,
            },
          }).then((res) => {
            wx.hideLoading();
            app.toast(res.msg);
            if (res.code != 200) return;
            app.toast("删除成功");
            app.event.emit("punchChange", {
              punch: item,
              /* type 
                         1 新增打卡
                         2 修改打卡
                         3 删除打卡 */
              type: 3,
            });
            const { punchList, info } = this.data;
            punchList.splice(index, 1);
            this.setData({ punchList, "info.count": --info.count });
          });
        }
      },
    });
  },
  rePunch() {
    if (this.data.info.isEnd) {
      app.toast('打卡目标已经结束~')
      return
    }
    const info = JSON.stringify(this.data.info);
    wx.navigateTo({
      url: `/pages/punch/index?info=${info}&rePunch=1`,
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
      console.log("load more...");
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
    app.event.on("punchChange", this.punchChange, this);
    if (options.info) {
      const info = JSON.parse(options.info);
      if (new Date(info.endTime) < new Date()) {
        info.isEnd = true;
      }
      this.setData({ info });
      this.getData(info._id);
    }
  },

  punchChange(e) {
    const { type, punch } = e;
    const { punchList } = this.data;
    if (type === 1) {
      this.setData({ "info.count": ++this.data.info.count });
      this.getData(this.data.info._id);
    }
    if (type === 2) {
      const index = punchList.findIndex((item) => item._id === punch._id);
      this.setData({ [`punchList[${index}]`]: punch });
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
      if (res.data.total <= page * pageSize) {
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
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
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
