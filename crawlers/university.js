const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const renderStaticSlackMessage = require('../utils/renderStaticSlackMessage');
const getDateString = require('../utils/getDateString');
const universityURL = 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788&view=grouped';

dotenv.config();

const url = process.env.UNIVERSITY_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const dateString = getDateString();
const futureDateString = getDateString(14);

const noCache = Math.random();
const universityAPI = `https://mychart-openscheduling.et1130.epichosted.com/MyChart/OpenScheduling/OpenScheduling/GetOpeningsForProvider?noCache=${noCache}`;

const options = {
  'headers': {
    '__requestverificationtoken': 'ojvbzlc_vzThMdoVjwzqyftvLchb1vVyrDgCdbB5Ck8ZjUuLekGdl22J-VIDbRoZycsJ3qb0X3PymC-yXFeFUy-0oas1',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    'cookie': 'MyChartLocale=en-US; MyChart_Session=up3qqy3z4g000ag4zkiom2dy; MYCPERS=3456112300.47873.0000; __RequestVerificationToken_L015Q2hhcnQ1=Sz4alFszHZWRKl9SXeLvewjgpH_MhIZ7JDfys3xgsR1xKxKI-72ClOZcdjtGRF9rD-4QIIHFMMNztXFchtBtYUVy1RY1; .WPCOOKIE4mychart=8789544DDE0B261D8E1B529C23279091E32C2A05AC0E1631C767AA352522EB6F64E25C43D2CB9FAE37D334F29ABC52C6CD674B5557A6C5AF2E828EAF87D151D46B19FE8EC1A8339B59AAD4AC83C42CC422146DC40EDBC0D3D02E5B2C92B0294026AF72E95C988131C4705EB34EBE9B4032FC33740A88E65822EC97EB50AC4FCCBD48F0911BD4562634FE9ACEA5CF767A490386C0D0A9D9340DE6410E523F8B59E7D465F17701A99DB319832CA2430853D309C321E6E222B8EDF6B77F271B8F817832CB154F48E14B8A20D15B1F1E42575D4C3E045745F1FFB86D305AB0BA2B1123176EDCED92E1A9242C72AF9A0C15AB0FA3979F',
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
checkUniversity();

module.exports = checkUniversity;
