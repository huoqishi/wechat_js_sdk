const express = require('express')
const bodyParse = require('body-parser')
const app = express()


app.use(bodyParser.urlencoded({ extended: false }))

// Get 
// wechat
app.get('/test',(req, res) => {
  res.send(req.body.echostr)
})

app.liste(3000)