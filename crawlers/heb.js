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
  const response = await fetch(hebURL);
  const vaccineLocations = await response.json();

  if (response.status === 200) {
    console.log('Checking HEB for vaccines...');
    const locationsWithVaccine = {};

    for (location in vaccineLocations.locations) {
      if (vaccineLocations.locations.hasOwnProperty(location)) {
        const {name, openTimeslots, city} = vaccineLocations.locations[location];

        if (openTimeslots !== 0) {
          locationsWithVaccine[name] = {openTimeslots, city};
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
        const {openTimeslots, city} = locationsWithVaccine[location];

        slackFields.push({
          type: 'mrkdwn',
          text: `${location}: *${openTimeslots}* \n${city}`,
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

  console.log('Done.');
};

module.exports = checkHeb;