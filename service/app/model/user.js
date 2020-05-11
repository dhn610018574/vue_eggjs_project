'use strict'
const dayjs = require('dayjs')
module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize
  const User = app.model.define(
    'users',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: STRING, comment: '登录账号' },
      password: { type: STRING, comment: '登录密码' },
      type: { type: INTEGER, comment: '账号类型' },
      delFlag: { type: INTEGER, comment: '账号删除状态 0未冻结 1已冻结' },
      createdAt: {
        type: DATE,
        get() {
          return dayjs(this.getDataValue('createdAt')).valueOf()
        },
        comment: '账号创建时间',
      },
      updatedAt: {
        type: DATE,
        get() {
          return dayjs(this.getDataValue('updatedAt')).valueOf()
        },
        comment: '账号更新时间',
      },
      deletedAt: {
        type: DATE,
        get() {
          return dayjs(this.getDataValue('deletedAt')).valueOf()
        },
        comment: '账号删除时间',
      },
    },
    {
      paranoid: false,
      underscored: false,
    }
  )
  User.sync()
  return User
}
