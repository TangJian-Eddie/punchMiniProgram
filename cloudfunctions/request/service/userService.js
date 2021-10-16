const userDao = require('../dao/userDao');
class userService {
  constructor() {
    this.userDao = new userDao();
  }

  async getUser(userId) {
    return this.userDao.getUser(userId);
  }
  async updateUser(userId, userInfo) {
    return this.userDao.updateUser(userId, userInfo);
  }
}

module.exports = userService;
