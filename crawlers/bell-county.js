const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const renderBellSlackMessage = require('../utils/renderBellSlackMessage');

dotenv.config();

const url = process.env.BELL_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const killeenURL = 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices1@bellcountytx.onmicrosoft.com/bookings/service.svc/GetStaffBookability';
const templeURL = 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices2@bellcountytx.onmicrosoft.com/bookings/service.svc/GetStaffBookability';
const beltonURL = 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices3@bellcountytx.onmicrosoft.com/bookings/service.svc/GetStaffBookability';
const killeenScheduleURL = 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices1@bellcountytx.onmicrosoft.com/bookings/';
const templeScheduleURL = 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices2@bellcountytx.onmicrosoft.com/bookings/';
const beltonScheduleURL = 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices3@bellcountytx.onmicrosoft.com/bookings/';

const killeenOptions = {
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
  'body': '{"StaffList":["0K2vfoBvR0Gxqhjo3CzMog=="],"Start":"2021-02-28T00:00:00","End":"2021-05-01T00:00:00","TimeZone":"America/Chicago","ServiceId":"06oo6bJVYUmbCVQMl9fGmA2"}',
  'method': 'POST',
  'mode': 'cors',
};

const templeOptions = {
  'method': 'POST',
  'url': 'https://outlook.office365.com/owa/calendar/BellCountyTechnologyServices2@bellcountytx.onmicrosoft.com/bookings/service.svc/GetStaffBookability',
  'headers': {
    'Connection': ' keep-alive',
    'Content-Length': ' 167',
    'User-Agent': ' Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36',
    'DNT': ' 1',
    'Content-Type': ' application/json; charset=UTF-8',
    'Accept': ' */*',
    'Origin': ' https://outlook.office365.com',
    'Sec-Fetch-Site': ' same-origin',
    'Sec-Fetch-Mode': ' cors',
    'Sec-Fetch-Dest': ' empty',
    'Accept-Encoding': ' gzip, deflate, br',
    'Accept-Language': ' en-US,en;q=0.9',
    'Cookie': ' ClientId=BE2D9ACA38F24040B4F9F9A3A37B3159; OIDC=1; OutlookSession=cf26724c32b8467e8997c525221825ff; ClientId=464769C1B88C47E0A6E746414E366D2D; OIDC=1; OutlookSession=b603e3585022473485c04aca4f8af0a2',
  },
  'body': '{"StaffList":["oRNfXWZlGUOu7ts+5Z8G6A=="],"Start":"2021-02-02T00:00:00","End":"2021-04-02T00:00:00","TimeZone":"America/Chicago","ServiceId":"Am-gd-n3Fk-tWqxY7Ey1hQ2"}',

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

const checkBellCounty = async () => {
  try {
    console.log('Checking Bell County for vaccines...');
    const killeenRes = await fetch(killeenURL, killeenOptions);
    const templeRes = await fetch(templeURL, templeOptions);
    const beltonRes = await fetch(beltonURL, beltonOptions);

    const killeenData = await killeenRes.json();
    const templeData = await templeRes.json();
    const beltonData = await beltonRes.json();

    let killeenBookableItems = [];
    let templeBookableItems = [];
    let beltonBookableItems = [];

    try {
      killeenBookableItems = killeenData.StaffBookabilities[0].BookableItems;
    } catch (e) {
      console.error(e);
    }
    try {
      templeBookableItems = templeData.StaffBookabilities[0].BookableItems;
    } catch (e) {
      console.error(e);
    }
    try {
      beltonBookableItems = beltonData.StaffBookabilities[0].BookableItems;
    } catch (e) {
      console.error(e);
    }

    if (killeenBookableItems.length > 0) {
      const slackMessage = renderBellSlackMessage(killeenScheduleURL, 'Killeen');
      await webhook.send(slackMessage);
    }
    if (templeBookableItems.length > 0) {
      const slackMessage = renderBellSlackMessage(templeScheduleURL, 'Temple');
      await webhook.send(slackMessage);
    }
    if (beltonBookableItems.length > 0) {
      const slackMessage = renderBellSlackMessage(beltonScheduleURL, 'Belton');
      await webhook.send(slackMessage);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkBellCounty;
