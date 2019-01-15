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
// 299
let count = 613;
let number = 0;
//600
while(count>=600){
  count --;
  baseUrl = `http://www.lis.ac.cn/CN/volumn/volumn_${count}.shtml`;
  start();
}

// baseUrl = `http://www.lis.ac.cn/CN/volumn/volumn_${count}.shtml`
// start();




// 发送请求
function fecthDataToSeletor(url){
 return request.get(url)
} 
// 分离字段


const splitField = (promise) => {
 return promise.then($=>{
   let spaceReg = /\/t*\/n*/g;
   let authors = $('body > table:nth-child(4) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td').text();
   let publisher = $('body > table:nth-child(4) > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(5) > td').text();
   let date = $('#abstract_tab_content > table:nth-child(1) > tbody > tr:nth-child(8) > td').text();
   let keywords = $('#abstract_tab_content > table:nth-child(1) > tbody > tr:nth-child(5) > td').text();

   
   




   // 处理作者
   const authorReg = /(\d{1})*/g;
   let authorsArr = authors.split("，");
    let noNumberAuthors =  authorsArr.map((val)=>{
     return val.replace(authorReg,"");
   })
   noNumberAuthors = noNumberAuthors.filter((val)=>{
     return val.length>0;
   })
  

   // 处理发布社
   let publisherArr = publisher.split(";");
   let noSequencePublisherArr = publisherArr.map((val)=>{
     let reVal = val.slice(4);
     return reVal;
   })


   // 处理时间
   let datetime = null;
   if(date){
    datetime = date.split(":")[1].replace(/^\s+|\s+$/g,'');
   }
   
   // 处理关键字
   let keywordsWrap = keywords.split(":")[1];
   let keywordsArr = null;
   let noSpaceKeywordsArr = null;
   if(keywordsWrap){
     keywordsArr = keywordsWrap.split(",");
     noSpaceKeywordsArr = keywordsArr.map((val)=>{
      return val.replace(/^\s+|\s+$/g,'');
    })
   }
   
   

   // 处理内容
   
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
    Object.assign(store,{
      keywords:noSpaceKeywordsArr,
      publisher:noSequencePublisherArr,
      authors:noNumberAuthors,
      datetime
    })
    console.log(store);
    return store;
   
 })
}
// 写入文件

const readFile = (promise) => {
  promise.then(store=>{
    if(store.goal===null) return;
    var json = JSON.stringify(store);
    var target = {};
    
    // json格式解析，这步也是一定要有
    fs.appendFile('newData.json', json+',', 'utf-8', function(err){
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
function start(){
  getDetials(baseUrl).then(res => {
    res.forEach(data => {
      const url = "http://www.lis.ac.cn/CN/" + data.slice(8);
      const getData = compose(readFile,compose(splitField,getInnerDetails)) ;
      getData(url);
    });
 })
}
 



   


