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
      let indicator;
      console.log('Checking Alamodome for vaccines...');
      const browser = await puppeteer.launch({
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
        ],
      });
      try {
        const page = await browser.newPage();
        await page.goto(alamoURL, {
          waitUntil: 'networkidle0',
        });
        await page.waitForSelector('#groupCode');
        await page.type('#groupCode', 'DOMECOVID');
        await page.keyboard.press('Enter');
        await page.waitForSelector('#schSlotsMsg');
        indicator = await page.$eval('#schSlotsMsg', (el) => el.innerText);
      } catch (e) {
        console.error(e);
      }

      const date = new Date();
      const hour = date.getUTCHours();
      const minute = date.getUTCMinutes();

      const isFalseAlarm = hour === 11 && minute < 30;

      if ((indicator !== 'Registration full') && !isFalseAlarm) {
        await webhook.send(staticSlackMessage);
      }

      await browser.close();
    })();
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkAlamodome;
