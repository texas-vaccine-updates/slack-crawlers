const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const texasRandalls = require('../schemas/randalls_locations.json');
const renderSlackMessage = require('../utils/renderSlackMessage');

dotenv.config();

const url = process.env.ALBERTSONS_WEBHOOK_URL;
const scheduleURL = 'https://www.mhealthappointments.com/covidappt';
const webhook = new IncomingWebhook(url);

const _r = '6369159135200748';
const csrfKey = 'hJhSAukesMYF9ns2sNql';
const cookie = '_gid=GA1.3.279347536.1612241002; AWSALB=x4s/dFEE4vrzuOChc7Dh7gHcYwQjufckUktJcxQkooMLXI5YS5JlEnrz6ucMcMg6XpsIzrfZR5glLWOv4GQz3Sy5YTo+jwsXXfW2W/IF7x9iQUUSxUfGzvj6N3kT; AWSALBCORS=x4s/dFEE4vrzuOChc7Dh7gHcYwQjufckUktJcxQkooMLXI5YS5JlEnrz6ucMcMg6XpsIzrfZR5glLWOv4GQz3Sy5YTo+jwsXXfW2W/IF7x9iQUUSxUfGzvj6N3kT; JSESSIONID=202059CB7B521A79FAB8F17A4DC2ED49; _ga=GA1.3.II0ynmRV1omFIP5gOUX-j-KMeKCWAp-LRVlRLLATRhgvdAzyMz22wxzgpAgGOvxgE8kpGwBvcHhGsBQEBVhOIUFZS3W8pDCEplLT4t26-W_zpkIXMK92DcQeUOVYld-bTxoBp7GkVCRKLR6Xr7MMvKpjK9gei6AXxpfRKGed0TEQMfFWuRGTyGpr3WvhZ-Ejr1nTcjTeNpIATI3YHKYAL740P6rOwazE3YgeDFWfnBRRyJ9bZZR5DuLGq85KnC-p; _gat=1; AWSALBTG=AEnogSiu88PEM70qMR+cPh+sX/LNcxeThOe1lSMQzCHZgOsQS1RhA5hNDUGl6wq7MZcDcNbffVm3HMqptI32J0fBMKogi9k751FYCZgQ9fPdj2CKBKJ3y/w9fS1MK/WYc/oIC2nsvv5hvCLIDoDtqXin9ohAnLifCnuoybt2y8y6JbjBReY=; AWSALBTGCORS=AEnogSiu88PEM70qMR+cPh+sX/LNcxeThOe1lSMQzCHZgOsQS1RhA5hNDUGl6wq7MZcDcNbffVm3HMqptI32J0fBMKogi9k751FYCZgQ9fPdj2CKBKJ3y/w9fS1MK/WYc/oIC2nsvv5hvCLIDoDtqXin9ohAnLifCnuoybt2y8y6JbjBReY=';

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
