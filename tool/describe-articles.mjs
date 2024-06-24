import fs from "node:fs";
import { URL } from "node:url";
import { parse } from "node-html-parser";

const TARGET_URL_LIST = ["https://www.recreation.jp/movie/article/235/2/13"];

const fdOutput = fs.openSync("articles.json", "w");
try {
  for (const TARGET_URL of TARGET_URL_LIST) {
    const targetUrl = new URL(TARGET_URL);
    const destName = targetUrl.pathname.replace(/^\//, "").replace(/\//g, "-");
    // console.log(destName);

    const filePath = `./html/${destName}.html`;
    console.log(TARGET_URL);

    let html = "";
    if (fs.existsSync(filePath)) {
      console.log("Read from cache");
      html = fs.readFileSync(filePath, "utf8");
    } else {
      console.log("Fetch new");
      await sleep(3000);
      const res = await fetch(TARGET_URL);
      html = await res.text();
      fs.writeFileSync(filePath, html);

      if (200 !== res.status) {
        console.log("Not found!");
        continue;
      }
    }

    const root = parse(html);
    const title = root.querySelector(".asobi-title")?.text?.trim();
    // console.log(`[${title}]`);

    const publishedAt = root
      .querySelector(".asobi-article-main-title > div")
      ?.text?.replace("公開日", "")
      ?.trim()
      ?.replace(/^([0-9]{4})年([0-9]{1,2})月([0-9]{1,2})日$/, "$1-$2-$3");
    // console.log(`[${publishedAt}]`);

    const desc = root.querySelector(".asobi-articles p.lead")?.text?.trim();
    // console.log(`[${desc}]`);

    const numOfPlayers = root
      .querySelector(".asobi-articles .col-6")
      ?.text?.replace("あそぶ人数", "")
      ?.trim();
    // console.log(`[${numOfPlayers}]`);

    const howLong = root
      .querySelector(".asobi-articles .col-6:nth-child(2)")
      ?.text?.replace("使う時間", "")
      ?.trim();
    // console.log(`[${howLong}]`);

    const desc2 = root
      .querySelector(".asobi-articles div.word-break-all")
      ?.text?.trim()
      .replace(/\s+/g, "\n");
    // console.log(`[${desc2}]`);

    fs.writeSync(
      fdOutput,
      JSON.stringify({
        title,
        publishedAt,
        desc,
        numOfPlayers,
        howLong,
        desc2,
      }) + "\n",
    );
  }
} finally {
  fs.closeSync(fdOutput);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
