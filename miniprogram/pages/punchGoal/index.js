// pages/punchGoal/index.js
import { fetch } from "../../utils/fetch";
import { colorList } from "../../constant/colorList";
import {
  iconList_habit,
  iconList_physical,
  iconList_learn,
  iconList_reflection,
} from "../../constant/iconList";
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    iconList_habit,
    iconList_physical,
    iconList_learn,
    iconList_reflection,
    colorList,
    goal: {
      iconName: "",
      goalName: "",
      comment: "",
      startTime: "",
      endTime: "",
      punchTimes: 1,
      iconBackground: "#FFFFFF",
    },
    isEndTime: false,
    modalShow: false,
  },
  inputChange(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ [`goal.${type}`]: e.detail.value });
  },
  switchChange(e) {
    this.setData({ isEndTime: e.detail.value });
  },
  timePick(e) {
    const { type } = e.currentTarget.dataset;
    this.setData({ [`goal.${type}`]: e.detail.value });
  },
  changeModalShow() {
    this.setData({ modalShow: !this.data.modalShow });
  },
  chooseIcon(e) {
    const { type, index } = e.currentTarget.dataset;
    const icon = `${type}_${index + 1}`;
    this.setData({
      "goal.iconName": icon,
    });
  },
  chooseColor(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      "goal.iconBackground": item,
    });
  },
  createPunchGoal() {
    const { goal } = this.data;
    if (
      Object.keys(goal).some((value) => {
        if (value == "comment" || value == "endTime") return false;
        return goal[value] === "";
      })
    ) {
      app.toast("有未填写完成的信息");
      return;
    }
    fetch({
      name: "punchGoal",
      data: goal,
    }).then((res) => {
      app.toast(res.msg);
      if (res.code != 200) return;
      wx.navigateBack();
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.punchGoal) {
      const punchGoal = JSON.parse(options.punchGoal);
      this.setData({ goal: punchGoal });
      if (punchGoal.endTime) {
        this.setData({ isEndTime: true });
      }
    }
  },
});
