const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const texasRandalls = require('../schemas/randalls_locations.json');
const renderSlackMessage = require('../utils/renderSlackMessage');

dotenv.config();

const url = process.env.ALBERTSONS_WEBHOOK_URL;
const scheduleURL = 'https://www.mhealthappointments.com/covidappt';
const webhook = new IncomingWebhook(url);

const _r = '8996978612546209';
const csrfKey = 'pSuTwtegz0GQHSQt-AhI';
const cookie = '_ga=GA1.3.II0ynmRV1omFIP5gOUX-j-KMeKCWAp-LRVlRLLATRhgvdAzyMz22wxzgpAgGOvxgE8kpGwBvcHhGsBQEBVhOIfHmv7tWg-e1VLp4eyC_VGHna5iSm_upyfhf9LRGNyJj995gljFXyHt6kJEI6XiW_KbZ7jh3cql3dpcgLZVEfEoUuiD1t7TXqWHUYfrAd-h6G3fFxDpRH49xc4mp_WDEVTDk99rONRfGJ-pvh4MZ0is5UCCkpZrlo6I9J6NzaMuh; JSESSIONID=6B6B6E4DEDF871F44F0B2B5682632CF5; _gid=GA1.3.2130096785.1612976263; _gat=1; AWSALBTG=VGGiRl4uJYaNFLLGV0IO4wnOTNds1OhI33q309dam46/KezjpCqT+1oy+HOWOh0akB3/Pn2/FqyuhmKCpd7dkpt+3Y1r3ji3Gc2uP6x13dAy0K2/lv4PbQ3u86s1C5TACwUKhDamqQavKvYOhkwgueqhg0dCg6DeP2O8R2wMt72E3owJEf0=; AWSALBTGCORS=VGGiRl4uJYaNFLLGV0IO4wnOTNds1OhI33q309dam46/KezjpCqT+1oy+HOWOh0akB3/Pn2/FqyuhmKCpd7dkpt+3Y1r3ji3Gc2uP6x13dAy0K2/lv4PbQ3u86s1C5TACwUKhDamqQavKvYOhkwgueqhg0dCg6DeP2O8R2wMt72E3owJEf0=; AWSALB=Rn4svEJlutqQ6hbi5szCQ47/QxD6IW3FnyFO22BINqDOgEgUVEbZhmkPVwtQGwJ8PjFdhYGudmYIkoqejZPJhf7d9JgVCJA67fbOlyo/xiPm/EZWVfNBgs8iBBf+; AWSALBCORS=Rn4svEJlutqQ6hbi5szCQ47/QxD6IW3FnyFO22BINqDOgEgUVEbZhmkPVwtQGwJ8PjFdhYGudmYIkoqejZPJhf7d9JgVCJA67fbOlyo/xiPm/EZWVfNBgs8iBBf+';

const checkRandalls = async () => {
  console.log('Checking Randalls for vaccines...');
  const storesWithAppointments = [];
  const promises = texasRandalls.map((store) =>
    fetch(`https://kordinator.mhealthcoach.net/loadEventSlotDaysForCoach.do?_r=${_r}&csrfKey=${csrfKey}`, {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,es;q=0.8',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8;',
        'pragma': 'no-cache',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'cookie': cookie,
      },
      referrer: 'https://kordinator.mhealthcoach.net/vt-kit-v2/index.html',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: `slotsYear=2021&slotsMonth=1&forceAllAgents=&manualOptionAgents=&companyName=${store.clientName}&eventType=COVID+Vaccine+Dose+1+Appt&eventTitle=&location=Randalls+-+5145+N+Fm+620+Rd+Suite+A%2C+Austin%2C+TX%2C+78732&locationTimezone=America%2FChicago&csrfKey=DMKFcrRW0vw-QLuYnUQw`,
      method: 'POST',
      mode: 'cors',
    },
    ).then(async (res) => {
      try {
        result = await res.json();
      } catch (e) {
        console.log(e);
      }
      if (result.slotDates.length > 0) {
        storesWithAppointments.push({...store, slotDates: result.slotDates});
      }
    }),
  );

  await Promise.allSettled(promises);
  const slackFields = storesWithAppointments.map((store) => {
    return {
      type: 'mrkdwn',
      text: store.name,
    };
  });

  if (slackFields.length > 10) {
    slackFields.length = 10; // Slack limits the number of fields to 10
  }
  if (slackFields.length > 0) {
    const slackMessage = renderSlackMessage(scheduleURL, slackFields);
    await webhook.send(slackMessage);
  }
};

module.exports = checkRandalls;
