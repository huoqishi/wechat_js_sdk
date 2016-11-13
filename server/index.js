'use strict'
const express = require('express')
const bodyParser = require('body-parser')
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
// wechat
app.get('/wechat/index', (req, res) => {
    console.log('开始验证!!!!')
    res.send(req.query.echostr)
})

app.use('/wechat/index', (req, res) => {
  console.log('有人过来了!!')
    parser.parseString(req.body, function(err, result) {
        // 交换fromusername 与tousername
        let tmp =  result.FromUserName
        result.FromUserName = result.ToUserName
        result.ToUserName = tmp

        // 设置返回给用户的消息内容
        result.Content = Math.random()
        // result.FromUserName = [result.ToUserName, result.ToUserName = result.FromUserName][0]
        
        // 将json形式对象转换为xml格式字符串
        let sendMsg = builder.buildObject(result)  
        console.log(sendMsg)
        res.send(sendMsg)
    })
})
app.listen(80)
