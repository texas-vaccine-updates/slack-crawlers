require('dotenv').config();
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const jp = require('jsonpath');
const {IncomingWebhook} = require('@slack/webhook');
const renderUniversitySlackMessage = require('../utils/renderUniversitySlackMessage');
const getDateString = require('../utils/getDateString');
const universityURL = 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788';

const url = process.env.UNIVERSITY_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const noCache = Math.random();
const universityAPI = `https://mychart-openscheduling.et1130.epichosted.com/MyChart/OpenScheduling/OpenScheduling/GetOpeningsForProvider?noCache=${noCache}`;

const dateString = getDateString();

const options = {
  'headers': {
    '__requestverificationtoken': 'QKaWLfyX1vW8KDN4doUbH-t6H86r2mr-w1o-nfWtwR0z4EODPWU8sOkcAfSC7_96Y-Nu53tKIE9XTDqE7pqip8lNSoI1',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    'cookie': 'MyChart_Session=akrntuiooxfcryj0hilcllfi; __RequestVerificationToken_L015Q2hhcnQ1=9DZCgqYF_aAWTRTFm1QgGMIG0duj89QRgra7elQPjphg2I0QYtrAErSjylJEHkO3PQKwFIdB1PNjKg8jQ9o4Lds3KGQ1; MyChartLocale=en-US; MYCPERS=3372226220.47873.0000; .WPCOOKIE4mychart=FA34439385F3D6258F697125B0C702072E3617489ECAF93741B9D29A0A3AC8C9C89970238980AFC07298D3DA003A77FAD7906C776B9D809BFC603466BF7EC054F3123062E9EA8933D98DBC770A4B03E36B2E012AB0313415534484F58E6772B91E610BF6E238D465C79ED0E32369D95B8BEBD5BCAD0B34AC22645E669C414FDF0A12A95D3BCC03777584600A13B8A19A3AD6539BF9458D66D3FDF05AEEEDD04AD7906FA7F8A780D6CEBD6EAE8FF20556EC4735A286D6DAB21338FC56F2BD8122D8DAAD5275C729FFAF5AD557C0CDE33EFF927DC5DEE752B78BC021FC37EA22E56B6DAA4A127171A997E0E1476CDF3A3FA293E8CF',
  },
  'referrer': 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788',
  'referrerPolicy': 'same-origin',
  'body': `id=51748&vt=1788&dept=10554003&view=grouped&start=${dateString}&filters=%7B%22Providers%22%3A%7B%2251748%22%3Atrue%7D%2C%22Departments%22%3A%7B%2210554003%22%3Atrue%7D%2C%22DaysOfWeek%22%3A%7B%220%22%3Atrue%2C%221%22%3Atrue%2C%222%22%3Atrue%2C%223%22%3Atrue%2C%224%22%3Atrue%2C%225%22%3Atrue%2C%226%22%3Atrue%7D%2C%22TimesOfDay%22%3A%22both%22%7D`,
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

  const appointmentCount = jp.query(data, '$.AllDays..AppointmentTimeISO').length;

  if (appointmentCount > 0) {
    const message = appointmentCount === 1 ? `*${appointmentCount}* slot` : `*${appointmentCount}* slots`;
    try {
      await webhook.send(renderUniversitySlackMessage(universityURL, message));
    } catch (e) {
      console.error(e);
    }
  }
};

module.exports = checkUniversity;
