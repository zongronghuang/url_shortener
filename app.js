const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/url',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
)

// 連線至 mongodb
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
})

// 設定 view engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
})
)

app.set('view engine', 'handlebars')

// 指定靜態資料夾
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))


// 導入多國語字串
app.use((req, res, next) => {
  if (req.originalUrl !== '/favicon.ico') {
    let json
    let lang = req.query.lang || app.locals.lang

    // 不同語言導入不同的 JSON 檔
    if (lang === 'zh') {
      json = require('./ui_strings/zh.json')
      app.locals.lang = 'zh'
    } else {
      json = require('./ui_strings/en.json')
      app.locals.lang = 'en'
    }

    // JSON 轉成字串
    const ui = JSON.stringify(json)

    // JSON 轉成 JavaScript 物件
    app.locals.ui = JSON.parse(ui).app

    next()
  }
})

// 分流路由
app.use('/', require('./routes/url.js'))

// 監聽 server 啟動狀態
app.listen(process.env.PORT || port, (req, res) => {
  console.log(`Server up and running at http://localhost:${port}`)
})