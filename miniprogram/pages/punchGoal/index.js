// pages/punchGoal/index.js
import { fetch } from "../../utils/fetch";
import { colorList } from "../../constant/colorList";
import { formatDate } from "../../utils/formatDate";
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
      startTime: formatDate(new Date()),
      endTime: "",
      punchTimes: 1,
      iconBackground: "#FFFFFF",
    },
    isEndTime: false,
    modalShow: false,
    pickerStart: "",
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
    if (
      type === "endTime" &&
      new Date(e.detail.value) < new Date(this.data.goal.startTime)
    ) {
      app.toast("结束时间应在开始时间之后~");
      return;
    }
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
    wx.showLoading({ mask: true });
    fetch({
      name: "punchGoal",
      data: goal,
    }).then((res) => {
      wx.hideLoading();
      app.toast(res.msg);
      if (res.code != 200) return;
      app.event.emit("punchGoalChange", {
        punchGoal: goal,
        /* type 
             1 新增打卡目标
             2 修改打卡目标
             3 删除打卡目标 */
        type: goal._id ? 2 : 1,
      });
      wx.switchTab({ url: "/pages/home/index" });
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.punchGoal) {
      const punchGoal = JSON.parse(options.punchGoal);
      this.setData({
        goal: { ...this.data.goal, ...punchGoal },
        pickerStart: formatDate(new Date()),
      });
      if (punchGoal.endTime) {
        this.setData({ isEndTime: true });
      }
    }
  },
});
