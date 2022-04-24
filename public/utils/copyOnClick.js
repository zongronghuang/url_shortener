const shortUrl = document.querySelector("#shortUrl");
const copyBtn = document.querySelector("#copy");
const lang = document.documentElement.lang;

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shortUrl.textContent);
    console.log("已複製短網址");

    if (lang === "en") {
      copyBtn.textContent = "Copied!";
    }

    if (lang === "zh") {
      copyBtn.textContent = "已複製！";
    }
  } catch (error) {
    console.log(`[Copy error] ${error}`);
  }
});
