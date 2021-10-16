// pages/punch/index.js
import { fetch } from '../../utils/fetch';
import { formatDate } from '../../utils/format';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    punch: {
      punchGoalId: '',
      comment: '',
      date: null,
    },
    todayPunch: true,
    punchBeforeDate: null,
    pickerEnd: '',
  },

  inputChange(e) {
    this.setData({ 'punch.comment': e.detail.value });
  },
  timePick(e) {
    if (
      this.data.info.endTime &&
      new Date(this.data.info.endTime) < new Date(e.detail.value)
    ) {
      app.toast('打卡时间不可以晚于目标结束时间~');
      return;
    }
    if (
      this.data.info.startTime &&
      new Date(this.data.info.startTime) > new Date(e.detail.value)
    ) {
      app.toast('打卡时间不可以早于目标开始时间~');
      return;
    }
    this.setData({ 'punch.date': e.detail.value });
  },
  punch() {
    wx.showLoading({ mask: true });
    fetch({
      url: 'punches',
      method: this.data.punch._id ? 'PUT' : 'POST',
      data: this.data.punch,
    }).then((res) => {
      wx.hideLoading();
      app.toast(res.msg);
      if (res.code !== 200) return;
      app.event.emit('punchChange', {
        punch: this.data.punch,
        punchBeforeDate: this.data.punchBeforeDate,
        /* type
                   1 新增打卡
                   2 修改打卡
                   3 删除打卡 */
        type: this.data.punch._id ? 2 : 1,
      });
      wx.navigateBack();
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const info = JSON.parse(options.info);
    this.data.punch.punchGoalId = info._id;
    this.data.punch.date = new Date();
    this.setData({ info, pickerEnd: formatDate(new Date()) });
    // 修改打卡
    if (options.punch) {
      const punch = JSON.parse(options.punch);
      this.data.punchBeforeDate = punch.date;
      this.setData({ punch, todayPunch: false });
    }
    // 补打卡
    if (options.rePunch) {
      this.data.punch.date = null;
      this.setData({ todayPunch: false });
    }
  },
});
