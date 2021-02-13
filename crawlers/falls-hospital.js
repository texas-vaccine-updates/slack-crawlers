const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const getDateString = require('../utils/getDateString');
const renderFallsSlackMessage = require('../utils/renderFallsSlackMessage');
const scheduleURL = 'https://covid.fallshospital.com/schedule/';

dotenv.config();

const webhookURL = process.env.FALLSHOSPITAL_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookURL);

const dateString = getDateString();
const futureDateString = getDateString(30);
const fallsHospitalAPI = `https://covid.fallshospital.com/wp-json/ssa/v1/appointment_types/1/availability?start_date_min=${dateString}&start_date_max=${futureDateString}`;

const options = {
  'headers': {
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-public-nonce': '7edf4fcb00',
    'x-requested-with': 'XMLHttpRequest',
    'x-wp-nonce': 'd04694f7b2',
  },
  'referrer': 'https://covid.fallshospital.com/wp-json/ssa/v1/embed-inner?integration=form&type=1&edit&view&ssa_locale=en_US&sid=9ffa5a96c416b24af87390c66a2d8d2bdf29a3e1&accent_color&background&padding&font&booking_url=https%3A%2F%2Fcovid.fallshospital.com%2Fschedule%2F&booking_post_id=4221&booking_title=test&_wpnonce=d04694f7b2',
  'referrerPolicy': 'strict-origin-when-cross-origin',
  'body': null,
  'method': 'GET',
  'mode': 'cors',
};

let lastTime = 0;
const checkFallsHospital = async () => {
  console.log('Checking Falls Hospital for vaccines...');
  let data;
  try {
    const response = await fetch(fallsHospitalAPI, options);
    try {
      data = await response.json();
    } catch (e) {
      console.error(e);
    }

    if (response.status === 200) {
      const thisTime = data.data.length;
      console.log(thisTime);
      if (thisTime > (lastTime + 20) || thisTime < (lastTime - 20)) {
        lastTime = data.data.length;
        await webhook.send(renderFallsSlackMessage(scheduleURL, lastTime));
      }
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkFallsHospital;
