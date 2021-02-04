const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const fhsURL = 'https://intakeq.com/booking/qfrufw';
const fhsAPI = 'https://intakeq.com/api/widget/times?date=2021-05-08&locationId=14&memberId=5e0513592604a710b0df15c9&mergedClinicId=5e0513592604a710b0df15c9&serviceId=ffa5ddd6-f0e0-499f-8295-50868aa84a9f&timezoneIana=America%2FChicago';

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
  try {
    let vaccineData;
    (async () => {
      const response = await fetch(fhsAPI);
      try {
        vaccineData = await response.json();
      } catch (e) {
        console.error(e);
      }

      if (!vaccineData.closed) {
        await webhook.send(staticSlackMessage);
      }
    })();
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkFHS;
