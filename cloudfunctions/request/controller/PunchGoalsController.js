const MethodController = require('../utils/method');

const PunchGoalService = require('../service/punchGoalService');
const punchGoalService = new PunchGoalService();
const PunchService = require('../service/PunchService');
const punchService = new PunchService();

const { validator } = require('../utils/validator');

const PunchGoalsController = async (ctx, next) => {
  const methodController = new MethodController();
  methodController.get(getPunchGoalList);
  methodController.post(createPunchGoal);
  methodController.put(updatePunchGoal);
  methodController.post(deletePunchGoal);
  const res = await methodController.serve(ctx);
  ctx.body = res;
};

const getPunchGoalList = async (event) => {
  try {
    validator([], event.data, true);
    const list = await punchGoalService.getPunchGoalList(event.data.userId);
    return { code: 200, msg: '查询成功', data: { list } };
  } catch (err) {
    return err;
  }
};

const createPunchGoal = async (event) => {
  const params = [
    'goalName',
    'iconName',
    'punchTimes',
    'startTime',
    'iconBackground',
  ];
  try {
    const { data } = event;
    validator(params, data);
    data.date = new Date();
    for (const item of ['startTime', 'endTime']) {
      data[item] = data[item] ? new Date(data[item]) : null;
    }
    const res = await punchGoalService.createPunchGoal(event.data);
    return res;
  } catch (err) {
    return err;
  }
};

const updatePunchGoal = async (event) => {
  const params = [
    '_id',
    'goalName',
    'iconName',
    'punchTimes',
    'startTime',
    'iconBackground',
  ];
  try {
    const { data } = event;
    validator(params, data);
    const id = data._id;
    delete data._id;
    for (const item of ['date', 'startTime', 'endTime']) {
      data[item] = data[item] ? new Date(data[item]) : null;
    }
    await punchGoalService.updatePunchGoal(id, data);
    return { code: 200, msg: '更新成功' };
  } catch (err) {
    return err;
  }
};

const deletePunchGoal = async (event) => {
  try {
    validator('id', event.data);
    await punchGoalService.deletePunchGoal(event.data.id);
    await punchService.deletePunchByGoalId(event.data.id);
    return { code: 200, msg: '删除成功' };
  } catch (err) {
    return err;
  }
};
module.exports = PunchGoalsController;
