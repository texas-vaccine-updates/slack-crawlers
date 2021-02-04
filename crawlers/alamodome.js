const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const alamoURL = 'https://patportal.cdpehs.com/ezEMRxPHR/html/login/newPortalReg.jsp';

dotenv.config();

const url = process.env.ALAMO_WEBHOOK_URL;
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
        url: alamoURL,
        action_id: 'button-action',
      },
    },
  ],
};


const checkAlamodome = async () => {
  try {
    (async () => {
      console.log('Checking Alamodome for vaccines...');
      let indicator = '';
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });
      const page = await browser.newPage();
      await page.goto(alamoURL);
      await page.type('#groupCode', 'DOMECOVID');
      await page.keyboard.press('Enter');
      try {
        await page.waitForSelector('#schSlotsMsg');
        indicator = await page.$eval('#schSlotsMsg', (el) => el.innerText);
      } catch (e) {
        console.error(e);
      }

      if (indicator !== 'Registration full') {
        await webhook.send(staticSlackMessage);
      }

      await browser.close();
    })();
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkAlamodome;
