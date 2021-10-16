import {
  iconList_habit,
  iconList_physical,
  iconList_learn,
  iconList_reflection,
} from '../../../constant/iconList';
const app = getApp();
Page({
  // 页面数据
  data: {
    iconList_habit,
    iconList_physical,
    iconList_learn,
    iconList_reflection,
    iconName: '',
    goalName: '',
  },
  chooseIcon(e) {
    const { type, index } = e.currentTarget.dataset;
    const icon = `${type}_${index + 1}`;
    this.setData({
      iconName: icon,
    });
  },
  goalNameInput(e) {
    this.setData({
      goalName: e.detail.value,
    });
  },
  next() {
    const { goalName, iconName } = this.data;
    if (!iconName) {
      app.toast('请选择一个图标~');
      return;
    }
    if (!goalName) {
      app.toast('请填写打卡目标~');
      return;
    }
    const punchGoal = JSON.stringify({
      goalName,
      iconName,
    });
    wx.navigateTo({
      url: `../index?punchGoal=${punchGoal}`,
    });
  },
});
