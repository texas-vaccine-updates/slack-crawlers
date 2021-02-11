const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const renderStaticSlackMessage = require('../utils/renderStaticSlackMessage');
const universityURL = 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788&view=grouped';
const universityAPI = 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/OpenScheduling/OpenScheduling/GetOpeningsForProvider';

dotenv.config();

const url = process.env.UNIVERSITY_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const date = new Date();
const day = ('0' + date.getDate()).slice(-2);
const month = ('0' + (date.getMonth() + 1)).slice(-2);
const year = date.getFullYear();
const dateString = `${year}-${month}-${day}`;

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 14);
const futureDay = ('0' + futureDate.getDate()).slice(-2);
const futureMonth = ('0' + (futureDate.getMonth() + 1)).slice(-2);
const futureYear = futureDate.getFullYear();
const futureDateString = `${futureYear}-${futureMonth}-${futureDay}`;

const options = {
  'headers': {
    '__requestverificationtoken': 'zy7tT6_RTbuyTD4SGHXH8x3sG6yD3r7Eera3OsdabZy8QbJ20FEAv6YE5wJwXsa8JBbHhBcFwMngmeVHGkSwiyAu0-w1',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    'cookie': 'MyChartLocale=en-US; MyChart_Session=qdbanoo03oxvgd2dxlmz1qje; __RequestVerificationToken_L015Q2hhcnQ1=fBwSnAM7UBKdpFigB5Ihn4lc2ct7HABm4wO1f2OVrRiRnF0p1W9YKLBK5iTzBF_uUBxQVtMZkraFVtvMkqq3XBcU4sM1; MYCPERS=3422557868.47873.0000; .WPCOOKIE4mychart=CF5C4B46F9D6F804A81D0CB96A0A13C189B700F44F8E39580AED0DD75732BCC0933B031FA0AD5E8B2C7834A8C74D8B4E2F9C3B075FCD334EC10D89F8042D6C16B2C27EEDE4EDFD83212C97D2F0744FB208C12759B8A77666AAD89EE532569067F92C4CB5A5BA710BC600D54DE8ADE328968E7434935D811E8141C5C86F873002AA01C2B5CB1551AA1D58D8EAF70B7DCD8D97C94E791E7F2C8DBCBB69AA0E98FFC909F94D192EAE8BE96DEDC3A39956F4976BD0821D9942C0A13CC7AD896DA86492373DBD5799AA32B18D7F2287C4CDEB23C144928AA429549DA73E5E1A6736D595EDE76D95C3CB522881217D2C6FAA9348470BCE',
  },
  'referrer': 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788&view=grouped',
  'referrerPolicy': 'same-origin',
  'body': `id=51748&vt=1788&dept=10554003&view=grouped&start=${dateString}&end=${futureDateString}&filters=%7B%22Providers%22%3A%7B%2251748%22%3Atrue%7D%2C%22Departments%22%3A%7B%2210554003%22%3Atrue%7D%2C%22DaysOfWeek%22%3A%7B%220%22%3Atrue%2C%221%22%3Atrue%2C%222%22%3Atrue%2C%223%22%3Atrue%2C%224%22%3Atrue%2C%225%22%3Atrue%2C%226%22%3Atrue%7D%2C%22TimesOfDay%22%3A%22both%22%7D`,
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
    (async () => {
      try {
        const response = await fetch(universityAPI, options);
        if (response.status === 200) {
          data = await response.json();
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
