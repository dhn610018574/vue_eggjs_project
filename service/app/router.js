'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller, middleware } = app
  const auth_token_check = middleware.checkAuthToken({}, app)
  router.post('/api/signup', controller.api.users.signup)
  router.post('/api/login', controller.api.users.login)
  router.post('/api/logout', auth_token_check, controller.api.users.logout)
  router.post('/api/update', auth_token_check, controller.api.users.updatePwd)
  router.get('/api/userList', auth_token_check, controller.api.users.userList)
  router.post('/api/userDelete', auth_token_check, controller.api.users.userDelete)
  // 房源信息
  router.post('/api/houseAdd', auth_token_check, controller.api.house.houseAdd)
  router.post(
    '/api/houseList',
    auth_token_check,
    controller.api.house.houseList
  )
  router.post(
    '/api/houseUpdate',
    auth_token_check,
    controller.api.house.houseUpdate
  )
  router.post(
    '/api/houseDelete',
    auth_token_check,
    controller.api.house.houseDelete
  )
  router.post(
    '/api/uploadImgs',
    controller.api.uploader.uploadImgs
  )
}
