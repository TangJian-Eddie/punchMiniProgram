//app.js
import { env } from './config';
const Event = require('./utils/event.js');
App({
  event: new Event(),
  onLaunch: function () {
    wx.cloud.init({ env });
    this._initUserInfo();
  },
  globalData: {},
  async _initUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    this.globalData.userInfo = userInfo;
  },
  toast(title) {
    wx.showToast({ title, icon: 'none' });
  },
});
