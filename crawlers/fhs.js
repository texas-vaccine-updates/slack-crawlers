const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const fhsURL = 'https://intakeq.com/booking/qfrufw';
const fhsAPI = 'https://intakeq.com/api/widget/disabledDates?locationId=14&memberId=5e0513592604a710b0df15c9&serviceId=ea88f0b8-64a3-40b9-9787-b986897c3e6b&timezoneIana=America/Chicago';

dotenv.config();

const url = process.env.FHS_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const staticSlackMessage = {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Vaccines are available! 💉 @channel*',
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'Click here to schedule:',
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'Schedule',
          emoji: true,
        },
        value: 'vaccine',
        url: fhsURL,
        action_id: 'button-action',
      },
    },
  ],
};


const checkFHS = async () => {
  console.log('Checking FHS for vaccines...');
  try {
    let disabledDates;
    (async () => {
      const response = await fetch(fhsAPI);
      try {
        disabledDates = await response.json();
      } catch (e) {
        console.error(e);
      }
      console.log(disabledDates.dates.length);
      if (disabledDates.dates.length < 80) {
        await webhook.send(staticSlackMessage);
      }
    })();
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkFHS;
