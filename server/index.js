'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const wxConfig = require('./wx.config.js')
const sha1 = require('sha1')
const app = express()

// 转换xmltojs
const xml2js = require('xml2js')

const builder = new xml2js.Builder() // json -> xml
const parser = new xml2js.Parser() // xml -> json
    // console.log(xml2js)


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(bodyParser.text({ type: 'text/xml' }))
app.use(express.static('../client'))

// Get 
// 认证
app.get('/wechat/index', (req, res) => {
    console.log('开始验证!!!!')
    res.send(req.query.echostr)
})

// Post
// 微信会将所有的消息通过这个地址发送过来
app.post('/wechat/index', (req, res) => {
    console.log('有人过来了!!')
    console.log(req.body)
    parser.parseString(req.body, function(err, result) {
        console.log(result)
            // 交换fromusername 与tousername
        let tmp = result.xml.FromUserName
        result.xml.FromUserName = result.xml.ToUserName
        result.xml.ToUserName = tmp
        result.xml.CreateTime = Date.now()

        // 设置返回给用户的消息内容
        result.xml.Content = Math.random()
            // result.FromUserName = [result.ToUserName, result.ToUserName = result.FromUserName][0]

        // 将json形式对象转换为xml格式字符串
        let sendMsg = builder.buildObject(result)
        console.log(22)
        console.log(sendMsg.split('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')[1])
        res.send(sendMsg.split('<?xml version="1.0" encoding="UTF-8" standalone="yes"?>')[1])
    })
})

// Get
// 获取使用js-sdk需要的相关数据
app.get('/wechat/ticket', (req, res) => {
    console.log('有人调用了!')
    wxConfig.getJsapi_Ticket( ticket => {
      // const ticket = ticket
      const nonceStr = 'SuiJiZiFuChuang'
      const timestamp = parseInt(Date.now()/1000)
      const url = 'http://wechat.huoqishi.net/index.html'
      const appid = wxConfig.APPID
      // 加密
      const str = 'jsapi_ticket=' + ticket + '&noncestr=' + nonceStr + '&timestamp=' + timestamp + '&url=' + url;
      const signature = sha1(str)
      console.log(signature)
      // signature，timestamp, appid, nonceStr

      const result = {
        timestamp,
        nonceStr,
        appid,
        signature
      }
      // 返回数据，让微信进行加密！
      res.json(result)

    })
})

app.listen(80)
