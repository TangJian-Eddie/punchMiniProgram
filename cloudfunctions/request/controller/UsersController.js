const MethodController = require('../utils/method');
const UsersService = require('../service/userService');
const usersService = new UsersService();

const UsersController = async (ctx, next) => {
  const methodController = new MethodController();
  methodController.get(getUser);
  methodController.post(updateUser);
  const res = await methodController.serve(ctx);
  ctx.body = res;
};

const getUser = async (event) => {
  try {
    const { userId } = event;
    const res = await usersService.getUser(userId);
    return { code: 200, msg: '登陆成功', data: { ...res, userId } };
  } catch (err) {
    return err;
  }
};
const updateUser = async (event) => {
  try {
    const { userId, data: userInfo } = event;
    await usersService.updateUser(userId, userInfo);
    return { code: 200, msg: '登陆成功', data: { ...userInfo, userId } };
  } catch (err) {
    return err;
  }
};
module.exports = UsersController;
