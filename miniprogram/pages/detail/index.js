// pages/detail/index.js
import { fetch } from '../../utils/fetch';
import { PAGE_SIZE } from '../../constant/index';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    fuse: 0,
    list: [],
    punchList: null,
    slideButtons: [
      {
        text: '修改',
        data: 'edit',
      },
      {
        type: 'warn',
        data: 'delete',
        text: '删除',
      },
    ],
    slideView: false,
    slideViewBoundary: null,
  },
  cancelSlide(e) {
    const { slideViewBoundary } = this.data;
    if (
      slideViewBoundary &&
      !(
        e.touches[0].pageX > slideViewBoundary.left &&
        e.touches[0].pageX < slideViewBoundary.right &&
        e.touches[0].pageY < slideViewBoundary.bottom &&
        e.touches[0].pageY > slideViewBoundary.top
      )
    ) {
      this.setData({ slideView: false });
      this.data.slideViewBoundary = null;
    }
  },

  slideviewShow(e) {
    this.data.slideView = true;
    wx.createSelectorQuery()
      .select(`#slideview${e.currentTarget.dataset.index}`)
      .boundingClientRect((rect) => {
        this.data.slideViewBoundary = rect;
      })
      .exec();
  },

  handleAction(e) {
    const { data } = e.detail;
    if (data === 'edit') {
      this.handleEdit(e);
    } else if (data === 'delete') {
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
      content: '确认删除这次打卡记录',
      success: (result) => {
        if (result.confirm) {
          wx.showLoading({ mask: true });
          fetch({
            url: 'punches',
            method: 'DELETE',
            data: {
              id: item._id,
            },
          }).then((res) => {
            wx.hideLoading();
            app.toast(res.msg);
            if (res.code != 200) return;
            app.event.emit('punchChange', {
              punch: item,
              /* type
                         1 新增打卡
                         2 修改打卡
                         3 删除打卡 */
              type: 3,
            });
            const { punchList, info } = this.data;
            punchList.splice(index, 1);
            this.setData({ punchList, 'info.count': --info.count });
          });
        }
      },
    });
  },

  rePunch() {
    if (this.data.info.isEnd) {
      app.toast('打卡目标已经结束~');
      return;
    }
    const info = JSON.stringify(this.data.info);
    wx.navigateTo({
      url: `/pages/punch/index?info=${info}&rePunch=1`,
    });
  },

  loadMore() {
    this.setData({
      fuse: this.data.fuse + 1,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.event.on('punchChange', this.punchChange, this);
    if (options.info) {
      const info = JSON.parse(options.info);
      if (info.endTime && new Date(info.endTime) < new Date()) {
        info.isEnd = true;
      }
      this.setData({ info });
      this.getData();
    }
  },

  punchChange(e) {
    const { type, punch } = e;
    const { punchList } = this.data;
    if (type === 1) {
      this.setData({ 'info.count': ++this.data.info.count });
      this.resetList();
    }
    if (type === 2) {
      const index = punchList.findIndex((item) => item._id === punch._id);
      this.setData({ [`punchList[${index}]`]: punch });
    }
  },

  getData(obj) {
    const { detail = {} } = obj || {};
    const { offset = 1 } = detail;
    fetch({
      url: 'punches',
      method: 'GET',
      data: { punchGoalId: this.data.info._id, page: offset, size: PAGE_SIZE },
    }).then((res) => {
      const punchList = this.data.punchList || [];
      this.setData({
        list: res.data.list,
        punchList: punchList.concat(res.data.list),
      });
    });
  },

  resetList() {
    fetch({
      url: 'punches',
      method: 'GET',
      data: { punchGoalId: this.data.info._id, page: 1, size: PAGE_SIZE },
    }).then((res) => {
      this.setData({
        list: res.data.list,
        punchList: res.data.list,
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
    app.event.off('punchChange', this.punchChange);
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
