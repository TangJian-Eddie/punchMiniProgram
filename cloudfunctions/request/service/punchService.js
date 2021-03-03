const punchDao = require("../dao/punchDao");
const punchGoalDao = require("../dao/punchGoalDao");
const userDao = require("../dao/userDao");
class punchService {
  constructor() {
    this.punchDao = new punchDao();
    this.punchGoalDao = new punchGoalDao();
    this.userDao = new userDao();
  }

  async getPunchList(punchGoalId, page, size) {
    const list = await this.punchDao.getPunchList(punchGoalId, page, size);
    const total = await this.punchDao.getPunchCount(punchGoalId);
    return { code: 200, msg: "查询成功", data: { list, total } };
  }

  async getPunchListByMonth(userId, year, month) {
    const list = await this.punchDao.getPunchListByMonth(userId, year, month);
    return { code: 200, msg: "查询成功", data: { list } };
  }
  async createPunch(punch) {
    punch.date = new Date(punch.date);
    if (punch.date.toDateString() !== new Date().toDateString()) {
      const isRepunchLimit = await this.userDao.checkRepunchLimit(punch.userId);
      if (!isRepunchLimit) {
        return {
          code: 403,
          msg: "一天只可以补打卡一次，今天已达到限制",
        };
      }
      await this.userDao.increaseRepunch(punch.userId);
    }
    const { punchTimes } = await this.punchGoalDao.getPunchGoalById(
      punch.punchGoalId
    );
    const punchCount = await this.punchDao.getPunchCountByDate(
      punch.punchGoalId,
      punch.date
    );
    if (punchTimes <= punchCount) {
      return {
        code: 403,
        msg: "当天此打卡目标打卡次数已达到，请勿重复打卡",
      };
    }
    const res = await this.punchDao.createPunch(punch);
    await this.punchGoalDao.increaseCount(punch.punchGoalId);
    return { code: 200, msg: "新增成功", data: res };
  }
  async updatePunch(punch) {
    punch.date = new Date(punch.date);
    const oldPunch = await this.punchDao.getPunchById(punch._id);
    if (punch.date.toDateString() !== new Date(oldPunch.date).toDateString()) {
      const { punchTimes } = await this.punchGoalDao.getPunchGoalById(
        punch.punchGoalId
      );
      const punchCount = await this.punchDao.getPunchCountByDate(
        punch.punchGoalId,
        punch.date
      );
      if (punchTimes <= punchCount) {
        return {
          code: 403,
          msg: "当天此打卡目标打卡次数已达到，请勿重复打卡",
        };
      }
    }
    const id = punch._id;
    delete punch._id;
    const res = await this.punchDao.updatePunch(id, punch);
    return { code: 200, msg: "修改成功", data: res };
  }
  async deletePunch(id) {
    const res = await this.punchDao.getPunchById(id);
    await this.punchDao.deletePunch(id);
    await this.punchGoalDao.decreaseCount(res.punchGoalId);
    return { code: 200, msg: "删除成功" };
  }
}
module.exports = punchService;
