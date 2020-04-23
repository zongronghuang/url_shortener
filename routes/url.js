const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Url = require('../models/url.js')
const shortUrlDomain = 'https://app.com/'

// 產出五碼 key (大小寫英數字元)
function generateKey() {
  const characters = []
  const keyLength = 5
  const key = []

  // characters 陣列放入 0-9, A-Z, a-z
  for (let i = 0; i <= 9; i++) {
    characters.push(i)
  }

  for (let j = 65; j <= 90; j++) {
    characters.push(String.fromCharCode(j))
  }

  for (let k = 97; k <= 122; k++) {
    characters.push(String.fromCharCode(k))
  }

  // 隨機生成五碼 key
  for (let l = 0; l < keyLength; l++) {
    const index = Math.floor(Math.random() * characters.length)
    key.push(characters[index])
  }

  return key.join(' ')
}



// 取回建立短網址的頁面
router.get('/', (req, res) => {
  res.render('index')
})

// 送出原始網址到 server 處理
router.post('/', (req, res) => {
  const originalUrl = req.body.originalUrl

  Url.findOne({ originalUrl: originalUrl })
    .then(url => {
      if (url) {
        res.render('/generated', {
          originalUrl,
          shortUrlKey,
          shortUrl: shortUrlDomain + shortUrlKey
        })
      } else {
        const newUrlKey = new Url({
          originalUrl,
          shortUrlKey: generateKey()
        })

        newUrlKey.save()
          .then(url => {
            res.render('/', {
              originalUrl,
              shortUrlKey,
              shortUrl: shortUrlDomain + shortUrlKey
            })
          })

      }
    })




})

// 取回建立的短網址
router.get('/generated', (req, res) => {
  res.render('generated')
})

// redirect 到原來的網址
router.get('/:key', (req, res) => {
  res.send('get original url')
})

module.exports = router