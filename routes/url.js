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
router.post('/', (req, res) => {
  Url.findOne({ originalUrl: req.body.originalUrl })
    .lean()
    .then((err, url) => {
      if (err) return console.log(err)

      if (url) {
        console.log('網址已存在於 DB')
        res.render('generated', {
          originalUrl: req.body.originalUrl,
          domain,
          shortUrlKey: url.shortUrlKey
        })
      } else {
        console.log('網址不存在於 DB')
        return '確認新連結是否存在'
      }
    })
    .then(message => {
      console.log('階段任務：', message)

      let result
      const checkUrlExistence = async function () {
        result = await urlExist(req.body.originalUrl)

        if (result) {
          console.log('網址存在!')

          let key = generateKey(5)

          const keyQuery = Url.findOne({ shortUrlKey: key })
            .lean()
            .exec((err, url) => {
              if (url) {
                console.log('DB 中發現重複的 key')
                return keyQuery
              } else {
                console.log('這是獨一無二的 key')

                const newUrl = new Url({
                  originalUrl: req.body.originalUrl,
                  shortUrlKey: key
                })

                newUrl.save(err => {
                  if (err) return console.log(err)
                  return res.render('generated', {
                    originalUrl: req.body.originalUrl,
                    domain,
                    shortUrlKey: key
                  })
                })
              }
            })
        } else {
          console.log('網址不存在')
          res.render('index', {
            originalUrl: req.body.originalUrl,
            warning_msg: '輸入的網址不存在'
          })
        }
      }

    })
    .catch(error => console.log(error))
  // .exec((err, url) => {
  //   if (err) return console.log('error', err)

  //   // 確認輸入的網址是否存在在網路上
  //   let existence

  //   (async () => {
  //     existence = await urlExist(req.body.originalUrl)

  //     console.log('existence', existence)

  //     if (existence) {
  //       // URL 活在網路上
  //       console.log('URL alive!')

  //       if (url) {                            // 如果 url 紀錄已存在於資料庫
  //         console.log('URL found in the database', url)

  //         res.locals.shortUrlKey = url.shortUrlKey

  //         return res.render('generated', {
  //           originalUrl: req.body.originalUrl,
  //           domain,
  //           shortUrlKey: res.locals.shortUrlKey
  //         })
  //       } else {                              // 如果 url 紀錄不存在於資料庫
  //         // // 檢查 key 是否和資料庫中的其他 key 重複
  //         // let key = generateKey(5)
  //         // let keyCheck = true
  //         // while (keyCheck) {
  //         //   Url.findOne({ shortUrlKey: key }, (err, url) => {
  //         //     console.log('in the while loop')
  //         //     if (err) return console.log(err)

  //         //     if (url) {
  //         //       console.log('Repeated key found!')
  //         //       key = generateKey(5)
  //         //     } else {
  //         //       keyCheck = false
  //         //     }
  //         //   })
  //         // }

  //         const newUrlRecord = new Url({
  //           originalUrl: req.body.originalUrl,
  //           shortUrlKey: generateKey(5)
  //         })

  //         res.locals.shortUrlKey = newUrlRecord.shortUrlKey

  //         newUrlRecord.save(err => {
  //           if (err) return console.log(err)
  //           return res.render('generated', {
  //             originalUrl: req.body.originalUrl,
  //             domain,
  //             shortUrlKey: res.locals.shortUrlKey
  //           })
  //         })
  //       }
  //     } else {
  //       // URL 不存在在網路上
  //       console.log('DEAD URL!')
  //       return res.render('index', {
  //         originalUrl: req.body.originalUrl,
  //         warning_msg: '輸入的網址不存在'
  //       })
  //     }
  //   })()
  // })
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