// 產出大小寫英數字元組成的 key
// key 長度自訂
function generateKey(keyLength) {
  const characters = [];
  const key = [];

  // characters 陣列放入 0-9, A-Z, a-z
  for (let i = 0; i <= 9; i++) {
    characters.push(i);
  }

  for (let j = 65; j <= 90; j++) {
    characters.push(String.fromCharCode(j));
  }

  for (let k = 97; k <= 122; k++) {
    characters.push(String.fromCharCode(k));
  }

  // 隨機生成 key
  for (let l = 0; l < keyLength; l++) {
    const index = Math.floor(Math.random() * characters.length);
    key.push(characters[index]);
  }

  return key.join("");
}

export { generateKey };
