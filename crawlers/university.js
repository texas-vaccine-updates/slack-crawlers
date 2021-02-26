const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const renderStaticSlackMessage = require('../utils/renderStaticSlackMessage');
const getDateString = require('../utils/getDateString');
const universityURL = 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51585&dept=10554002&vt=1788&view=grouped';

dotenv.config();

const url = process.env.UNIVERSITY_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const noCache = Math.random();
const universityAPI = `https://mychart-openscheduling.et1130.epichosted.com/MyChart/OpenScheduling/OpenScheduling/GetOpeningsForProvider?noCache=${noCache}`;

const dateString = getDateString();
const futureDateString = getDateString(14);

const options = {
  'headers': {
    '__requestverificationtoken': 'tiVPog4pvBP5HeBOSqXsaAWLsycOJO_YIqjLGsJnnPHvU09wbD47X_cuuCkNkN04U0erNO3prYdiuWzmYcJDVxekD-w1',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    'cookie': 'MyChartLocale=en-US; MyChart_Session=2rmtn0kembyr3nw2mtl22gq5; __RequestVerificationToken_L015Q2hhcnQ1=PgiMEzH45ni09mEM4Sq5kWAPUjYqzNSJ8iyH1kpM3R2onuZ7RRJOcWaQTtBLjGaQARuuIPg1qmh8ZU0Az2g3_ts6gjc1; MYCPERS=3456112300.47873.0000; .WPCOOKIE4mychart=D9D612704F22EBE7E9498E42ADD44E90BBF9C2D31912BD7C9AA818E1B56B99D4F1A7E5D76703F5604485075CAFF30BE0E6B63B1D7216E9A2364A17CDBCC348328FFA3E08664C83BC02BD9F227254599EC387FE58298C05F0CA89439F34C55017EBC470AC558B6A11DDA53B13D24F389BF142DF4A14A9C61543547C997879E4A131BA134378CD90330888F9D67E76B74EA54DDBF6ABF96C8B398DB0618D67D792F82BF0053B1817B8C04DAD21D60497439226184B64B01AB0282DD2653579FC8671670BE3828F51D4FF43AD6F681A6A763491983718B0A267A4FCA86436FBEF6621905170EBEEA24121F0700A7770E5A5C82A311A',
  },
  'referrer': 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788&view=grouped',
  'referrerPolicy': 'same-origin',
  'body': `id=51585&vt=1788&dept=10554002&view=grouped&start=${dateString}&end=${futureDateString}&filters=%7B%22Providers%22%3A%7B%2251585%22%3Atrue%7D%2C%22Departments%22%3A%7B%2210554002%22%3Atrue%7D%2C%22DaysOfWeek%22%3A%7B%220%22%3Atrue%2C%221%22%3Atrue%2C%222%22%3Atrue%2C%223%22%3Atrue%2C%224%22%3Atrue%2C%225%22%3Atrue%2C%226%22%3Atrue%7D%2C%22TimesOfDay%22%3A%22both%22%7D`,
  'method': 'POST',
  'mode': 'cors',
};

const isEmpty = (obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

const checkUniversity = async () => {
  console.log('Checking University for vaccines...');
  let data;
  try {
    const response = await fetch(universityAPI, options);
    data = await response.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
  if (!isEmpty(data.AllDays)) {
    try {
      await webhook.send(renderStaticSlackMessage(universityURL));
    } catch (e) {
      console.error(e);
    }
  }
};

module.exports = checkUniversity;
