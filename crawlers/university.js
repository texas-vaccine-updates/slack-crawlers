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
            'cookie': 'MyChartLocale=en-US; MyChart_Session=btf4afup54w3ztl1qaudvtwg; __RequestVerificationToken_L015Q2hhcnQ1=Mr_ptJobuc6ngi_Go2h4aF6b754TmYC_sipjFR6P9-1he7VVdVnd_GNlQedlFENqmLacvh1qeDprgNp71LoVRpR5zI01; MYCPERS=3456112300.47873.0000; .WPCOOKIE4mychart=D513FA7CA11D2E54AF2F722423B46230C05DF0CAE3EC30AF6D4BC5F39CFA64A1494802376D22818B43977800DAD79E6299509600824295DEC8CB5ADFD18122A4D9062076FE0DBA09A1A9AED4ECA39B34A1B58626000250CD64A361674380C9771398A2BC077AFA9FDD10E9AC0075C38EE0DFFE7E6230932F6298C489E078095D9E8B926EBCDAAFE09EDCD3AA51B92048D4CC5946B21F318C420DEEE36583D522763A71CB14FC275FAEADF1B562AE85ED2ACDC07CA9BD4EABD47F1FF440FC841065DD8A1924645A127C5DEC80A5D08BB3F325A1841FF3A443F0981707B77E4B2E4D9DD9598054E5BB3EA9D155F22FD0E2886BA962753221E07EF6162DEB5891FF5783241ABC937818DD9C3FC96BB69BB948062BD86B80F1C193DA10AA1C8CE4BE2CDC95A36057F71C84266BA23E2974090148C16475CEAF64680AF4784B5EC4F16F1D317F02A059395BDDEA05B12157275F1A1DEFB3477BC509ECFBD32351028A36D0C89890989E5F998736325497B0021922B9F242846A672CA0CF89243F0208A2ADAAECCB2C49D36F4EC97491D1A11EC9F7FACCA156BA885E78EED5D21629A2E4B9066A90EFDB3F56CAE78D95EB7DA61EE7D28CEC6021D78B147174EFC81F538E6FDCC3F615DE6E6F5061BEB019DEF2261D7448B91EEAEE94DDDB14ACC94D2F0DDDBCE5521E49F380E10F61819B2BD73316F878DEC08D77EF15BE82E64C91EC9234101B868F499D6E2BD1116B00A7C5F69043FF07A2C92A0B5990E3B672D0999D3D1F87593EEF64F6F7CCD12470E644A0C2A3AB93833790998EB3C81AE4BA63FD49527B61E610F440C540A295691F605A4D95793D3897810C8B006F8CA5EE99D70CDB3B7023D9E0986BB5154B7FD4AB004354AEA1206F55021FACF21C9D36BF9AF9D93AC9D69D0D433DE3A9A3448BD0D78C360CE9F51EDDA65FDEFA83E5DD8ECA38CBEF1A88654F3C4153E3FB726ED249C6F93467EFDE419A9DD8CDEC0A4BE5B47802BCA3F61E515F78A46306299E490487AC3341C08377C8263BB8021F00163570EF268762CCED946F8819ED0E91ACEF17E35FDB6E851D92E1307C9785BCCCD9163118DCA8AC4E69E5A086DA25D60A4AF602E3C5469E8EF432A4CC6BE62D491E97990C32E1FE54776FD78FE4C3232D1DFFDD915147294CB4C751DE2F1210B201BB462137858E5727E0E471F994C340090D0B6B34A50C4EF0D89BB4C32A48699D3A01ED',
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
