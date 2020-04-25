const express = require('express')
const router = express.Router()
const Url = require('../models/url.js')
const { generateKey } = require('../public/javascripts/generateKey.js')
const domain = 'http://localhost:3000/'
const urlExist = require('url-exist')

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

      // 確認輸入的網址是否存在在網路上
      let existence

      (async () => {
        existence = await urlExist(req.body.originalUrl)

        console.log('existence', existence)

        if (existence) {
          // URL 活在網路上
          console.log('URL alive!')

          if (url) {                            // 如果 url 紀錄已存在於資料庫
            console.log('URL found in the database', url)

            res.locals.shortUrlKey = url.shortUrlKey

            return res.render('generated', {
              originalUrl: req.body.originalUrl,
              domain,
              shortUrlKey: res.locals.shortUrlKey
            })
          } else {                              // 如果 url 紀錄不存在於資料庫
            const key = generatedKey(5)

            // 檢查 key 是否已被別的網址使用 


            const newUrlRecord = new Url({
              originalUrl: req.body.originalUrl,
              shortUrlKey: generateKey(5)
            })

            res.locals.shortUrlKey = newUrlRecord.shortUrlKey

            newUrlRecord.save(err => {
              if (err) return console.log(err)
              return res.render('generated', {
                originalUrl: req.body.originalUrl,
                domain,
                shortUrlKey: res.locals.shortUrlKey
              })
            })
          }
        } else {
          // URL 不存在在網路上
          console.log('DEAD URL!')
          return res.render('index', {
            originalUrl: req.body.originalUrl,
            warning_msg: '輸入的網址不存在'
          })
        }
      })()
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