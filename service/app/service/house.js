'use strict'
const Service = require('egg').Service
class HouseService extends Service {
  // 新增房源信息
  async create(houseInfo) {
    const { ctx } = this
    const houseInstance = await ctx.model.House.create(houseInfo)
    return houseInstance
  }
  // 分页查询房源信息列表
  async findAll(queryParams) {
    const { ctx, app } = this
    const Op = app.Sequelize.Op
    // const { lte, like } = Op
    const page = queryParams.page || 1
    const size = queryParams.size || 10
    const where = {
      delFlag: 0,
      location: queryParams.location,
      status: queryParams.status,
      renovation: queryParams.renovation,
      owner: {
        [Op.like]: `%${queryParams.owner}%`,
      },
      followInfo: {
        [Op.like]: `%${queryParams.followInfo}%`,
      },
      rental: {
        [Op.lte]: ctx.helper.toInt(queryParams.rental),
      },
      price: {
        [Op.lte]: ctx.helper.toInt(queryParams.price),
      },
    }
    for (let key in where) {
      const val = where[key]
      if (typeof val === 'null' || typeof val === 'undefined' || !val) {
        delete where[key]
      }
      if (!queryParams.owner) {
        delete where['owner']
      }
      if (!queryParams.followInfo) {
        delete where['followInfo']
      }
      if (!queryParams.rental) {
        delete where['rental']
      }
      if (!queryParams.price) {
        delete where['price']
      }
    }
    const query = {
      where,
      order: [
        ['updatedAt', 'desc'],
        ['rental', 'desc'],
        ['price', 'desc'],
      ],
      limit: size,
      offset: (page - 1) * size,
    }
    const all = await ctx.model.House.findAll({
      where: {
        delFlag: 0,
      },
    })
    const { rows: result } = await ctx.model.House.findAndCountAll(query)
    return { result, count: all.length, page, size }
  }
  // 查找更新
  async findOne(addInfo) {
    const { ctx } = this
    const addInfoInstance = await ctx.model.House.findOne({
      where: {
        id: addInfo.id,
      },
      defaults: addInfo,
    })
    if (!addInfoInstance) {
      const { HOUSE_NOT_FOUND } = this.config.errors
      ctx.helper.$fail(HOUSE_NOT_FOUND.code, HOUSE_NOT_FOUND.msg)
      return
    }
    const info = await ctx.model.House.update(addInfo, {
      where: {
        id: addInfoInstance.id,
      },
    })
    return info
  }
  async findById(id) {
    const { ctx } = this
    const house = await ctx.model.House.findOne({
      where: {
        id,
        delFlag: 0,
      },
    })
    if (!house) {
      const { HOUSE_NOT_FOUND } = this.config.errors
      ctx.helper.$fail(HOUSE_NOT_FOUND.code, HOUSE_NOT_FOUND.msg)
      return
    }
    await house.destroy()
    ctx.helper.$success()
  }
}

module.exports = HouseService
