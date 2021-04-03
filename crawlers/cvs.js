require('dotenv').config();
const fetch = require('node-fetch');
const {IncomingWebhook} = require('@slack/webhook');
const renderSlackMessage = require('../utils/renderSlackMessage');
const cvsURL = 'https://www.vaccinespotter.org/api/v0/states/TX.json';
const scheduleURL = 'https://www.cvs.com/vaccine/intake/store/covid-screener/covid-qns';

const webhookURL = process.env.CVS_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookURL);

let lastRunSlotCount = [];

const checkCvs = async () => {
  console.log('Checking CVS for vaccines...');
  try {
    const response = await fetch(cvsURL);
    const data = await response.json();


    const cvsStores = data.features.filter((location) => {
      const {provider_brand, appointments} = location.properties;
      return provider_brand === 'cvs' && appointments?.length > 3;
    });

    if (lastRunSlotCount.length === 0) {
      lastRunSlotCount = cvsStores;
    }

    const slackFields = [];

    cvsStores.forEach((store) => {
      const {id, city, name, appointments, postal_code} = store.properties;
      const lastFound = lastRunSlotCount.find((locale) => locale.properties.id === id);
      const lastRunLength = lastFound?.properties.appointments?.length || 0;

      if (appointments.length > (lastRunLength + 3)) {
        slackFields.push({
          type: 'mrkdwn',
          text: `<${scheduleURL}|${name}>:  *${appointments.length}* \n<https://google.com/maps/?q=${postal_code}|${city}, ${postal_code}>`,
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

    lastRunSlotCount = cvsStores;
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkCvs;
