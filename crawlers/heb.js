const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const renderSlackMessage = require('../utils/renderSlackMessage');
const capitalizeSentance = require('../utils/capitalizeSentance');
const hebURL = 'https://heb-ecom-covid-vaccine.hebdigital-prd.com/vaccine_locations.json';
const scheduleURL = 'https://vaccine.heb.com/scheduler';

dotenv.config();

const webhookURL = process.env.HEB_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookURL);

let lastRunSlotCount = [];

const excludedCities = [
  'odessa',
  'midland',
  'mcallen',
];

const slotThreshold = 4;

const extractSlotDetails = (slotDetails) => slotDetails.map((deets) => deets.manufacturer).join(' ');

const checkHeb = async () => {
  try {
    console.log('Checking HEB for vaccines...');
    const response = await fetch(hebURL);
    const vaccineLocations = await response.json();

    if (lastRunSlotCount.length === 0) {
      lastRunSlotCount = vaccineLocations['locations'];
    }

    const locationsWithVaccine = {};

    for (location in vaccineLocations.locations) {
      if (vaccineLocations.locations.hasOwnProperty(location)) {
        const {name, openAppointmentSlots, city, street, url, slotDetails} = vaccineLocations.locations[location];
        const manufacturers = extractSlotDetails(slotDetails);


        if (openAppointmentSlots > slotThreshold && !excludedCities.includes(city.toLowerCase())) {
          locationsWithVaccine[name] = {name, openAppointmentSlots, city, url, street, manufacturers};
        }
      }
    }

    if (Object.keys(locationsWithVaccine).length === 0) {
      return;
    }

    const slackFields = [];

    for (location in locationsWithVaccine) {
      if (locationsWithVaccine.hasOwnProperty(location)) {
        const {openAppointmentSlots, city, url, street, name, manufacturers} = locationsWithVaccine[location];
        const capatilizedCity = capitalizeSentance(city);
        const urlFriendlyAddress = `${street.split(' ').join('+')}+${city.split(' ').join('+')}`;
        const lastFound = lastRunSlotCount.find((locale) => locale.name === name);

        if (openAppointmentSlots > (lastFound.openAppointmentSlots + slotThreshold)) {
          slackFields.push({
            type: 'mrkdwn',
            text: `<${url || hebURL}|${location}>:  *${openAppointmentSlots}* \n<https://google.com/maps/?q=${urlFriendlyAddress}|${capatilizedCity}> \n${manufacturers}`,
          });
        }
      }
    }

    if (slackFields.length > 10) {
      slackFields.length = 10; // Slack limits the number of fields to 10
    }

    if (slackFields.length > 0) {
      const slackMessage = renderSlackMessage(scheduleURL, slackFields);
      await webhook.send(slackMessage);
    }

    lastRunSlotCount = vaccineLocations['locations'];
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkHeb;
