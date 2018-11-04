const puppeteer = require('puppeteer');
const fs = require('fs');
const rootUrl = 'http://kns.cnki.net/kns/brief/default_result.aspx';


const userAgent = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';
const workPath = './contents';
if (!fs.existsSync(workPath)) {
    fs.mkdirSync(workPath)
}

(async () => {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.setUserAgent(userAgent);
    await page.goto(rootUrl);
    await page.type('#txt_1_value1', '科技', {delay: 100});
    await page.click('#btnSearch');
    await page.waitFor(5000);
    const iframe = await page.frames().find(f => f.name() === 'iframeResult');
    const selector = '.fz14'
    try{
        const elements =  await iframe.$$(selector);
        console.log(elements)
        const links = await iframe.evaluate((e) =>{
        //    const urls = e.map(element => {
        //        return element.href;
        //     });
        //     return urls;
       
        },elements);
         console.log(links);
    }catch(e){
        console.log(e)
    }
  
})();