'use strict'
const Controller = require('egg').Controller
const rule = {
  id: { type: 'number', required: true },
  delFlag: { type: 'number', required: false },
  location: { type: 'string', required: false },
  status: { type: 'string', required: false },
  owner: { type: 'string', required: false },
  floor: { type: 'string', required: false },
  roomNum: { type: 'string', required: false },
  roomLayout: { type: 'string', required: false },
  area: { type: 'string', required: false },
  orientation: { type: 'string', required: false },
  rental: { type: 'string', required: false },
  price: { type: 'string', required: false },
  remarks: { type: 'string', required: false },
  imgUrl: { type: 'string', required: false },
  keywords: { type: 'string', required: false },
  renovation: { type: 'string', required: false },
  followInfo: { type: 'string', required: false },
}
// 房源信息
class HouseController extends Controller {
  // 房源列表
  async houseList() {
    const { ctx } = this
    ctx.validate(
      {
        location: rule.location,
        status: rule.status,
        owner: rule.owner,
        rental: rule.rental,
        renovation: rule.renovation,
        price: rule.price,
        followInfo: rule.followInfo,
      },
      ctx.request.body
    )
    const queryParams = ctx.request.body || {}
    const houeInstance = await ctx.service.house.findAll(queryParams)
    ctx.helper.$success(houeInstance)
  }
  // 房源新增
  async houseAdd() {
    const { ctx } = this
    ctx.validate(
      {
        location: rule.location,
        status: rule.status,
        owner: rule.owner,
        floor: rule.floor,
        roomNum: rule.roomNum,
        roomLayout: rule.roomLayout,
        area: rule.area,
        orientation: rule.orientation,
        rental: rule.rental,
        price: rule.price,
        remarks: rule.remarks,
        imgUrl: rule.imgUrl,
        keywords: rule.keywords,
        renovation: rule.renovation,
        followInfo: rule.followInfo,
      },
      ctx.request.body
    )
    const houseInfo = ctx.request.body || {}
    if (JSON.stringify(houseInfo) === '{}') {
      const { INVALID_PARAM } = this.config.errors
      ctx.helper.$fail(INVALID_PARAM.code, INVALID_PARAM.msg)
      return
    }
    // 调用service层处理数据
    const houseInstance = await ctx.service.house.create(houseInfo)
    ctx.helper.$success(houseInstance)
  }
  // 房源修改
  async houseUpdate() {
    const { ctx } = this
    ctx.validate(
      {
        id: rule.id,
        location: rule.location,
        status: rule.status,
        owner: rule.owner,
        floor: rule.floor,
        roomNum: rule.roomNum,
        roomLayout: rule.roomLayout,
        area: rule.area,
        orientation: rule.orientation,
        rental: rule.rental,
        price: rule.price,
        remarks: rule.remarks,
        imgUrl: rule.imgUrl,
        keywords: rule.keywords,
        renovation: rule.renovation,
        followInfo: rule.followInfo,
      },
      ctx.request.body
    )
    const addInfo = ctx.request.body || {}
    await ctx.service.house.findOne(addInfo)
    ctx.helper.$success()
  }
  // 房源删除
  async houseDelete() {
    const { ctx } = this
    ctx.validate(
      {
        id: rule.id,
      },
      ctx.request.body
    )
    await ctx.service.house.findById(ctx.request.body.id)
  }
}
module.exports = HouseController
