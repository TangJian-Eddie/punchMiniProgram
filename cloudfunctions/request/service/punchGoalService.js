const punchDao = require('../dao/punchDao');
const punchGoalDao = require('../dao/punchGoalDao');

class punchGoalService {
  constructor() {
    this.punchDao = new punchDao();
    this.punchGoalDao = new punchGoalDao();
  }
  async getPunchGoalList(userId) {
    return this.punchGoalDao.getPunchGoalList(userId);
  }

  async createPunchGoal(data) {
    return this.punchGoalDao.createPunchGoal(data);
  }

  async updatePunchGoal(id, data) {
    return this.punchGoalDao.updatePunchGoal(id, data);
  }

  async deletePunchGoal(id) {
    return this.punchGoalDao.deletePunchGoal(id);
  }
}
module.exports = punchGoalService;
