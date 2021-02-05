const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const fhsURL = '';
const fhsAPI = '';

dotenv.config();

const url = process.env.UNIVERSITY_WEBHOOK_URL;
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
