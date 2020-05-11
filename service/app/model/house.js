'use strict'
const dayjs = require('dayjs')
module.exports = (app) => {
  const { STRING, INTEGER, DATE } = app.Sequelize
  // https://sequelize.org/master/class/lib/model.js~Model.html
  const House = app.model.define(
    'house',
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      location: { type: STRING, comment: '房源位置' },
      status: { type: STRING, comment: '房源状态' },
      owner: { type: STRING, comment: '房主信息' },
      floor: { type: STRING, comment: '楼栋' },
      roomNum: { type: STRING, comment: '房号' },
      roomLayout: { type: STRING, comment: '房型' },
      area: { type: STRING, comment: '房屋面积' },
      orientation: { type: STRING, comment: '房屋朝向' },
      rental: { type: STRING, comment: '出租价格' },
      price: { type: STRING, comment: '出售价格' },
      remarks: { type: STRING, comment: '备注信息' },
      imgUrl: { type: STRING, comment: '图片集合' },
      keywords: { type: STRING, comment: '关键字' },
      renovation: { type: STRING, comment: '装修状态' },
      followInfo: { type: STRING, comment: '跟进信息集合' },
      delFlag: {
        type: INTEGER,
        comment: '是否删除 0否 1是',
        defaultValue: 0,
      },
      createdAt: {
        type: DATE,
        get() {
          return dayjs(this.getDataValue('createTime')).valueOf()
        },
        comment: '房源创建时间',
      },
      updatedAt: {
        type: DATE,
        get() {
          return dayjs(this.getDataValue('updateTime')).valueOf()
        },
        comment: '房源更新时间',
      },
      deletedAt: {
        type: DATE,
        get() {
          return dayjs(this.getDataValue('deletedAt')).valueOf()
        },
        comment: '房源删除时间',
      },
    },
    {
      // Calling destroy will not delete the model,
      // but instead set a deletedAt timestamp if this is true. Needs timestamps=true to work
      paranoid: false,
      // Add underscored field to all attributes, this covers user defined attributes,
      // timestamps and foreign keys. Will not affect attributes with explicitly set field option
      underscored: false, // 下划线
    }
  )
  House.sync()
  return House
}
