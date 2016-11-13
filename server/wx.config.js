'use strict'
// 微信所需要的一些配置

const http = require('http')
const request = require('request')
const qs = require('querystring');

app.APPID = 'wx15abca5df4cf07e9'
const APPSECRET = 'c65b79d54e6da0667fda63c8f09920a6'

// 从微信服务器获取的access_token,每7200秒要重新获取一次
let Access_Token = {
    "access_token": "KmJmuLA_qGSeENRRj-SxjMP5WQhRLBVnZsaYVAnmlYK5M8vDgetwbacBPlZGtP280Qgr0vuFLGpZCeFQBHwWBo1rrVjrK_AQE_Bef_TV7MmLwyGmoht44m5JqhpjHvv3DHFaAAAHLJ",
    "expires_in": 7200,
    "access_time": Date.now()
}

/**
* 没
*/
let Jsapi_Ticket = {
    "ticket": "sM4AOVdWfPE4DxkXGEs8VNNQ7h8gx-oOFWZSc854qNCGJUCIRdHF56kcCbe_ZeurzWloch_4AXPKxEkNP9ZZ6w",
    "expires_in": 7200,
    "access_time": Date.now()
}

const app = {}
    // 
    // let 

// 1.获取 access_token
// 备注:ccess_token的有效期目前为2个小时，需定时刷新，重复获取将导致上次获取的access_token失效。
app.getAccess_Token = (callback) => {
    // 判断 access_token是否过期
    const td = Date.now() - Access_Token.access_time
    if (td/1000 < Access_Token.expires_in) {
        return callback(Access_Token.access_token)
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
        callback(body.access_token)
    })
}

// 2.获取 jsapi_ticket, 有效时间也只有7200秒
app.getJsapi_Ticket = (callback) => {
    // 判断 jsapi_ticket是否过期
    const td = Date.now() - Jsapi_Ticket.access_time
    if(td/1000 < Jsapi_Ticket.expires_in){
      return callback(Jsapi_Ticket.ticket)
    }

    // 获取 jsapi_ticket
    const arg = {
        access_token: '',
        type: 'jsapi'
    }
    app.getAccess_Token((access_token) => {
        arg.access_token = access_tokens
        // 获取jsapi_ticket
        const url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?' + qs.stringify(arg)
        request(url, (err, res, body) => {
            Jsapi_Ticket.ticket = body.ticket
            Jsapi_Ticket.expires_in = body.expires_in
            Jsapi_Ticket.access_time = Date.now()
            callback(Jsapi_Ticket.ticket)
        })
    })
}
