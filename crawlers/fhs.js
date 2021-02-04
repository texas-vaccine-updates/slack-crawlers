const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const fhsURL = 'https://intakeq.com/booking/qfrufw';

dotenv.config();

const url = process.env.FHS_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const staticSlackMessage = {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Vaccines are available! 💉 @channel*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Click here to schedule using code `DOMECOVID`:',
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Schedule',
          emoji: true,
        },
        value: 'vaccine',
        url: fhsURL,
        action_id: 'button-action',
      },
    },
  ],
};


const checkFHS = async () => {
  try {
    (async () => {
      console.log('Checking FHS for vaccines...');
      const browser = await puppeteer.launch({
        viewport: {width: 1200, height: 1200},
        headless: false,
        ignoreHTTPSErrors: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });
      const page = await browser.newPage();
      await page.goto(fhsURL);
      await page.waitForTimeout(5000);
      // const pullovers = await page.$$('div.address-box.ng-binding');
      await page.click('#widget-container > ng-view > div > div.row > div:nth-child(1) > div', {clickCount: 2});

      // await page.$eval('#widget-container > ng-view > div > div.row > div:nth-child(1) > div', (el) => el.click());
      // await page.waitForSelector('#widget-container > ng-view > div > div.row > div:nth-child(1) > div'), // The promise resolves after navigation has finished
      // await page.click('#widget-container > ng-view > div > div.row > div:nth-child(1) > div'), // Clicking the link will indirectly cause a navigation


      // if (indicator !== 'Registration full') {
      //   await webhook.send(staticSlackMessage);
      // }
      await browser.close();
    })();
  } catch (e) {
    console.error(e);
  }
};

checkFHS();

module.exports = checkFHS;
