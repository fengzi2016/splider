var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var querystring = require('querystring');
var request = require('superagent');

var requestUrl = 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC100001/';
request
    .get(requestUrl)// 转码-将gb2312格式转成utf-8
    .end(function (err, res) {
    // 常规的错误处理
    if (err) {
      return next(err);
    }
    var $ = cheerio.load(res.text,{
      xmlMode: true // 由于从rss里读取xml，所以这一步一定要有，切记
    });
   
    var d = new Date();
    var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+(d.getDate()); // 取得爬取的日期
    var topten = { // 设定爬取的json数组
        date: date,
        info: []
      };
    console.log($('#__p2').text()); // 摘要
    var json = JSON.stringify(toptens); // json格式解析，这步也是一定要有

    fs.writeFile('toptens.json', json, 'utf-8', function(err){
      if (err) throw err;
      else console.log('JSON写入成功'+'\r\n' + json)
    });
   
})






