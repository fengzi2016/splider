var cheerio = require('cheerio');
var request = require('superagent');
var fs = require('fs');

// 组合函数
const compose = (f,g) => {
  return function(x) {
      return f(g(x));
  }
}

let baseUrl;
let count = 642;
let number = 0;
while(count>640){
  count --;
  baseUrl = `http://www.lis.ac.cn/CN/volumn/volumn_${count}.shtml`;
  number += start();
}





// 发送请求
function fecthDataToSeletor(url){
 return request.get(url)
} 
// 分离字段
const splitField = (promise) => {
 return promise.then($=>{
    let data = $('#abstract_tab_content tr:nth-child(2) td:nth-child(1)').text();
    let store = {};
    const goalReg = /(\[目的\/意义\])([^。])*/;
    const methodReg = /(\[方法\/过程\])([^。])*/;
    const resultReg = /(\[结果\/结论\])([^。])*/;
    const goal = goalReg.exec(data) ?  goalReg.exec(data)[0]:null;
    const method = methodReg.exec(data) ? methodReg.exec(data)[0]:null;
    const result = resultReg.exec(data) ? resultReg.exec(data)[0]:null;
    store.goal = goal?goal.slice(7):null;
    store.method = method?method.slice(7):null;
    store.result= result?result.slice(7):null;
    return store;
 })
}
// 写入文件

const readFile = (promise) => {
  promise.then(store=>{
    if(store.goal===null) return;
    var json = JSON.stringify(store); // json格式解析，这步也是一定要有
    fs.appendFile('toptens.json', json, 'utf-8', function(err){
      if (err) throw err;
      // else console.log('JSON写入成功'+'\r\n' + json)
    });
  })  
}
// 获取详情链接
function getDetials(baseUrl) {
 return fecthDataToSeletor(baseUrl)
  .then(function (res) {
   let reg = /(href=")(\.\.\/abstract[^"]*)/g;
   return res.text.match(reg);
  })
 }
 function getInnerDetails(baseUrl){
  return fecthDataToSeletor(baseUrl)
  .then(function (res) {
   const $ = cheerio.load(res.text);
   return $;
  // return res;
  })
 }

// 开始获取
function start() {
  getDetials(baseUrl).then(res => {
    res.forEach(data => {
      const url = "http://www.lis.ac.cn/CN/" + data.slice(8);
      const getData = compose(readFile,compose(splitField,getInnerDetails)) ;
      getData(url);
     
    });
    number+=res.length;
    if(count===640) console.log(number)
    }
  );
}



   


