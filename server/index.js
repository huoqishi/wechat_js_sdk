const express = require('express')
const bodyParser = require('body-parser')
const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('../client'))

// Get 
// wechat
app.get('/wechat/valid',(req, res) => {
  console.log('开始验证!!')
  res.send(req.body.echostr)
})

app.listen(80)