'use strict'
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

module.exports = (options, app) => {
  return async function checkAuthToken(ctx, next) {
    const authToken = ctx.request.headers.authorization
    if (authToken) {
      const res = checkToken(authToken)
      const { username } = res
      if (username) {
        const sessionToken = await ctx.session.token
        if (authToken === sessionToken) {
          ctx.username = username // 保存到上下文，方便后续使用
          await next()
        } else {
          // auth_token不合法
          const { INVALID_AUTH_TOKEN } = ctx.app.config.errors
          ctx.helper.$fail(
            INVALID_AUTH_TOKEN.code,
            '您的登录状态异常，请重新登录'
          )
        }
      } else {
        const { HAS_LOGIN } = ctx.app.config.errors
        ctx.helper.$fail(HAS_LOGIN.code, '您的登录状态已过期，请重新登录')
      }
    } else {
      const { NOT_LOGIN } = ctx.app.config.errors
      ctx.helper.$fail(NOT_LOGIN.code, '您还未登录，请登录后再操作')
    }
  }
}

function checkToken(token) {
  const sercetKey = fs.readFileSync(
    path.join(__dirname, '../../keys/rsa_public_key.pem')
  ) // 获取公钥
  let res = ''
  try {
    const result = jwt.verify(token, sercetKey, { algorithms: ['RS256'] }) || {}
    const { exp } = result
    const current = Math.floor(Date.now() / 1000)
    if (current < exp) {
      res = result.data || {}
    }
  } catch (error) {
    throw error
  }
  return res
}
