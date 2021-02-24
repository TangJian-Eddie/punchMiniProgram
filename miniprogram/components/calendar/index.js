import plugins from "./plugins/index";
import todo from "./plugins/todo";
import { calcJumpData } from "./core";
import { renderCalendar } from "./render";
import { calcTargetYMInfo } from "./helper";
import { dateUtil, calendarGesture, logger } from "./utils/index";

Component({
  options: {
    styleIsolation: "apply-shared",
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    config: {
      type: Object,
      value: {
        emphasisWeek: true, // 是否高亮显示周末日期
        autoChoosedWhenJump: true, // 设置默认日期及跳转到指定日期后是否需要自动选中
      },
      // calendarConfig: {
      //   multi: true, // 是否开启多选,
      //   inverse: true, // 单选模式下是否支持取消选中,
      //   markToday: '今', // 当天日期展示不使用默认数字，用特殊文字标记
      //   takeoverTap: true, // 是否完全接管日期点击事件（日期不会选中)
      //   emphasisWeek: true, // 是否高亮显示周末日期
      //   highlightToday: true, // 是否高亮显示当天，区别于选中样式（初始化时当天高亮并不代表已选中当天）
      //   defaultDate: '2018-3-6', // 默认选中指定某天，如需选中需配置 autoChoosedWhenJump: true， 默认今天
      //   preventSwipe: true, // 是否禁用日历滑动切换月份
      //   firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      //   onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      //   autoChoosedWhenJump: true, // 设置默认日期及跳转到指定日期后是否需要自动选中
      //   disableMode: {
      //     // 禁用某一天之前/之后的所有日期
      //     type: 'after', // [‘before’, 'after']
      //     date: '2020-3-24' // 无该属性或该属性值为假，则默认为当天
      //   },
      // }
    },
    dates: {
      type: Array,
      value: [],
    },
  },
  lifetimes: {
    attached: function () {
      this.initComp();
    },
  },
  methods: {
    initComp() {
      const calendarConfig = this.setDefaultDisableDate();
      this.setConfig(calendarConfig);
    },
    // 禁用某天日期配置默认为今天
    setDefaultDisableDate() {
      const calendarConfig = this.properties.config || {};
      if (calendarConfig.disableMode && !calendarConfig.disableMode.date) {
        calendarConfig.disableMode.date = dateUtil.toTimeStr(
          dateUtil.todayFMD()
        );
      }
      return calendarConfig;
    },
    initCalendar(config) {
      const { defaultDate } = config;
      let date = dateUtil.todayFMD();
      if (defaultDate && typeof defaultDate === "string") {
        const dateInfo = defaultDate.split("-");
        if (dateInfo.length < 3) {
          return logger.warn("defaultDate配置格式应为: 2018-4-2 或 2018-04-02");
        } else {
          date = {
            year: +dateInfo[0],
            month: +dateInfo[1],
            date: +dateInfo[2],
          };
        }
      }
      const waitRenderData = calcJumpData({
        dateInfo: date,
        config,
      });
      const timestamp = dateUtil.todayTimestamp();
      if (config.autoChoosedWhenJump) {
        const target = waitRenderData.dates.filter(
          (item) => dateUtil.toTimeStr(item) === dateUtil.toTimeStr(date)
        );
        if (target && target.length) {
          if (!waitRenderData.selectedDates) {
            waitRenderData.selectedDates = target;
          } else {
            waitRenderData.selectedDates.push(target[0]);
          }
        }
        this.triggerEvent("afterTapDate", target[0]);
      }
      return {
        ...waitRenderData,
        todayTimestamp: timestamp,
        weeksCh: dateUtil.getWeekHeader(config.firstDayOfWeek),
      };
    },
    setConfig(config) {
      if (config.markToday && typeof config.markToday === "string") {
        config.highlightToday = true;
      }
      this.setData(
        {
          config,
        },
        () => {
          plugins.use(todo);
          for (let plugin of plugins.installed) {
            const [, p] = plugin;
            if (typeof p.install === "function") {
              p.install(this);
            }
            if (typeof p.methods === "function") {
              const methods = p.methods(this);
              for (let fnName in methods) {
                if (fnName.startsWith("__")) continue;
                const fn = methods[fnName];
                if (typeof fn === "function") {
                  if (!this.calendar) this.calendar = {};
                  this.calendar[fnName] = fn;
                }
              }
            }
          }
          const initData = this.initCalendar(config);
          renderCalendar.call(this, initData, config);
          // 父组件传值，在生成后自动setTodos
          const { dates } = this.data;
          if (dates.length !== 0) {
            this.calendar.setTodos({ dates });
          }
        }
      );
    },
    tapDate(e) {
      const { info } = e.currentTarget.dataset;
      const { date, disable } = info || {};
      if (disable || !date) return;
      const { calendar, config } = this.data;
      let calendarData = calendar;
      let calendarConfig = config;
      if (config.takeoverTap) {
        return this.triggerEvent("takeoverTap", info);
      }
      for (let plugin of plugins.installed) {
        const [, p] = plugin;
        if (typeof p.onTapDate === "function") {
          const {
            calendarData: __calendarData,
            calendarConfig: __calendarConfig,
          } = p.onTapDate(info, calendarData, calendarConfig);
          calendarData = __calendarData;
          calendarConfig = __calendarConfig;
        }
      }
      renderCalendar.call(this, calendarData, calendarConfig).then(() => {
        this.triggerEvent("afterTapDate", info);
      });
    },
    /**
     * 日历滑动开始
     * @param {object} e
     */
    calendarTouchstart(e) {
      const t = e.touches[0];
      const startX = t.clientX;
      const startY = t.clientY;
      this.swipeLock = true;
      this.setData({
        "gesture.startX": startX,
        "gesture.startY": startY,
      });
    },
    /**
     * 日历滑动中
     * @param {object} e
     */
    calendarTouchmove(e) {
      const { gesture } = this.data;
      const { preventSwipe } = this.properties.config;
      if (!this.swipeLock || preventSwipe) return;
      if (calendarGesture.isLeft(gesture, e.touches[0])) {
        this.handleSwipe("left");
        this.swipeLock = false;
      }
      if (calendarGesture.isRight(gesture, e.touches[0])) {
        this.handleSwipe("right");
        this.swipeLock = false;
      }
    },
    calendarTouchend(e) {
      this.setData({
        "calendar.leftSwipe": 0,
        "calendar.rightSwipe": 0,
      });
    },
    handleSwipe(direction) {
      let swipeKey = "calendar.leftSwipe";
      if (direction === "right") {
        swipeKey = "calendar.rightSwipe";
      }
      this.setData({
        [swipeKey]: 1,
      });
      const { calendar } = this.data;
      let calendarData = calendar;
      const { curYear, curMonth } = calendarData;
      const getMonthInfo = calcTargetYMInfo()[direction];
      const target = getMonthInfo({
        year: +curYear,
        month: +curMonth,
      });
      target.direction = direction;
      this.renderCalendar(target);
    },
    doubleClickToToday(e) {
      const curTime = e.timeStamp;
      const lastTime = this.data.lastTime;
      if (curTime - lastTime > 0 && curTime - lastTime < 300) {
        this.calendar.jump();
        this.data.lastTime = null;
        return;
      }
      this.data.lastTime = curTime;
    },
    changeDate(e) {
      const { type } = e.currentTarget.dataset;
      const { calendar: calendarData } = this.data;
      const { curYear, curMonth } = calendarData;
      const getMonthInfo = calcTargetYMInfo()[type];
      const target = getMonthInfo({
        year: +curYear,
        month: +curMonth,
      });
      target.direction = type;
      this.renderCalendar(target);
    },
    renderCalendar(target) {
      let { calendar: calendarData, config } = this.data;
      const { curYear, curMonth } = calendarData || {};
      for (let plugin of plugins.installed) {
        const [, p] = plugin;
        if (typeof p.onSwitchCalendar === "function") {
          calendarData = p.onSwitchCalendar(target, calendarData, this);
        }
      }
      return renderCalendar.call(this, calendarData, config).then(() => {
        let triggerEventName = "whenChangeMonth";
        this.triggerEvent(triggerEventName, {
          current: {
            year: +curYear,
            month: +curMonth,
          },
          next: target,
        });
      });
    },
  },
});
