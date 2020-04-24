const express = require('express')
const router = express.Router()
const Url = require('../models/url.js')
const domain = 'http://localhost:3000/'

// 產出大小寫英數字元組成的 key
function generateKey(keyLength) {
  const characters = []
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

  // 隨機生成 key
  for (let l = 0; l < keyLength; l++) {
    const index = Math.floor(Math.random() * characters.length)
    key.push(characters[index])
  }

  return key.join('')
}


// 取回建立短網址的頁面
router.get('/', (req, res) => {
  res.render('index')
})

// 送出原始網址到 server 處理 + 記錄
router.post('/', (req, res, next) => {
  Url.findOne({ originalUrl: req.body.originalUrl })
    .lean()
    .exec((err, url) => {
      if (err) return console.log(err)

      console.log('url', url)
      if (url) {                            // 如果 url 已存在於資料庫
        console.log('found old url')
        console.log('url object', url)
        console.log('url short key', url.shortUrlKey)
        res.locals.shortUrlKey = url.shortUrlKey

        return res.render('generated', {
          originalUrl: res.locals.originalUrl,
          domain,
          shortUrlKey: res.locals.shortUrlKey
        })
      } else {                              // 如果 url 不存在於資料庫
        const newUrlRecord = new Url({
          originalUrl: req.body.originalUrl,
          shortUrlKey: generateKey(5)
        })

        res.locals.shortUrlKey = newUrlRecord.shortUrlKey

        newUrlRecord.save(err => {
          if (err) return console.log(err)
          return res.render('generated', {
            originalUrl: res.locals.originalUrl,
            domain,
            shortUrlKey: res.locals.shortUrlKey
          })
        })
      }
    })
})


// redirect 到原來的網址
router.get('/:key', (req, res) => {
  res.send('get original url')
})




module.exports = router