require('dotenv').config();
const fetch = require('node-fetch');
const {IncomingWebhook} = require('@slack/webhook');
const renderDomeSlackMessage = require('../utils/renderDomeSlackMessage');
const alamoURL = 'https://patportal.cdpehs.com/ezEMRxPHR/html/login/newPortalReg.jsp';
const alamoAPI = 'https://patportal.cdpehs.com/ezEMRxPHR/dwr/exec/AppointmentSchdlrAction.getMassProgramScheduleDet.dwr';

const url = process.env.ALAMO_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const options = {
  'headers': {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'text/plain',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'cookie': 'JSESSIONID=D1E52FA3B52DA6BA8BA01C0C39D5ADE3; lhc_per={%22vid%22:%226g97wlchy2h44lrkynj%22}',
  },
  'referrer': 'https://patportal.cdpehs.com/ezEMRxPHR/html/login/newPortalReg.htm?seed=1612812758646',
  'referrerPolicy': 'strict-origin-when-cross-origin',
  'body': 'callCount=1\nc0-scriptName=AppointmentSchdlrAction\nc0-methodName=getMassProgramScheduleDet\nc0-id=1799_1612814356660\nc0-param0=string:1545\nc0-param1=string:DOMECOVID\nc0-param2=number:3\nxml=true\n',
  'method': 'POST',
  'mode': 'cors',
};

const checkAlamodome = async () => {
  console.log('Checking Alamodome for vaccines...');
  try {
    const response = await fetch(alamoAPI, options);
    const data = await response.text();
    if (data.includes('value')) {
      await webhook.send(renderDomeSlackMessage(alamoURL));
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkAlamodome;
