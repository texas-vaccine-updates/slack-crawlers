const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const renderStaticSlackMessage = require('../utils/renderStaticSlackMessage');
const getDateString = require('../utils/getDateString');
const universityURL = 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788&view=grouped';

dotenv.config();

const url = process.env.UNIVERSITY_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const preflightURL = 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788&view=grouped';
const preflightOptions = {
  'headers': {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'no-cache',
    'pragma': 'no-cache',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
  },
  'referrerPolicy': 'strict-origin-when-cross-origin',
  'body': null,
  'method': 'GET',
  'mode': 'cors',
};


const noCache = Math.random();
const universityAPI = `https://mychart-openscheduling.et1130.epichosted.com/MyChart/OpenScheduling/OpenScheduling/GetOpeningsForProvider?noCache=${noCache}`;

const dateString = getDateString();
const futureDateString = getDateString(14);

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
    (async () => {
      try {
        // let cookie;
        // const preflight = async () => {
        //   const response = await fetch(preflightURL);
        //   // const preflightData = await response.json();
        //   cookie = await response.headers.get('set-cookie');
        // };

        // await preflight; // will enable instead of refreshing cookies manually.

        const options = {
          'headers': {
            '__requestverificationtoken': 'cCu6HArQJ5iS595-nOXgcczzr7pV7kkMjM-UcDQbhbZlQGovep6KQyf8iOBaYaZ7jiE1g-Yt61HIhs9vqfEiEiJhmgA1',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
            'cookie': 'MyChartLocale=en-US; MyChart_Session=2rmtn0kembyr3nw2mtl22gq5; __RequestVerificationToken_L015Q2hhcnQ1=0m9Ibbxaqvroj12DZrksczRzYLJn6JCM2Meu3Bq8jFhFqkeljaubkq-Jwx-RUs9p9J3bBKRFnCv13v8sJbX4s5dUjeE1; MYCPERS=3422557868.47873.0000; .WPCOOKIE4mychart=72BC1511A0B935A1D61E9D565B5592F48BCC33B856524259DE97F95BE03F4B058955D8C49EC1047874F4D05D9143AE7E6177A468E9CE8076D85D8DCE21664E695906306F7137359CA63000B8405165D11AC173A61C98855C40E84B1E8F7C4C05BD388B7857BA904B853B875E3A05BA113D168C4C63EEF878DC916160AA652B8AF2EA8D3D848131DB304B0D0D15C06026CA30F941D2CF0CAE110F4393EB7C9DD9684F1111AAE2740768C3670C39DDEF376A9EA91959D07947A5AE47235B2584E3D31D23991F02F86A67BBEFAE2740EB02D8AE2DE0C5DD7116578D6FA85986818620828F55D9B88756185C510D863098AE21CEA6AE',
          },
          'referrer': 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788&view=grouped',
          'referrerPolicy': 'same-origin',
          'body': `id=51748&vt=1788&dept=10554003&view=grouped&start=${dateString}&end=${futureDateString}&filters=%7B%22Providers%22%3A%7B%2251748%22%3Atrue%7D%2C%22Departments%22%3A%7B%2210554003%22%3Atrue%7D%2C%22DaysOfWeek%22%3A%7B%220%22%3Atrue%2C%221%22%3Atrue%2C%222%22%3Atrue%2C%223%22%3Atrue%2C%224%22%3Atrue%2C%225%22%3Atrue%2C%226%22%3Atrue%7D%2C%22TimesOfDay%22%3A%22both%22%7D`,
          'method': 'POST',
          'mode': 'cors',
        };


        const response = await fetch(universityAPI, options);
        try {
          data = await response.text();
          console.log(data);
        } catch (e) {
          console.error(e);
        }
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
    })();
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkUniversity;
