Component({
  data: {
    xmove: "",
  },
  methods: {
    /**
     * 处理touchstart事件
     */
    handleTouchStart(e) {
      this.startX = e.touches[0].pageX;
    },

    /**
     * 处理touchend事件
     */
    handleTouchEnd(e) {
      let xmove;
      if (e.changedTouches[0].pageX - this.startX <= -60) {
        xmove = -160;
      }
      if (e.changedTouches[0].pageX - this.startX > 30) {
        xmove = 0;
      }
      this.setData({
        xmove,
      });
    },
    handleDelete() {
      this.triggerEvent("handleDelete");
    },
    handleEdit() {
      this.triggerEvent("handleEdit");
    },
  },
});
