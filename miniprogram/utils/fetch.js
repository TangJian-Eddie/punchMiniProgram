import { appendQuery } from './url';
const UNLOGIN_CODE = 401;

export function fetch(params) {
  return new Promise((resolve, reject) => {
    const { url, method: _method, params: query, data } = params;
    const method = _method.toUpperCase();
    const $url = appendQuery(query, url);
    wx.cloud.callFunction({
      name: 'request',
      data: { $url, method, data },
      success: (res) => {
        if (res.code === UNLOGIN_CODE) {
          return handleUnloginError(params);
        }
        resolve(res.result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
}
let isRefreshing = true;
function handleUnloginError(params) {
  if (isRefreshing) {
    refreshTokenRequst();
  }
  isRefreshing = false;
  return new Promise((resolve) => {
    addSubscriber(() => {
      resolve(fetch(params));
    });
  });
}
async function refreshTokenRequst() {
  const res = await fetch({ url: 'user', method: 'GET' });
  wx.setStorageSync('userInfo', res.data);
  _getApp().globalData.userInfo = res.data;
  onAccessTokenFetched();
  isRefreshing = true;
}
async function _getApp() {
  const app = getApp();
  if (app) {
    return app;
  } else {
    setTimeout(() => {
      return _getApp();
    }, 200);
  }
}
let subscribers = [];
function onAccessTokenFetched() {
  subscribers.forEach((callback) => {
    callback();
  });
  subscribers = [];
}
function addSubscriber(callback) {
  subscribers.push(callback);
}
