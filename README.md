# 短網址產生器

---

**短網址產生器** 為 Node.js 全端網頁應用程式，能為輸入的網址建立可重複利用的短網址。使用者可透過短網址存取目的地網頁。

採用 Node.js、Express、Handlebars、MongoDB (Mongoose)、Sass 及 Bootstrap 技術。部署於 Heroku。

Demo：[https://makeurlsimple.herokuapp.com/](https://makeurlsimple.herokuapp.com/)

<img src="/Demo.png" width="500">

## 建立 MongoDB 環境

- 必須先在個人電腦上安裝及執行 MongoDB。在此專案中，MongoDB 負責儲存短網址相關資料。

## 安裝專案

---

若要執行此專案，請在 console 內執行下列步驟：

1. 從 GitHub 下載此專案：

```
git clone https://github.com/zongronghuang/url_shortener.git url_shortener
```

2. 前往 **url_shortener** 資料夾。

3. 透過 console 安裝下列相依套件：

```
    npm install
```

4. 啟動本地伺服器：

```
    npm run start
```

5. 開啟網路瀏覽器並輸入下列網址：

```
    localhost:3000
```

6. 現在您已可以開始使用此專案。

## 使用說明

---

- 在空白欄位中輸入網址，即可建立短網址。依據網址特性，會有不同的回應：

  - 存在且未建立過短網址的網址：建立短網址
  - 曾經建立過短網址的網址：從資料庫中取回已有的短網址
  - 不存在的網址或空白：不建立短網址並出現提示訊息

- 產生短網址後，按一下**複製**即可複製短網址使用。

- 在瀏覽器網址列中輸入短網址，即可導向對應的網頁。

- 如果輸入錯誤的短網址，則會導向錯誤頁面。

- 提供英文及繁體中文介面：按一下工作列中的語言清單，即可切換介面顯示語言。

---

<a class="anchor" id="1">1</a>: 此專案及所有內容皆作為學習用途，並無侵犯著作權之意圖。
