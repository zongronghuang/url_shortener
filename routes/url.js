const express = require('express')
const router = express.Router()
const Url = require('../models/url.js')
const { generateKey } = require('../public/javascripts/generateKey.js')
const domain = 'http://localhost:3000/'

// 取回建立短網址的頁面
router.get('/', (req, res) => {
  res.render('index')
})

// 送出原始網址到 server 處理 + 記錄
router.post('/', (req, res, next) => {
  if (!req.body.originalUrl) {
    console.log('no empty url allowed!')
    res.render('index', {
      originalUrl: req.body.originalUrl,
      warning_msg: '網址不可為空白'
    })
  }
  next()
}, (req, res) => {
  Url.findOne({ originalUrl: req.body.originalUrl })
    .lean()
    .exec((err, url) => {
      if (err) return console.log('error', err)

      if (url) {
        // 如果 url 紀錄已存在於資料庫
        console.log('URL found in the database', url)

        return res.render('generated', {
          originalUrl: req.body.originalUrl,
          domain,
          shortUrlKey: url.shortUrlKey
        })
      } else {
        // 如果 url 紀錄不存在於資料庫
        // 檢查 key 是否和資料庫中的其他 key 重複
        let key = generateKey(5)

        const checkKey = () => {
          Url.findOne({ shortUrlKey: key })
            .lean()
            .exec((err, url) => {
              if (err) return console.log(err)

              console.log('check if there is repeated key')
              if (url) {
                console.log('make another key')
                return checkKey()
              }
            })
        }

        checkKey()

        const newUrlRecord = new Url({
          originalUrl: req.body.originalUrl,
          shortUrlKey: key
        })

        newUrlRecord.save(err => {
          if (err) return console.log(err)
          console.log('save a new url record')
          return res.render('generated', {
            originalUrl: req.body.originalUrl,
            domain,
            shortUrlKey: key
          })
        })

      }
    })
})


// 從 key 取回原來的網址，然後 redirect 到原來的網址
router.get('/:shortUrlKey', (req, res) => {
  // 略過 favicon.ico 的 request
  if (req.params.shortUrlKey !== 'favicon.ico') {
    Url.findOne({ shortUrlKey: req.params.shortUrlKey })
      .lean()
      .exec((err, url) => {
        if (err) return console.log(err)
        console.log('URL record fetched from the database', url)

        if (url) {
          res.redirect(`${url.originalUrl}`)
        } else {
          res.render('error')
        }
      })
  }
})

module.exports = router