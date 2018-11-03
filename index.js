var cheerio = require('cheerio');
var http = require('http');
var iconv = require('iconv-lite');
var querystring = require('querystring');
var request = require('superagent');

var question = '科技';
var requestUrl = 'http://kns.cnki.net/kns/brief/default_result.aspx';
request
    .post(requestUrl)
    .send({
        txt_1_value1:'科技',
        txt_1_sel: 'SU$%=|',
        txt_1_special1: '%',
        action: 'scdbsearch'
    })
    .set('accept','json')
    .end((err,res)=>{
        var links = [];
        var $ = cheerio.load(res.text);
        $('.fz14').each(function (element) {
            console.log('element',element)
            var $element = $(element);
            links.push({
                url:$element.attr('href')
            })
        })
        console.log(links);
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