// 云函数入口文件
// const cloud = require("wx-server-sdk");
const TcbRouter = require("tcb-router");
// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const punchGoalService = require("./service/punchGoalService");
const punchService = require("./service/punchService");
const userService = require("./service/userService");

const punchGoalServices = new punchGoalService();
const punchServices = new punchService();
const userServices = new userService();
// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event });
  app.router("punches", async (ctx, next) => {
    if (event.method === "GET") {
      if (event.queryString) {
        if (!event.queryString.year || !event.queryString.month) {
          ctx.body = { code: 500, msg: "参数错误！" };
          return;
        }
        ctx.body = await punchServices.getPunchListByMonth(
          event.data.userId,
          event.queryString.year,
          event.queryString.month
        );
        return;
      }
      const { page, size, punchGoalId } = event.data;
      if (
        !["page", "size", "punchGoalId"].every(
          (item) => Object.keys(event.data).indexOf(item) >= 0
        )
      ) {
        ctx.body = { code: 500, msg: "参数错误！" };
        return;
      }
      ctx.body = await punchServices.getPunchList(punchGoalId, page, size);
      return;
    }
    if (event.method === "POST") {
      if (
        !["date", "punchGoalId"].every(
          (item) =>
            event.data[item] !== "" &&
            event.data[item] !== null &&
            event.data[item] !== undefined
        )
      ) {
        ctx.body = { code: 500, msg: "参数错误！" };
        return;
      }
      ctx.body = await punchServices.createPunch(event.data);
      return;
    }
    if (event.method === "PUT") {
      if (
        !["_id", "date", "punchGoalId"].every(
          (item) =>
            event.data[item] !== "" &&
            event.data[item] !== null &&
            event.data[item] !== undefined
        )
      ) {
        ctx.body = { code: 500, msg: "参数错误！" };
        return;
      }
      ctx.body = await punchServices.updatePunch(event.data);
      return;
    }
    if (event.method === "DELETE") {
      if (!event.data.id) {
        ctx.body = { code: 500, msg: "参数错误！" };
        return;
      }
      ctx.body = await punchServices.deletePunch(event.data.id);
      return;
    }
  });

  app.router("punchgoales", async (ctx, next) => {
    if (event.method === "GET") {
      if (!event.data.userId) {
        ctx.body = { code: 500, msg: "参数错误！" };
        return;
      }
      ctx.body = await punchGoalServices.getPunchGoalList(event.data.userId);
      return;
    }
    if (event.method === "POST") {
      const params = [
        "goalName",
        "iconName",
        "punchTimes",
        "startTime",
        "iconBackground",
      ];
      if (
        !params.every(
          (item) =>
            event.data[item] !== "" &&
            event.data[item] !== null &&
            event.data[item] !== undefined
        )
      ) {
        ctx.body = { code: 500, msg: "参数错误！" };
        return;
      }
      ctx.body = await punchGoalServices.createPunchGoal(event.data);
      return;
    }
    if (event.method === "PUT") {
      const params = [
        "_id",
        "goalName",
        "iconName",
        "punchTimes",
        "startTime",
        "iconBackground",
      ];
      if (
        !params.every(
          (item) =>
            event.data[item] !== "" &&
            event.data[item] !== null &&
            event.data[item] !== undefined
        )
      ) {
        ctx.body = { code: 500, msg: "参数错误！" };
        return;
      }
      ctx.body = await punchGoalServices.updatePunchGoal(event.data);
      return;
    }
    if (event.method === "DELETE") {
      if (!event.data.id) {
        ctx.body = { code: 500, msg: "参数错误！" };
        return;
      }
      ctx.body = await punchGoalServices.deletePunchGoal(event.data.id);
      return;
    }
  });

  app.router("login", async (ctx, next) => {
    if (event.method === "POST") {
      const userId = cloud.getWXContext().OPENID;
      const { userInfo } = event.data;
      ctx.body = await userServices.login(userId, userInfo);
      return;
    }
  });

  return app.serve();
};
