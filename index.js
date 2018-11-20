var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var querystring = require('querystring');
var request = require('superagent');

var requestUrl = 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC100001/';
request
    .post(requestUrl)
    .set('accept','json')
    .end((err,res)=>{
      console.log(res)
      var html = iconv.decode(Buffer.concat(res),'utf-8');
      var $ = cheerio.load(html,{decodeEntities:false});
      $('.sec-first').each((idx,element) => {
          console.log(element)
      })

    })

// const post_data = querystring.stringify({
//     txt_1_value1:'科技'
// })
// const options = {
//     host: requestUrl,
//     method: 'POST',
//     headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//          // 'Content-Length': Buffer.byteLength(post_data)
//       }
// }




// const post_req =  http.request(options,function(res){
//     var chunks = [];
//     // res.on('data',function (chunk) {
//     //     chunks.push(chunk)
//     // });
//     // console.log('chunks',chunks)
//     // res.on('end',function () {
//     //     var links = [];
//     //     var html = iconv.decode(Buffer.concat(chunks),'utf-8');
//     //     var $ = cheerio.load(html,{decodeEntities:false});
//     //     $('.fz14').each(function (idx,element) {
//     //         var $element = $(element);
//     //         links.push({
//     //             url:$element.attr('href')
//     //         })
            
//     //     })
//     //     console.log(links)
//     // })

// })
// post_req.write(post_data)
// post_req.end();