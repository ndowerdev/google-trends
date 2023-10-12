const fs = require("fs");
const Parser = require('rss-parser');
const format = require("date-format");
const xml2js = require('xml2js');

const parser = new Parser({
  customFields: {

    item: ['ht:picture', 'ht:picture_source', 'ht:approx_traffic', 'ht:news_item'],

  }
});
module.exports = async (data) => {
  let list = data.slice(0, -1);

  let tableData = '| Country | Keyword | Last Update |\n| --- | --- | --- |\n';

  for (let item of list) {
    let [name, code] = item.split('=');
    name = name.replace("_", " ");

    const url = `https://trends.google.com/trends/hottrends/atom/feed?pn=${code}`;
    const feed = await parser.parseURL(url);




    const x = feed.items.map(el => ({

      title: el.title,
      link: el.link,
      pubdate: el.pubDate,
      content: el.content,
      contentSnippet: el.contentSnippet,
      picture: el["ht:picture"],
      pictureSource: el["ht:picture_source"],
      approxtraffic: el["ht:approx_traffic"],
      newsTitle: el['ht:news_item']['ht:news_item_title'].map(item => item),
      newsTitleSnippet: el['ht:news_item']['ht:news_item_snippet'].map(item => item),
      newsSource: el['ht:news_item']['ht:news_item_source'].map(item => item),
    }));
    y = x.map((el) => {
      let newsItem = new Array;
      for (let index = 0; index < el.newsTitle.length; index++) {

        newsItem.push({
          title: el.newsTitle[index],
          snippet: el.newsTitleSnippet[index],
          source: el.newsSource[index]
        })

      }

      return {
        title: el.title,
        link: el.link,
        pubdate: el.pubDate,
        content: el.content,
        contentSnippet: el.contentSnippet,
        picture: el.picture,
        pictureSource: el.pictureSource,
        approxtraffic: el.approxtraffic,
        newsItem: newsItem

      }
    })


    const thiskeyword = feed.items.map(el => el.title);
    const res = {
      lastUpdate: format("dd-MM-yyyy , hh:mm:ss"),
      data: y
    };

    const keywordString = thiskeyword.join(', ');

    tableData += `| ${name} | ${keywordString} | ${res.lastUpdate} |\n`;

    fs.writeFileSync(`./data/${name}.json`, JSON.stringify(res, null, 2));
    fs.writeFileSync(`./forcopied/${name}.txt`, thiskeyword.toString(), "UTF-8");
  }

  fs.writeFileSync("./README.MD", `
## Google Trends Keywords Scraper

Last Update ${format("dd-MM-yyyy , hh:mm:ss")}
Country List:

${tableData}
© Abdul Muttaqin
`, 'UTF-8', {
    'flags': 'w+'
  });

  return "Data has been written";
}
