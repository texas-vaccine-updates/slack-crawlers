const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const renderSlackMessage = require('../utils/renderSlackMessage');
const fhsURL = '';
const scheduleURL = '';

dotenv.config();

const url = process.env.FHS_WEBHOOK_URL;
const webhook = new IncomingWebhook(url);

const checkFHS = async () => {
  try {
    console.log('Checking FHS for vaccines...');
    const response = await fetch(fhsURL);
    const vaccineLocations = await response.json();

    if (response.status === 200) {
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkHeb;
