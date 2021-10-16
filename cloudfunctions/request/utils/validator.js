function returnError(error) {
  const { code, msg } = error;
  this.code = code || 500;
  this.message = msg || 'Default Message';
}
// 暂时只做未登陆校验和必填校验
const validator = (parameter, input, needLogin = false) => {
  if (needLogin && !input.userId) {
    throw new returnError({ code: 401, msg: '用户未登录' });
  }
  if (typeof parameter === 'string') {
    parameter = [parameter];
  }
  if (
    !parameter.every(
      (item) =>
        input[item] !== '' && input[item] !== null && input[item] !== undefined
    )
  ) {
    throw new returnError({ code: 500, msg: '参数错误！' });
  }
};

module.exports = { validator };
