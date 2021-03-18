require('dotenv').config();
const fetch = require('node-fetch');
const {IncomingWebhook} = require('@slack/webhook');
const renderBellSlackMessage = require('../utils/renderBellSlackMessage');

const url = process.env.BELL_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const killeenURL = 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices1@bellcountytx.onmicrosoft.com/bookings/service.svc/GetStaffBookability';
const beltonURL = 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices3@bellcountytx.onmicrosoft.com/bookings/service.svc/GetStaffBookability';
const killeenScheduleURL = 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices1@bellcountytx.onmicrosoft.com/bookings/';
const beltonScheduleURL = 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices3@bellcountytx.onmicrosoft.com/bookings/';

const killeenOptions = {
  'headers': {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json; charset=UTF-8',
    'sec-ch-ua': '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'cookie': 'ClientId=BE2D9ACA38F24040B4F9F9A3A37B3159; OIDC=1; OutlookSession=dd8fb5e91c494cd48c128a97330eca17',
  },
  'referrerPolicy': 'no-referrer',
  'body': '{"StaffList":["0K2vfoBvR0Gxqhjo3CzMog=="],"Start":"2021-03-14T00:00:00","End":"2021-05-02T00:00:00","TimeZone":"America/Chicago","ServiceId":"06oo6bJVYUmbCVQMl9fGmA2"}',
  'method': 'POST',
  'mode': 'cors',
};

const beltonOptions = {
  'headers': {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/json; charset=UTF-8',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'cookie': 'ClientId=BE2D9ACA38F24040B4F9F9A3A37B3159; OIDC=1; OutlookSession=62f718dc95d94dfba2817aabd4cdb90f',
  },
  'referrerPolicy': 'no-referrer',
  'body': '{"StaffList":["rZKlNcMJ60u2fhfMvudNCg=="],"Start":"2021-02-28T00:00:00","End":"2021-04-02T00:00:00","TimeZone":"America/Chicago","ServiceId":"W-169pjrAkyQl0ElzvRl0A2"}',
  'method': 'POST',
  'mode': 'cors',
};

// NOTE: Temple has paused vaccinations
let lastBookedKilleen = 0; let lastBookedBelton = 0;
const checkBellCounty = async () => {
  try {
    const now = new Date().getTime();
    console.log('Checking Bell County for vaccines...');
    const killeenRes = await fetch(killeenURL, killeenOptions);
    const beltonRes = await fetch(beltonURL, beltonOptions);

    const killeenData = await killeenRes.json();
    const beltonData = await beltonRes.json();

    let killeenBookableItems = [];
    let beltonBookableItems = [];

    try {
      killeenBookableItems = killeenData.StaffBookabilities[0].BookableItems;
    } catch (e) {
      console.error(e);
    }
    try {
      beltonBookableItems = beltonData.StaffBookabilities[0].BookableItems;
    } catch (e) {
      console.error(e);
    }

    const interval = 1000 * 60 * 10;

    if (killeenBookableItems.length > 1 && now > (lastBookedKilleen + interval)) {
      lastBookedKilleen = now;
      const slackMessage = renderBellSlackMessage(killeenScheduleURL, 'Killeen');
      await webhook.send(slackMessage);
    }
    if (beltonBookableItems.length > 0 && now > (lastBookedBelton + interval)) {
      lastBookedBelton = now;
      const slackMessage = renderBellSlackMessage(beltonScheduleURL, 'Belton');
      await webhook.send(slackMessage);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkBellCounty;
