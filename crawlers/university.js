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
    '__requestverificationtoken': 'S5HgmjIeQCPvhr4PHa9Dv2YJZoyDALC0S8vG-HjIPtiTy-T998PvHO4l1rLZIXj2eBKDtcY9SIF0SnY8VGHbRgJutic1',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    'cookie': 'MyChartLocale=en-US; MyChart_Session=up3qqy3z4g000ag4zkiom2dy; __RequestVerificationToken_L015Q2hhcnQ1=Tms0Jhmklly2XnnN_Lnwn0gpQF5Or_UxtnHEGICQloUNUlPO-AYoYBCt0dVC6k3S8cZw76HvjDboUZOOWkzsMBjjHrQ1; MYCPERS=3456112300.47873.0000; .WPCOOKIE4mychart=52AFEC86E73628B7E97E510E969249F8A1FCBCE4FB3D4895DAB28798B876148EE92C0431CE1FAC370221AC0B13E743C7DFE999F6E83068A627A8A3DAF08587BDFC5DAD674EFC2600BFC993AA1469E8CC0138B1E6FFDCDAF098EEF07EC5F3FFE7E9343097DF96A953BA0A0344808D4833D0E72290880C88C4B08BF541924F56B050C124EDC48EFF4FBF740C15E7C9BF0B2BBD74540A91E928C5F4714871160BE1F30830A3E8ED7730C3D323D08FEE814C0F7A3E8E71485F5A49A22383465E83179E44D5F118AD78A055E1CC0599B3C2E5F27F7D56EC023CD612A9123C9527E7E407186EDCB4E1698BBFEF1CB814D3DA703B793591',
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
