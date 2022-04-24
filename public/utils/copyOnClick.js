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

  if (lang === 'en') {
    copyBtn.textContent = 'Copied!'
  }

  if (lang === 'zh') {
    copyBtn.textContent = '已複製！'
  }
})



