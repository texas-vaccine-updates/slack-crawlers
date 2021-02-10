const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const renderSlackMessage = require('../utils/renderSlackMessage');
const hebURL = 'https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json';
const scheduleURL = 'https://vaccine.heb.com/scheduler';

dotenv.config();

const url = process.env.HEB_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const checkHeb = async () => {
  try {
    console.log('Checking HEB for vaccines...');
    const response = await fetch(hebURL);
    const vaccineLocations = await response.json();

    if (response.status === 200) {
      const locationsWithVaccine = {};

      for (location in vaccineLocations.locations) {
        if (vaccineLocations.locations.hasOwnProperty(location)) {
          const {name, openTimeslots, city, url} = vaccineLocations.locations[location];

          if (openTimeslots > 3) {
            locationsWithVaccine[name] = {openTimeslots, city, url};
          }
        }
      }

      if (Object.keys(locationsWithVaccine).length === 0) {
        return;
      }

      const slackFields = [];

      for (location in locationsWithVaccine) {
        if (locationsWithVaccine.hasOwnProperty(location)) {
          const {openTimeslots, city, url} = locationsWithVaccine[location];
          slackFields.push({
            type: 'mrkdwn',

            text: `<${url}|${location}>:  *${openTimeslots}* \n${city}`,
          });
        }
      }

      if (slackFields.length > 10) {
        slackFields.length = 10; // Slack limits the number of fields to 10
      }

      if (slackFields.length > 0) {
        const slackMessage = renderSlackMessage(scheduleURL, slackFields);
        await webhook.send(slackMessage);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkHeb;
