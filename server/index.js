const express = require('express')
const bodyParser = require('body-parser')
const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('../client'))

// Get 
// wechat
app.get('/test',(req, res) => {
  res.send(req.body.echostr)
})

app.listen(80)