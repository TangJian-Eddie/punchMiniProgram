class methodController {
  constructor() {
    this.switchMethod(['get', 'post', 'put', 'delete']);
  }
  switchMethod(methods) {
    for (const method of methods) {
      this[method] = (handler) => {
        this[`_${method}`] = handler;
      };
    }
  }
  async serve(ctx) {
    const { event } = ctx._req;
    const { method } = event;
    const res = await this[`_${method.toLowerCase()}`](event);
    return res;
  }
}

module.exports = methodController;
