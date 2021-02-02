const cron = require('node-cron');
const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const hebURL = 'https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json';

const cronJobInterval = '*/2 * * * *';

app = express();
dotenv.config();

const url = process.env.SLACK_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const keepaliveURL = 'https://texas-vaccines.herokuapp.com/';

app.get('/', function(req, res) {
  res.send('Staying alive.');
});

const renderSlackMessage = (locations) => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Vaccines are available! 💉*',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Click @here to schedule:',
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Schedule',
            emoji: true,
          },
          value: 'vaccine',
          url: 'https://vaccine.heb.com/scheduler',
          action_id: 'button-action',
        },
      },
      {
        'type': 'divider',
      },
      {
        'type': 'section',
        'fields': locations,
      },
    ],
  };
};


cron.schedule(cronJobInterval, () => {
  try {
    (async () => {
      const keep = await fetch(keepaliveURL);
      const alive = await keep.text();
      console.log(alive);

      const response = await fetch(hebURL);
      const vaccineLocations = await response.json();

      if (response.status === 200) {
        console.log('Checking for vaccines...');
        const locationsWithVaccine = {};

        for (const location in vaccineLocations.locations) {
          if (vaccineLocations.locations.hasOwnProperty(location)) {
            const {name, openTimeslots} = vaccineLocations.locations[location];

            if (openTimeslots !== 0) {
              console.log('Vaccines available.');
              locationsWithVaccine[name] = openTimeslots;
            }
          }
        }


        if (Object.keys(locationsWithVaccine).length === 0) {
          console.log('No Vaccines found.');
          return;
        }

        const slackFields = [];

        for (location in locationsWithVaccine) {
          if (locationsWithVaccine.hasOwnProperty(location)) {
            const count = locationsWithVaccine[location];

            slackFields.push({
              'type': 'mrkdwn',
              'text': `${location}: *${count}*`,
            });
          }
        }

        if (slackFields.length > 10) {
          slackFields.length = 10; // Slack limits the number of fields to 10
        }

        const slackMessage = renderSlackMessage(slackFields);
        await webhook.send(slackMessage);
      }

      console.log('Done.');
    })();
  } catch (error) {
    console.error(error);
  }
});

app.listen(process.env.PORT);
