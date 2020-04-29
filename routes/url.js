const express = require('express')
const router = express.Router()
const Url = require('../models/url.js')
const { generateKey } = require('../public/javascripts/generateKey.js')
const urlExist = require('url-exist')

// 依照執行環境，判斷 domain 名稱
let domain
if (process.env.NODE_ENV === 'production') {
  domain = 'https://mysimpleurlshortener.herokuapp.com/'
} else {
  domain = 'http://localhost:3000/'
}

// 取回建立短網址的頁面
router.get('/', (req, res) => {
  res.render('index')
})

// 送出原始網址到 server 處理 + 記錄
router.post('/', (req, res, next) => {
  // 確認網址是否存在在網路上
  const checkUrlExistence = async () => {
    const existence = await urlExist(req.body.originalUrl)
    return existence
  }

  checkUrlExistence()
    .then(existence => {
      // 網址欄位沒有輸入任何字元
      // 回傳錯誤訊息
      if (req.body.originalUrl.length === 0) {
        console.log('網址不可為空白')

        res.render('index', {
          originalUrl: req.body.originalUrl,
          warning_msg: '網址不可為空白'
        })
      } else {
        // 判斷輸入的網址是否存在
        // 網址不存在 => 回傳錯誤訊息
        // 網址存在 => 下個 middleware 再處理
        if (existence === false) {
          console.log('網址不存在')

          res.render('index', {
            originalUrl: req.body.originalUrl,
            warning_msg: '此網址不存在，無法建立短網址'
          })
        } else {
          console.log('網址存在')

          next()
        }
      }
    })
}, (req, res) => {
  Url.findOne({ originalUrl: req.body.originalUrl })
    .lean()
    .exec((err, url) => {
      if (err) return console.log('error', err)

      // 確認網址是否已經存在在資料庫
      // 資料庫內找得到 => 回傳已有資料
      // 資料庫內找不到 => 建立新紀錄
      if (url) {
        console.log('資料庫中已紀錄此網址', url)

        return res.render('generated', {
          originalUrl: req.body.originalUrl,
          domain,
          shortUrlKey: url.shortUrlKey
        })
      } else {
        // 建立新紀錄需要的 key
        // 確認 key 是否和資料庫中的其他 key 重複
        // 重複的話，再重新建 key
        let key = generateKey(5)

        const checkKey = () => {
          Url.findOne({ shortUrlKey: key })
            .lean()
            .exec((err, url) => {
              if (err) return console.log(err)

              if (url) {
                console.log('資料庫中發現重複的 key')

                return checkKey()
              }
            })
        }

        checkKey()

        // 建立新紀錄
        const newUrlRecord = new Url({
          originalUrl: req.body.originalUrl,
          shortUrlKey: key
        })

        // 將新紀錄存回至資料庫中
        newUrlRecord.save(err => {
          if (err) return console.log(err)
          console.log('儲存新紀錄到資料庫')

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
        console.log('從資料庫取回已有的紀錄', url)

        if (url) {
          res.redirect(`${url.originalUrl}`)
        } else {
          res.render('error')
        }
      })
  }
})

module.exports = router