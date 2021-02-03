const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const texasRandalls = require('../schemas/randalls_locations.json');
const renderSlackMessage = require('../utils/renderSlackMessage');

dotenv.config();

const url = process.env.ALBERTSONS_WEBHOOK_URL;
const scheduleURL = 'https://www.mhealthappointments.com/covidappt';
const webhook = new IncomingWebhook(url);

const checkRandalls = async () => {
  console.log('Checking Randalls for vaccines...');
  const storesWithAppointments = [];
  const promises = texasRandalls.map((store) =>
    fetch('https://kordinator.mhealthcoach.net/loadEventSlotDaysForCoach.do?_r=5959539937451845&csrfKey=r9pl_2bJO1eF1dBdhx8', {
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
        'cookie': '_ga=GA1.3.II0ynmRV1omFIP5gOUX-j-KMeKCWAp-LRVlRLLATRhgvdAzyMz22wxzgpAgGOvxgE8kpGwBvcHhGsBQEBVhOIfHmv7tWg-e1VLp4eyC_VGHna5iSm_upyfhf9LRGNyJj995gljFXyHt6kJEI6XiW_KbZ7jh3cql3dpcgLZVEfEoUuiD1t7TXqWHUYfrAd-h6G3fFxDpRH49xc4mp_WDEVTDk99rONRfGJ-pvh4MZ0is5UCCkpZrlo6I9J6NzaMuh; _gid=GA1.3.279347536.1612241002; JSESSIONID=09D48121AEA538F9822693D883F1CAD0; _gat=1; AWSALBTG=MNGzimvr/948lCii5AKgqgMqqrNAV+MeICBNBdZ7ipohNP+XwpqLqjB/g2ZOJMnJw2LzlEPO8L9F9UlZ+G2boXuvaC6cWFmdaBHUsSZoEu7u2ZHHD84zQhMHJAe70JH5VadxLmIOB3w1o7F4pC6hfQCnVyhIH/2DwDUpU+dWXClMw8TaEC8=; AWSALBTGCORS=MNGzimvr/948lCii5AKgqgMqqrNAV+MeICBNBdZ7ipohNP+XwpqLqjB/g2ZOJMnJw2LzlEPO8L9F9UlZ+G2boXuvaC6cWFmdaBHUsSZoEu7u2ZHHD84zQhMHJAe70JH5VadxLmIOB3w1o7F4pC6hfQCnVyhIH/2DwDUpU+dWXClMw8TaEC8=; AWSALB=TbL8BpEVankHHDfVo17xD/mNlIYL/lgnzfThGpAw7XBu5a8czfQQs0EntwvCQ0NpLDz2ND+QvYTvc29EVPjJDFkLPgrPcJUSbhx7XPP0kJzbwcA0ldCE0O4lX3BT; AWSALBCORS=TbL8BpEVankHHDfVo17xD/mNlIYL/lgnzfThGpAw7XBu5a8czfQQs0EntwvCQ0NpLDz2ND+QvYTvc29EVPjJDFkLPgrPcJUSbhx7XPP0kJzbwcA0ldCE0O4lX3BT',
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
