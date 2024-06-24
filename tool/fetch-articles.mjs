import fs from "node:fs";
import { URL } from "node:url";
import { parse } from "node-html-parser";

const TARGET_URL_LIST = [
  "https://www.recreation.jp/movie/articles/2/6",
  "https://www.recreation.jp/movie/articles/2/7",
  "https://www.recreation.jp/movie/articles/2/8",
  "https://www.recreation.jp/movie/articles/2/9",
  "https://www.recreation.jp/movie/articles/2/13",
];

const fdOutput = fs.openSync("articles.tsv", "w");
try {
  for (const TARGET_URL of TARGET_URL_LIST) {
    const targetUrl = new URL(TARGET_URL);
    const destName = targetUrl.pathname.replace(/^\//, "").replace(/\//g, "-");
    // console.log(destName);

    for (let page = 1; ; page++) {
      const url = `${TARGET_URL}?page=${page}`;
      const filePath = `./html/${destName}_p${page}.html`;
      console.log(url);

      let html = "";
      if (fs.existsSync(filePath)) {
        console.log("Read from cache");
        html = fs.readFileSync(filePath, "utf8");
      } else {
        console.log("Fetch new");
        await sleep(3000);
        const res = await fetch(url);
        html = await res.text();
        fs.writeFileSync(filePath, html);

        if (200 !== res.status) {
          // console.log("Page end");
          break;
        }
      }

      const root = parse(html);
      const category = root.querySelector(".text-white-soft")?.text.trim();
      const articles =
        root
          .querySelectorAll(".list-asobi-articles")[0] // 1番目が検索結果、2番目が関連動画
          ?.querySelectorAll(".asobi-article") || [];
      if (articles.length === 0) {
        // console.log("Page end");
        break;
      }
      for (const article of articles) {
        // 会員限定コンテンツはHTML構造が違うのでundefinedになる
        const urlPath = article
          ?.querySelector(".asobi-article-image-wrapper a")
          ?.getAttribute("href");
        const title = article?.querySelector(".card-text").text;

        if (urlPath && title) {
          fs.writeSync(
            fdOutput,
            `https://www.recreation.jp${urlPath}\t${category}\t${title}\n`,
          );
        }
      }
    }
  }
} finally {
  fs.closeSync(fdOutput);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
