// 文件读取包
const fs = require("fs");
// RSS 解析包
const Parser = require("rss-parser");
// RSS 生成器
const RSS = require("rss");
// HTTP 代理包
// const HttpsProxyAgent = require("https-proxy-agent");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// 源文件配置
const readmeMdPath = "./README.md";

// RSS 配置
const maxDataJsonItemsNumberForRSS = 40; // 对 RSS 保存前 40 项
const rssXmlPath = "./web/public/rss.xml";
var feed = new RSS({
  title: "idealclover 友链屋",
  description: "翠翠和他的朋友们的blog，不代表翠翠本人观点",
  feed_url: "https://blogroll.icl.moe/rss.xml",
  site_url: "https://blogroll.icl.moe/",
  image_url: "https://blogroll.icl.moe/assets/logo.png",
  docs: "https://blogroll.icl.moe",
  managingEditor: "idealclover",
  webMaster: "idealclover",
  copyright: "2022 idealclover",
  language: "cn",
  ttl: "60",
});

// opml 配置
const opmlJsonPath = "./web/src/assets/opml.json";
const opmlXmlPath = "./web/public/opml.xml";
const opmlXmlContentTitle = "idealclover Blogroll";
const opmlXmlContentOp =
  '<opml version="2.0">\n  <head>\n    <title>' +
  opmlXmlContentTitle +
  "</title>\n  </head>\n  <body>\n";
const opmlXmlContentEd = "  </body>\n</opml>";

// web 配置
const maxDataJsonItemsNumberForWeb = 120; // 保存前 120 项
const dataJsonPath = "./web/src/assets/data.json";
const linkListJsonPath = "./web/public/linkList.json";

// 白名单：不检查是否允许访问
const whiteList = ["Sukka"];

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 6000 } = options;
  // options["agent"] = new HttpsProxyAgent("http://127.0.0.1:1087");
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  return response;
}

function parseReadMe() {
  // 解析 README 中的表格，转为 JSON
  const pattern =
    /\| *([^\|]*) *\| *(http[^\|]*) *\| *([^\|\n]*) *\| *([^\| \n]*) *\| *([^\| \n]*) *\| *([^\| \n]*) *\|\n/g;
  const readmeMdContent = fs.readFileSync(readmeMdPath, { encoding: "utf-8" });

  const metaJson = [];
  let resultArray;
  while ((resultArray = pattern.exec(readmeMdContent)) !== null) {
    metaJson.push({
      title: resultArray[1].trim(),
      htmlUrl: resultArray[2].trim(),
      description: resultArray[3].trim(),
      avatarUrl: resultArray[4].trim(),
      xmlUrl: resultArray[5].trim(),
      category: resultArray[6].trim(),
    });
  }
  return metaJson;
}

async function getIcon(meta) {
  try {
    // 确认网站是否可以访问
    const response = await fetchWithTimeout(meta.htmlUrl);
    if (response.ok || whiteList.includes(meta["title"])) {
      meta.status = "active";
    } else {
      meta.status = "lost";
      console.log("网络异常-未成功访问网站-404: " + meta.title);
      throw "404";
    }

    try {
      // 获取网站默认URL
      if (meta.avatarUrl == "") {
        const favicon = meta.htmlUrl + "/favicon.ico";
        const response = await fetchWithTimeout(favicon);
        if (response.ok) {
          meta.avatarUrl = favicon;
        } else {
          console.log("未成功获取图标: " + meta.title);
        }
      }
      // 获取网站默认RSS
      if (meta.xmlUrl == "") {
        const feed = meta.htmlUrl + "/feed";
        const response = await fetchWithTimeout(feed);
        if (response.ok) {
          meta.xmlUrl = feed;
        } else {
          console.log("未成功获取RSS: " + meta.title);
        }
      }
    } catch (err) {
      // console.log(err);
      console.log("网络异常-未成功获取信息: " + meta.title);
    }
  } catch (err) {
    // console.log(err);
    meta.status = "lost";
    console.log("网络异常-未成功访问网站-500: " + meta.title);
  }
}

async function getRSS(meta) {
  if (meta.xmlUrl == "") {
    return [];
  }

  try {
    // 读取 RSS 的具体内容
    var parser = new Parser({timeout: 6000});
    const feed = await parser.parseURL(meta.xmlUrl);
    console.log("xmlUrl: " + meta.xmlUrl);

    return feed.items
      .filter((item) => item.title && item.content && item.pubDate)
      .map((item) => {
        const pubDate = new Date(item.pubDate);
        return {
          name: meta.title,
          xmlUrl: meta.xmlUrl,
          htmlUrl: meta.htmlUrl,
          title: item.title,
          link: item.link,
          summary: item.summary ? item.summary : item.content,
          pubDate: pubDate,
          pubDateYYMMDD: pubDate.toISOString().split("T")[0],
          pubDateMMDD: pubDate.toISOString().split("T")[0].slice(5),
          pubDateYY: pubDate.toISOString().slice(0, 4),
          pubDateMM: pubDate.toISOString().slice(5, 7),
        };
      });
  } catch (err) {
    // 网络超时，进行 Log 报告
    console.log(err);
    console.log("-------------------------");
    console.log("xmlUrl: " + meta.xmlUrl);
    console.log("-------------------------");
    return [];
  }
}

function saveMetaFiles(metaJson) {
  // 保存 linkList.json
  // console.log(metaJson);
  fs.writeFileSync(linkListJsonPath, JSON.stringify(metaJson, null, 2), {
    encoding: "utf-8",
  });

  // 生成 opml.json
  const opmlJson = metaJson.map(
    ({ avatarUrl, description, category, ...rest }) => {
      return rest;
    }
  );

  // 保存 opml.json 和 opml.xml
  fs.writeFileSync(opmlJsonPath, JSON.stringify(opmlJson, null, 2), {
    encoding: "utf-8",
  });
  const opmlXmlContent =
    opmlXmlContentOp +
    opmlJson
      .map(
        (lineJson) =>
          `    <outline title="${lineJson.title}" xmlUrl="${lineJson.xmlUrl}" htmlUrl="${lineJson.htmlUrl}" />\n`
      )
      .join("") +
    opmlXmlContentEd;
  fs.writeFileSync(opmlXmlPath, opmlXmlContent, { encoding: "utf-8" });
}

function saveDataFiles(dataJson) {

  // 按时间顺序排序
  dataJson.sort((itemA, itemB) => (itemA.pubDate < itemB.pubDate ? 1 : -1));
  // 默认为保存前 n 项的数据, 并保证不超过当前时间
  const curDate = new Date();
  const dataJsonSliced = dataJson.filter((item) => item.pubDate <= curDate);

  const dataJsonSlicedForWeb = dataJsonSliced
    .slice(0, Math.min(maxDataJsonItemsNumberForWeb, dataJson.length))
    .map(({ summary, ...rest }) => {
      return rest;
    });
  const dataJsonSlicedForRSS = dataJsonSliced.slice(
    0,
    Math.min(maxDataJsonItemsNumberForRSS, dataJson.length)
  );

  // 写 json 数据
  fs.writeFileSync(
    dataJsonPath,
    JSON.stringify(dataJsonSlicedForWeb, null, 2),
    {
      encoding: "utf-8",
    }
  );

  console.log(dataJson[0]);
  feed.pubDate = dataJson[0].pubDate;

  //整理 RSS 数据
  for (let item of dataJsonSlicedForRSS) {
    feed.item({
      title: item.title,
      description: item.summary,
      url: item.link, // link to the item
      author: item.name, // optional - defaults to feed author property
      date: item.pubDate.toISOString(), // any format that js Date can parse.
    });
  }

  // 保存 rss.xml 文件
  const rssXmlContent = feed.xml();
  fs.writeFileSync(rssXmlPath, rssXmlContent, { encoding: "utf-8" });
}

(async function () {
  const metaJson = parseReadMe();
  // 获取网站状态、图标信息
  getIconPromises = metaJson.map((source) => getIcon(source));
  await Promise.all(getIconPromises);
  console.log(metaJson);

  // 获取 RSS
  getRSSPromises = metaJson.map((source) => getRSS(source));
  const dataJson = [].concat.apply([], await Promise.all(getRSSPromises));
  console.log(dataJson);
  saveMetaFiles(metaJson);
  saveDataFiles(dataJson);
})();
