require('dotenv').config();
const fetch = require('node-fetch');
const {IncomingWebhook} = require('@slack/webhook');
const renderSlackMessage = require('../utils/renderSlackMessage');
const capitalizeSentance = require('../utils/capitalizeSentance');
const walgreensURL = 'https://www.vaccinespotter.org/api/v0/states/TX.json';
const scheduleURL = 'https://www.walgreens.com/findcare/vaccination/covid-19';

const webhookURL = process.env.WALGREENS_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookURL);

let lastRunSlotCount = [];

const checkWalgreens = async () => {
  console.log('Checking Walgreens for vaccines...');
  try {
    const response = await fetch(walgreensURL);
    const data = await response.json();


    const walgreensStores = data.features.filter((location) => {
      const {provider_brand, appointments, city} = location.properties;
      return provider_brand === 'walgreens' && appointments?.length > 15 && city !== 'HUMBLE';
    });

    if (lastRunSlotCount.length === 0) {
      lastRunSlotCount = walgreensStores;
    }

    const slackFields = [];

    walgreensStores.forEach((store) => {
      const {id, city, name, appointments, postal_code} = store.properties;
      const lastFound = lastRunSlotCount.find((locale) => locale.properties.id === id);
      const lastRunLength = lastFound?.properties.appointments?.length || 0;
      const prettyCity = capitalizeSentance(city);

      if (appointments.length > (lastRunLength + 15)) {
        slackFields.push({
          type: 'mrkdwn',
          text: `<${scheduleURL}|${name}>:  *${appointments.length}* \n<https://google.com/maps/?q=${postal_code}|${prettyCity}, ${postal_code}>`,
        });
      }
    });

    if (slackFields.length > 10) {
      slackFields.length = 10; // Slack limits the number of fields to 10
    }

    if (slackFields.length > 0) {
      const slackMessage = renderSlackMessage(scheduleURL, slackFields);
      await webhook.send(slackMessage);
    }

    lastRunSlotCount = walgreensStores;
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkWalgreens;
