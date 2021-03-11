require('dotenv').config();
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const {IncomingWebhook} = require('@slack/webhook');
const renderStaticSlackMessage = require('../utils/renderStaticSlackMessage');
const getDateString = require('../utils/getDateString');
const isEmpty = require('../utils/isEmpty');
const universityURL = 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51585&dept=10554002&vt=1788&view=grouped';

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
  },
  'referrer': 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788&view=grouped',
  'referrerPolicy': 'same-origin',
  'body': `id=51585&vt=1788&dept=10554002&view=grouped&start=${dateString}&end=${futureDateString}&filters=%7B%22Providers%22%3A%7B%2251585%22%3Atrue%7D%2C%22Departments%22%3A%7B%2210554002%22%3Atrue%7D%2C%22DaysOfWeek%22%3A%7B%220%22%3Atrue%2C%221%22%3Atrue%2C%222%22%3Atrue%2C%223%22%3Atrue%2C%224%22%3Atrue%2C%225%22%3Atrue%2C%226%22%3Atrue%7D%2C%22TimesOfDay%22%3A%22both%22%7D`,
  'method': 'POST',
  'mode': 'cors',
};

const getTokenAndCookie = async () => {
  try {
    const response = await fetch(universityURL);
    const html = await response.text();
    const rawCookies = await response.headers.raw()['set-cookie'];
    const cookiesArrayNoDups = [...new Set(rawCookies)];
    const cookies = cookiesArrayNoDups.join(';');
    const $ = cheerio.load(html);
    const token = $('input[name="__RequestVerificationToken"]').val();

    return [token, cookies];
  } catch (e) {
    console.error(e);
  }
};

const checkUniversity = async () => {
  console.log('Checking University for vaccines...');
  const [token, cookie] = await getTokenAndCookie();
  options.headers.__requestverificationtoken = token;
  options.headers.cookie = cookie;

  let data;
  try {
    const response = await fetch(universityAPI, options);
    data = await response.json();
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
