const cloud = require('wx-server-sdk');
const TcbRouter = require('tcb-router');

const { parseUrlQuery } = require('./utils/url');

const PunchesController = require('./controller/PunchesController');
const UsersController = require('./controller/UsersController');
const PunchGoalsController = require('./controller/PunchGoalsController');

// 云函数入口函数
exports.main = async (event, context) => {
  const [$url, query] = parseUrlQuery(event.$url);
  const userId = cloud.getWXContext().OPENID;
  event = { ...event, $url, query, userId };
  const app = new TcbRouter({ event });
  app.router('punches', PunchesController);
  app.router('punchgoals', PunchGoalsController);
  app.router('user', UsersController);
  return app.serve();
};
