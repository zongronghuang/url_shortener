import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import routes from "./routes/url.js";
import { createRequire } from "module";

const app = express();
const port = 3000;

/**
 * Node.js 採用 ES6 module 時，無法直接用 import/export 引入 JSON 檔案
 * => 透過 createRequire() 建立 require 方法
 * => 用 require 引入 JSON 檔案
 *
 * Node.js 在 ES6 module 模式下可以使用 CommonJS require() (要在 Package.json 中加入 "type": "module")
 * 不過，在 CommonJS 模式下，不能使用 ES6 module 的 import/export 語法
 */
const require = createRequire(import.meta.url);
const chtStrings = require("./assets/ui_strings/zh.json");
const enuStrings = require("./assets/ui_strings/en.json");

// mongodb 設定
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/url", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// 連線至 mongodb
const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error");
});
db.once("open", () => {
  console.log("mongodb connected");
});

// 設定 view engine
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

// 設定 Express
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// 導入多國語字串
app.use((req, res, next) => {
  if (req.originalUrl !== "/favicon.ico") {
    let json;
    let lang = req.query.lang || app.locals.lang;

    // 不同語言導入不同的 JSON 檔
    if (lang === "zh") {
      // json = require("./ui_strings/zh.json");
      json = chtStrings;
      app.locals.lang = "zh";
    } else {
      // json = require("./ui_strings/en.json");
      json = enuStrings;
      app.locals.lang = "en";
    }

    app.locals.ui = json.app;

    next();
  }
});

// 路由進入點
app.use("/", routes);

// 監聽 server 啟動狀態
app.listen(process.env.PORT || port, (req, res) => {
  console.log(`Server up and running at http://localhost:${port}`);
});
