// const puppeteer = require('puppeteer');
// const $ = require('cheerio').default;

// const CronJob = require('cron').CronJob;
// const nodemailer = require('nodemailer');

// const url = 'https://www.amazon.com/Sony-Noise-Cancelling-Headphones-WH1000XM3/dp/B07G4MNFS1/';

// async function configureBrowser() {
//     const browser = await puppeteer.launch({headless: true});
//     const page = await browser.newPage();
//     await page.goto(url);
//     // browser.close();
//     return page;
// }



// async function checkAvailability(page) {
//     await page.reload(page);
//     const result = await page.evaluate(() => {
//       let title = document.querySelector('#productTitle').innerText;
//       let availability = document.querySelector('#availability').innerText;
//       let imgUrl = document.querySelector('#imgTagWrapperId > img').src;
//       let priceStr = document.querySelector('#twister-plus-price-data-price').attr('value').innerText;
//       let price = Number(priceStr.replace(/$/g, ''));
//       return {
//         title,
//         imgUrl,
//         availability,
//         price
//       };
//     });

//   return result;

// }




// async function startTracking() {
//     const page = await configureBrowser();
  
//     let job = new CronJob('* */5 * * * *', function() { //runs every 30 minutes in this config
//       checkAvailability(page);
//     }, null, true, null, null, true);
//     job.start();
// }

// async function sendNotification(html) {

//     let transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: '****@gmail.com',
//         pass: '*****'
//       }
//     });
  
//     let subject = `AMAZON STOCK TRACK - ${html.title} - ${chtml.availability}`
//     let textToSend = `<p>Go and buy it now <a href=\"${url}\">Link</a></p>`;
  
//     let info = await transporter.sendMail({
//       from: '"In Stock Tracker" <*****@gmail.com>',
//       to: "****@gmail.com",
//       subject: subject, 
//       html: textToSend

//     });
  
//     console.log("Message sent: %s", info.messageId);
// }



// startTracking();
const puppeteer = require('puppeteer');
const $ = require('cheerio').default;
const CronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');

const url = 'https://www.amazon.com/dp/B087P191LP';

async function configureBrowser() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    return page;
}

async function checkPrice(page) {
    await page.reload();
    let html = await page.evaluate(() => document.body.innerHTML);
    // console.log(html);

    $('.twisterSwatchPrice', html).each(function() {
        let dollarPrice = $(this).text();
        console.log(dollarPrice);
        let currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g,""));

        if (currentPrice < 300) {
            console.log("BUY!!!! " + currentPrice);
            sendNotification(currentPrice);
        }
    });
}

async function startTracking() {
    const page = await configureBrowser();
  
    let job = new CronJob('* */30 * * * *', function() { //runs every 30 minutes in this config
      checkPrice(page);
    }, null, true, null, null, true);
    job.start();
}

async function sendNotification(price) {

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '*****@gmail.com',
        pass: '****'
      }
    });
  
    let textToSend = 'Price dropped to ' + price;
    let htmlText = `<a href=\"${url}\">Link</a>`;
  
    let info = await transporter.sendMail({
      from: '"Price Tracker" <*****@gmail.com>',
      to: "***@gmail.com",
      subject: 'Price dropped to ' + price, 
      text: textToSend,
      html: htmlText
    });
  
    console.log("Message sent: %s", info.messageId);
  }

startTracking();

