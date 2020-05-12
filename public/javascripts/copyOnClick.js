const shortUrl = document.querySelector('#shortUrl')
const copyBtn = document.querySelector('#copy')
const lang = document.documentElement.lang

copyBtn.addEventListener('click', () => {
  const input = document.createElement('input')

  input.value = shortUrl.textContent
  shortUrl.append(input)
  input.select()
  document.execCommand('copy')
  shortUrl.removeChild(input)
  console.log('已複製短網址')

  // const path = `../../ui_strings/${lang}.json`
  // console.log('path', path)
  // const json = require(path)
  // const ui = JSON.parse(json).app
  // copyBtn.textContent = ui.copied
})
