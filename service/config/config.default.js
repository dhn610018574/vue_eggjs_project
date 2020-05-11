/* eslint valid-jsdoc: "off" */

'use strict'
const path = require('path')

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1588984849522_1512'

  // add your middleware config here
  config.middleware = ['errorHandler']
  config.errorHandler = {
    match: '/api',
  }
  // 配置egg安全机制
  // config.security = {
  //   csrf: false,
  //   domainWhiteList: [ '*' ],
  // };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    urls: {
      stuer_url: 'http://127.0.0.1:7001',
    },
    // 设置登录token为一周
    loginTokenTime: 7 * 24 * 60 * 60,
    // 摘要密码的密钥
    pwdSecrect: 'pwdsecrect',
    sequelize: {
      dialect: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      database: 'fangyuan',
      username: 'root',
      password: 'root',
      // timezone: '+8:00',
    },
    // // 配置egg安全机制
    security: {
      csrf: false,
      domainWhiteList: ['*'],
    },
    // 配置跨域
    cors: {
      origin: '*',
      credentials: true, // 开启认证
      allowMethods: 'GET,POST,PUT,DELETE,OPTIONS,PATCH,HEAD',
    },
    // 配置静态资源访问路径
    static: {
      dir: [
        { dir: path.join(appInfo.baseDir, 'app/public'), prefix: '/public/' }, // 前端项目构建目录
        { dir: path.join(appInfo.baseDir, 'upload'), prefix: '/upload/' }, // 用户上传图片目录
      ], // 多静态文件入口
      dynamic: true, // 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用
      preload: false,
      maxAge: 31536000, // in prod env, 0 in other envs
      buffer: true, // in prod env, false in other envs
    },
    // 配置错误信息
    errors: {
      INVALID_PARAM: {
        // 非法参数
        code: 1000,
        name: 'INVALID_PARAM',
        msg: '请求参数校验失败',
      },
      INVALID_AUTH_TOKEN: {
        // 非法auth_token
        code: 1001,
        name: 'INVALID_AUTH_TOKEN',
        msg: 'auth_token校验失败',
      },
      NO_RIGHTS_OPERATION: {
        // 您无权进行此操作
        code: 1001,
        name: 'NO_RIGHTS_OPERATION',
        msg: '您无权进行此操作',
      },
      HAS_LOGIN: {
        // 用户账号已登录
        code: 2000,
        name: 'HAS_LOGIN',
        msg: '用户账号已登录',
      },
      NOT_LOGIN: {
        // 非法auth_token
        code: 2001,
        name: 'NOT_LOGIN',
        msg: '用户账号未登录',
      },
      USER_EXIST: {
        // 用户已存在
        code: 2002,
        name: 'USER_EXIST',
        msg: '用户已存在',
      },
      USER_NOT_FOUND: {
        // 用户不存在
        code: 2003,
        name: 'USER_NOT_FOUND',
        msg: '用户不存在',
      },
      PASSWORD_ERROR: {
        // 账号密码错误
        code: 2004,
        name: 'PASSWORD_ERROR',
        msg: '账号密码错误',
      },
      HOUSE_NOT_FOUND: {
        // 账号密码错误
        code: 2005,
        name: 'HOUSE_NOT_FOUND',
        msg: '未找到相关房源信息',
      },
    },
  }

  return {
    ...config,
    ...userConfig,
  }
}
