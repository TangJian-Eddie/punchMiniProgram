const punchDao = require('../dao/punchDao');
const punchGoalDao = require('../dao/punchGoalDao');
const userDao = require('../dao/userDao');
const { getDateInfo } = require('../utils/format');
class punchService {
  constructor() {
    this.punchDao = new punchDao();
    this.punchGoalDao = new punchGoalDao();
    this.userDao = new userDao();
  }

  async getPunchList(punchGoalId, page, size) {
    const list = await this.punchDao.getPunchList(punchGoalId, page, size);
    const total = await this.punchDao.getPunchCountByCondition({ punchGoalId });
    return { code: 200, msg: '查询成功', data: { list, total } };
  }

  async getPunchListByMonth(userId, year, month) {
    const list = await this.punchDao.getPunchListByMonth(userId, year, month);
    return { code: 200, msg: '查询成功', data: { list } };
  }

  async createPunch(punch) {
    const { date, punchGoalId, userId } = punch;
    if (date.toDateString() !== new Date().toDateString()) {
      const { rePunch } = await this.userDao.getRepunch(userId);
      if (rePunch >= 1) {
        return { code: 403, msg: '一天只可以补打卡一次，今天已达到限制' };
      }
      await this.userDao.increaseRepunch(userId);
    }
    const { punchTimes } = await this.punchGoalDao.getPunchGoal(punchGoalId);
    const { year, month, date: _date } = getDateInfo(date);
    const punchCount = await this.punchDao.getPunchCountByDate(
      punchGoalId,
      year,
      month,
      _date
    );
    if (punchTimes <= punchCount) {
      return { code: 403, msg: '当天此打卡目标打卡次数已达到，请勿重复打卡' };
    }
    const res = await this.punchDao.createPunch(punch);
    return { code: 200, msg: '新增成功', data: res };
  }
  async updatePunch(punch) {
    const { _id, date, punchGoalId } = punch;
    const oldPunch = await this.punchDao.getPunch(_id);
    if (date.toDateString() !== new Date(oldPunch.date).toDateString()) {
      const { punchTimes } = await this.punchGoalDao.getPunchGoal(punchGoalId);
      const { year, month, date: _date } = getDateInfo(date);
      const punchCount = await this.punchDao.getPunchCountByDate(
        punchGoalId,
        year,
        month,
        _date
      );
      if (punchTimes <= punchCount) {
        return { code: 403, msg: '当天此打卡目标打卡次数已达到，请勿重复打卡' };
      }
    }
    const id = punch._id;
    delete punch._id;
    const res = await this.punchDao.updatePunch(id, punch);
    return { code: 200, msg: '修改成功', data: res };
  }

  async deletePunch(id) {
    await this.punchDao.deletePunch(id);
    return { code: 200, msg: '删除成功' };
  }

  async deletePunchByGoalId(id) {
    await this.punchDao.deletePunch(id);
    return { code: 200, msg: '删除成功' };
  }
}
module.exports = punchService;
