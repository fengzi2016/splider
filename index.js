var cheerio = require('cheerio');
var request = require('superagent');
var fs = require('fs');

// 组合函数
const compose = (f,g) => {
  return function(x) {
      return f(g(x));
  }
}

let count = 642;
const url = 'http://www.lis.ac.cn/CN/volumn/volumn_642.shtml';
const urlsSeletor = 'a[^href="../abstract/"]';

// 发送请求
function fecthDataToSeletor(url){
 return request.get(url)
} 
// 分离字段
const splitField = ($) => {
  let data = $('#abstract_tab_content tr:nth-child(2) td:nth-child(1)').text();
  let store = {};
  const goalReg = /(\[目的\/意义\])([^。])*/;
  const methodReg = /(\[方法\/过程\])([^。])*/;
  const resultReg = /(\[结果\/结论\])([^。])*/;
  const goal = goalReg.exec(data)[0];
  const method = methodReg.exec(data)[0];
  const result = resultReg.exec(data)[0];
  store[goal] = goal;
  store[method] =  method;
  store[result] = result;
  return store;
}
// 写入文件
const readFile = (store) => {
    var json = JSON.stringify(store); // json格式解析，这步也是一定要有
    fs.writeFile('toptens.json', json, 'utf-8', function(err){
      if (err) throw err;
      else console.log('JSON写入成功'+'\r\n' + json)
    });
}
// 获取详情链接
function getDetials(baseUrl) {
 return fecthDataToSeletor(baseUrl)
  .then(function (res) {
    var $ = cheerio.load(res.text);
    // console.log($(urlsSeletor))
   return $('a[href*="[abstract"]').attr('href');
  })
 }


// 开始获取
getDetials(url).then(res => {
  console.log(res);
  res.forEach(data => {
    compose(readFile,splitField,fecthDataToSeletor(data));
  });
  }
 );


   


