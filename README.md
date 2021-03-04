# 打卡小程序

## 一、概况

此项目为打卡小程序，目前处于持续更新中，主要两大板块——打卡、日历。

- **快速上手**

在根目录生成一个 config.js 文件，填入

```javascript
export const env = xxx; // 此处填入你申请的云函数
```

上传 request 云函数(开启本地调试的话需要在其目录下 npm install)

在小程序开发者工具导入小程序，即可开始使用

## 二、文件结构

```shell
.
└── cloudfunctions                    云函数
    ├── clearRepunch                  定时清空用户rePunch
    └── request                       小程序端接口
└── miniprogram                       小程序主体
    ├── assets                        静态资源
    ├── components                    组件
    ├── constant                      固定设置
    ├── pages                         主界面
    └── utils                         工具函数
        ├── event                     页面间通信
        ├── fetch                     网络请求
        ├── formatDate                时间格式化
        └── index.wxs                 wxs(包括字符串切割)
    ├── app.js
    ├── app.json
    ├── app.wxss
    └── sitemap.json
├── .gitignore                        网络请求文件
├── package-lock.json
├── package.json
└── project.config.json               小程序配置

```

## 三、功能

- 登录
- 增删改查打卡目标
- 增删改查打卡记录
- 日历可视化

## 四、技术栈

小程序端：

- 原生小程序

云函数端:

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [tcb-router](https://github.com/TencentCloudBase/tcb-router)

## 五、项目亮点

- event 页面间通信(减少请求，加快小程序运行速度)
- tcb-router(更贴近后端架构，减少云函数的数量)
- 左滑删除组件基本完美适配
- 日历数据可视化

## 六、目前仍存在问题

1. calendar 组件冗余
2. 数据可视化
3. 成就系统(打卡奖励机制，补打卡限制)
4. eslint、prettier 引入
5. 打卡分类(多次打卡、打卡是否完成)
