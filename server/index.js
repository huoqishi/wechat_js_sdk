'use strict'
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

// 转换xmltojs
const parseString= require('xml2js').xml2js


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
    // let dt
    // req.on('data', data =>{
    //   dt = data.toString('utf-8')
    // })
    // req.on('end', ()=>{
    //   console.log(dt)
    // })
    console.log('有请求过来了')
        // console.log(req.query)
    console.log(req.body)
    parseString(req.body, function(err, result) {
        console.dir(result);
    });
})

app.listen(80)
