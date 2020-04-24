const shortUrl = document.querySelector('#shortUrl')

shortUrl.addEventListener('click', () => {
  const input = document.createElement('input')

  input.value = shortUrl.textContent
  shortUrl.append(input)
  input.select()
  document.execCommand('copy')
  shortUrl.removeChild(input)
  console.log('url copied')
})