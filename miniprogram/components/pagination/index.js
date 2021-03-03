import { PAGE_SIZE } from "../../constant/index";
Component({
  properties: {
    fuse: {
      type: Number,
      value: 0,
      observer: "_loadMore",
    },
    list: {
      type: Array,
      value: null,
      observer: "_resetSomeParams",
    },
  },
  data: {
    inited: false,
    offset: 1,
    dataEnd: false,
    loading: false,
  },
  methods: {
    _loadMore() {
      const { offset, dataEnd, loading } = this.data;
      if (dataEnd || loading) return;
      console.log("开始load more...");
      this.setData({ loading: true });
      const num = offset + 1;
      this.data.offset = num;
      this.triggerEvent("getList", { offset: num });
    },
    _resetSomeParams(list) {
      if (list !== null) this.data.inited = true;
      this.setData({ loading: false });
      // 数据全部加载结束
      if (this.data.inited && list.length < PAGE_SIZE) {
        this.data.dataEnd = true;
      }
    },
  },
});
