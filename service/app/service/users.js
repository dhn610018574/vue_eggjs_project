'use strict'

const Service = require('egg').Service

class Users extends Service {
  async create(user) {
    const { ctx, app } = this
    const [userInstance, isNew] = await ctx.model.User.findOrCreate({
      where: {
        username: user.username,
      },
      defaults: user,
    })
    if (!isNew) {
      const { USER_EXIST } = app.config.errors
      const err = new Error()
      Object.assign(err, USER_EXIST)
      throw err
    }
    return userInstance
  }
  async findOne(username) {
    const { ctx } = this
    const userInstance = await ctx.model.User.findOne({
      where: {
        username,
      },
    })
    return userInstance
  }
  async findById(id) {
    const { ctx } = this
    const user = await ctx.model.User.findOne({
      where: {
        id,
      },
    })
    if (!user) {
      const { USER_NOT_FOUND } = this.config.errors
      ctx.helper.$fail(USER_NOT_FOUND.code, USER_NOT_FOUND.msg)
      return
    }
    await user.destroy()
    ctx.helper.$success()
    return user
  }
  // 创建或更新用户信息
  async createOrUpdate(userInfo) {
    const { ctx } = this
    const [userInfoInstance, isNew] = await ctx.model.User.findOrCreate({
      where: {
        id: userInfo.id,
      },
      defaults: userInfo,
    })
    if (!isNew) {
      // 巨坑，update方法必须要有options where选项
      return await ctx.model.User.update(userInfo, {
        where: {
          id: userInfo.id,
        },
        defaults: userInfo,
      })
    }
    return userInfoInstance
  }
  // 查询可用所有用户
  async findAll() {
    const { ctx } = this
    const users = await ctx.model.User.findAll()
    return users
  }
}

module.exports = Users
