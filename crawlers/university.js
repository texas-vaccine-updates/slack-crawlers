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
            '__requestverificationtoken': 'ojvbzlc_vzThMdoVjwzqyftvLchb1vVyrDgCdbB5Ck8ZjUuLekGdl22J-VIDbRoZycsJ3qb0X3PymC-yXFeFUy-0oas1',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'x-requested-with': 'XMLHttpRequest',
            'cookie': 'MyChartLocale=en-US; MyChart_Session=btf4afup54w3ztl1qaudvtwg; __RequestVerificationToken_L015Q2hhcnQ1=Mr_ptJobuc6ngi_Go2h4aF6b754TmYC_sipjFR6P9-1he7VVdVnd_GNlQedlFENqmLacvh1qeDprgNp71LoVRpR5zI01; MYCPERS=3456112300.47873.0000; .WPCOOKIE4mychart=C8EAD4B1DE32F08D97E3662DCA554A3DB64FB3F6BC09DAB3CCB8F424DF28E26AB9B565132FE956D47837D747DBCFEED340E74E51020520D7E23EED52BE1DD144F0B778EB25AE2A24C20941E4F1EA8C0C2B687991BDA8E9B9BC68703CAAD243C02DB723B3A1A119421D063F1FDEA3C0597773DF0E030345DBF227A75D9395DD6C1A63F6067167067D0FEAA4A46CE427753F15C2B503379107108F8DBF5F06D607A43C0A793F12D683AB5D539D8A0FDCEDDF6E889EE34B41C2872DAF0512416FA2B3758364E15055F12B7D54ED5481CC2B6EE3CB8FAA8D45B472FC905BC6D963885A9E7E83E14A37B407B6D2D2765D8CED31D9691BFD656ABAB9726650A1BB2F2E97AF7A2DA2D3ADE374FA8D05EA4CD4428626226FB7ABA4BD58E67F8C2BF8309EC5634961FBA6A9FEA78E990994DAA2F2B8C8EB0A5673AD0129B85C03496BBA227C152C3283806A17AF8F8E412FFD1E12A93ACB1393A330DADECE397DC0C1F6051861AAB6095A71A5932025221BEDA3A685E2A761B4B84EAD6F5EB234B6B8B588C2822880AD3386AB339B71D894F4955F8FA1DB3C6892A2CC3AB551CC251FDE75A79E0032D238FD849E63E642A2213FC26ADFF97C99C99C250B77F186E35AA6402916D55316CE7E37913EFD9CE73966BFD59CC72FFE3507D8E7058B01FB7E2C3CFD9AEBF20E75D16E929DE6EA604B9202DC4AC916B9CE262FCACED5EC7A2931B137E7916DAC06120CFDD53E9A10789439397A57B361382617EC5B310BF2DEAB6CEE38F9CD3921CBD0D32E1F900DD97470453752C99B633AD65E9BD400A1718B369687C7E89A1081CFFEAE32BF146343A85EA9126B2FE4B8F9C2DF0009DA8315D1D2D3AC583A6327A0429E2116490951032B048CAD62402D3F4C728C8E09BE6FBF4084D930426200E73AA99E11FBAAD7C24D0FC274F8E3A2561F661A40AD62629707E7005EA628B08585376123F46D99EC5F652E8F9D5BEADD372E837F5EAC340512025181976776972BFCDF028A975CF7BB338569CEDB3304684EB1D9905BD49282FB86FF53882CDA5471BD13A213889013343E796BB92078B87EADCB2D7EC1D1CCAF020135EE6E2455F2BFCCAB291E75EE6E8C24AF2F8DA0D5FEC5412F95B5FB9131795384F84E5A79D0C8065C5E374D966F8474627D88EC36345C8A22A8A29E570BBD623B4C7A6E3793D0A833EAB90102357DEDB6D45913849F0A21E0825FF529E13BC5',
          },
          'referrer': 'https://mychart-openscheduling.et1130.epichosted.com/MyChart/SignupAndSchedule/EmbeddedSchedule?id=51748&dept=10554003&vt=1788&view=grouped',
          'referrerPolicy': 'same-origin',
          'body': `id=51748&vt=1788&dept=10554003&view=grouped&start=${dateString}&end=${futureDateString}&filters=%7B%22Providers%22%3A%7B%2251748%22%3Atrue%7D%2C%22Departments%22%3A%7B%2210554003%22%3Atrue%7D%2C%22DaysOfWeek%22%3A%7B%220%22%3Atrue%2C%221%22%3Atrue%2C%222%22%3Atrue%2C%223%22%3Atrue%2C%224%22%3Atrue%2C%225%22%3Atrue%2C%226%22%3Atrue%7D%2C%22TimesOfDay%22%3A%22both%22%7D`,
          'method': 'POST',
          'mode': 'cors',
        };


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
