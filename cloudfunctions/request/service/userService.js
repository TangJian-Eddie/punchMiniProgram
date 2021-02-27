const userDao = require("../dao/userDao");
class userService {
  constructor() {
    this.userDao = new userDao();
  }

  async login(userId, userInfo) {
    try {
      await this.userDao.login(userId, userInfo);
      return {
        code: 200,
        msg: "登陆成功",
        data: { userId, ...userInfo },
      };
    } catch (err) {
      return { code: 500, msg: "服务器错误！", err };
    }
  }
}

module.exports = userService;
