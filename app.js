const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const flash = require('connect-flash')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/record',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
)

const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error')
})
db.once('open', () => {
  console.log('mongodb connected')
})

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))

// 分流路由
app.use('/', require('./routes/url.js'))

// 監聽 server 啟動狀態
app.listen(port, (req, res) => {
  console.log(`Server up and running at http://localhost:${port}`)
})