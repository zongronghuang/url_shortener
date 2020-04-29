const shortUrl = document.querySelector('#shortUrl')
const copyBtn = document.querySelector('#copy')

copyBtn.addEventListener('click', () => {
  const input = document.createElement('input')

  input.value = shortUrl.textContent
  shortUrl.append(input)
  input.select()
  document.execCommand('copy')
  shortUrl.removeChild(input)
  console.log('已複製短網址')
  copyBtn.textContent = '已複製'
})