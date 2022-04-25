/**
 * 從 SCSS 編譯出 CSS，然後顯示在 terminal 上 (不會匯出檔案)
 */
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const sass = require("sass");

const result = sass.compile("../scss/index.scss");
console.log(result.css);

