const express = require('express')
const bodyParser = require('body-parser')
const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('../client'))

// Get 
// wechat
app.get('/wechat/index', (req, res) => {
  console.log('开始验证!!!!')
  res.send(req.query.echostr)
})
app.post('/wechat/index', (req, res) => {
  console.log(req.body)
})

app.listen(80)