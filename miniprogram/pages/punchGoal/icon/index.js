import {
  iconList_habit,
  iconList_physical,
  iconList_learn,
  iconList_reflection,
} from '../../../constant/iconList';
Page({
  // 页面数据
  data: {
    iconList_habit,
    iconList_physical,
    iconList_learn,
    iconList_reflection,
  },
  chooseIcon(e) {
    const { type, index } = e.currentTarget.dataset;
    const iconName = `${type}_${index + 1}`;
    const goalName = this.data[`iconList_${type}`][index];
    const punchGoal = JSON.stringify({ iconName, goalName });
    wx.navigateTo({
      url: `../index?punchGoal=${punchGoal}`,
    });
  },

  customIcon() {
    wx.navigateTo({
      url: '../customIcon/index',
    });
  },
});
