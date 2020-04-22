const express = require('express')
const router = express.Router()

// 取回建立短網址的頁面
router.get('/', (req, res) => {
  res.send('landing page')
})

// 送出原始網址到 server 處理
router.post('/', (req, res) => {
  res.send('post request')
})

// 取回建立的短網址
router.get('/generated', (req, res) => {
  res.send('show generated urls')
})

module.exports = router