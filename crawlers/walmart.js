require('dotenv').config();
const fetch = require('node-fetch');
const {IncomingWebhook} = require('@slack/webhook');
const renderSlackMessage = require('../utils/renderSlackMessage');
const walmartURL = 'https://www.vaccinespotter.org/api/v0/states/TX.json';
const scheduleURL = 'https://www.walmart.com/pharmacy/clinical-services/immunization/scheduled?imzType=covid';

const webhookURL = process.env.WALMART_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookURL);

let lastRunSlotCount = [];

const includedCities = [
  'austin',
  'cedar park',
  'buda',

];

const checkWalmart = async () => {
  console.log('Checking Walmart for vaccines...');
  try {
    const response = await fetch(walmartURL);
    const data = await response.json();


    const walmartStores = data.features.filter((location) => {
      const {provider_brand, appointments} = location.properties;
      return provider_brand === 'walmart' && (appointments && appointments.length > 3);
    });

    if (lastRunSlotCount.length === 0) {
      lastRunSlotCount = walmartStores;
    }

    console.log(walmartStores[3].properties.appointments);

    const slackFields = [];

    walmartStores.forEach((store) => {
      const {id, city, name, address, appointments, postal_code} = store.properties;
      const urlFriendlyAddress = `${address.split(' ').join('+')}}`;
      const lastFound = lastRunSlotCount.find((locale) => locale.properties.id === id) || [];

      if (appointments.length > (lastFound.properties.appointments.length)) {
        slackFields.push({
          type: 'mrkdwn',
          text: `<${scheduleURL}|${name}>:  *${appointments.length}* \n<https://google.com/maps/?q=${urlFriendlyAddress}|${city}, ${postal_code}>`,
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

    lastRunSlotCount = walmartStores;
  } catch (e) {
    console.error(e);
  }
};

checkWalmart();

module.exports = checkWalmart;
