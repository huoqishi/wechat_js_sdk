'use strict'
// 微信所需要的一些配置

const http = require('http')
const request = require('request')
const fs = require('fs')
const qs = require('querystring');

// 启动时读取配置文件,access_token 及 jsapi_ticket
const wxConfig = require('./wx.config.json')

const app = {}
app.APPID = 'wx15abca5df4cf07e9'

// 
const APPSECRET = 'c65b79d54e6da0667fda63c8f09920a6'

// 从微信服务器获取的access_token,每7200秒要重新获取一次
let Access_Token = wxConfig.access_token

/**
 * 没
 */
let Jsapi_Ticket = wxConfig.jsapi_ticket

// 
// let 

// 1.获取 access_token
// 备注:ccess_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。
app.getAccess_Token = (callback) => {
    // 判断 access_token是否过期
    const td = Date.now() - Access_Token.access_time
    if (td / 1000 < Access_Token.expires_in) {
        callback(Access_Token.access_token)
            // return Access_Token.access_token
    }
    // 重新获取 access_token
    const arg = {
        grant_type: 'client_credential',
        appid: app.APPID,
        secret: APPSECRET
    }
    const url = 'https://api.weixin.qq.com/cgi-bin/token?' + qs.stringify(arg)
    request(url, (err, res, body) => {
        body = JSON.parse(body)
        Access_Token.access_token = body.access_token
        Access_Token.expires_in = body.expires_in
        Access_Token.access_time = Date.now()
        // 新获取的写入配置文件，或者保存到数据库中
        const tmp = JSON.stringify(wxConfig)
        console.log(tmp)
        fs.writeFile('./wx.config.json', tmp,function(err,ff){
          // console.log('-----file')
          if(err) return console.log(err)
            // console.log(ff)
        })
        callback(body.access_token)
    })
}

// 2.获取 jsapi_ticket, 有效时间也只有7200秒
app.getJsapi_Ticket = (callback) => {
    // 判断 jsapi_ticket是否过期
    const td = Date.now() - Jsapi_Ticket.access_time
    if (td / 1000 < Jsapi_Ticket.expires_in) {
        return callback(Jsapi_Ticket.ticket)
    }

    // 获取 jsapi_ticket
    const arg = {
        access_token: '',
        type: 'jsapi'
    }

    app.getAccess_Token((at) => {
        arg.access_token = at
            // 获取jsapi_ticket
        const url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?' + qs.stringify(arg)
        request(url, (err, res, body) => {
            Jsapi_Ticket.ticket = body.ticket
            Jsapi_Ticket.expires_in = body.expires_in
            Jsapi_Ticket.access_time = Date.now()
                // 新获取的写入配置文件，或者保存到数据库中
            fs.writeFile('./wx.config.json', JSON.stringify(wxConfig))
            callback(Jsapi_Ticket.ticket)
        })
    })
}
module.exports = app
