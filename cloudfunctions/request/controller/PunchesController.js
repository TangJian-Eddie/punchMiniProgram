const MethodController = require('../utils/method');

const PunchService = require('../service/punchService');
const punchService = new PunchService();

const { validator } = require('../utils/validator');

const UsersController = async (ctx, next) => {
  const methodController = new MethodController();
  methodController.get(getPunch);
  methodController.post(createPunch);
  methodController.put(updatePunch);
  methodController.delete(deletePunch);
  const res = await methodController.serve(ctx);
  ctx.body = res;
};

const getPunch = async (event) => {
  try {
    if (Object.keys(event.query).length > 0) {
      const params = ['year', 'month'];
      validator(params, event.query);
      const { userId } = event.data;
      const { year, month } = event.query;
      return await punchService.getPunchListByMonth(userId, year, month);
    } else {
      const params = ['page', 'size', 'punchGoalId'];
      validator(params, event.data);
      const { punchGoalId, page, size } = event.data;
      return await punchService.getPunchList(punchGoalId, page, size);
    }
  } catch (err) {
    return err;
  }
};

const createPunch = async (event) => {
  const params = ['date', 'punchGoalId'];
  try {
    const { data, userId } = event;
    validator(params, data);
    data.date = new Date(data.date);
    return await punchService.createPunch({ userId, ...data });
  } catch (err) {
    return err;
  }
};

const updatePunch = async (event) => {
  const params = ['_id', 'date', 'punchGoalId'];
  try {
    const { data } = event;
    validator(params, data);
    data.date = new Date(data.date);
    return await punchService.updatePunch(data);
  } catch (err) {
    return err;
  }
};

const deletePunch = async (event) => {
  try {
    validator('id', event.data);
    return await punchService.deletePunch(event.data.id);
  } catch (err) {
    return err;
  }
};
module.exports = UsersController;
