const fetch = require('node-fetch');
const dotenv = require('dotenv');
const {IncomingWebhook} = require('@slack/webhook');
const renderSlackMessage = require('../utils/renderSlackMessage');

const coryellURL = 'https://app.blockitnow.com/consumer/coryell-health/search?specialtyId=45a5acfb-ce82-473a-b320-7f415658031b&procedureId=a562eea5-c72b-4032-b2ba-1c15f3b444bb';
const coryellScheduleURL = 'https://api.blockitnow.com/';

dotenv.config();

const webhookURL = process.env.CORYELL_WEBHOOK_URL;
const webhook = new IncomingWebhook(webhookURL);
const query = `query SearchProfilesInOrganizationQuery($organizationId: ID!, $page: Int, $pageSize: Int, $searchProfilesInput: SearchProfilesInput!) {
  searchProfilesInOrganization(organizationId: $organizationId, page: $page, pageSize: $pageSize, searchProfilesInput: $searchProfilesInput) {
    id
    displayName
    prefix
    firstName
    LastName
    suffix
    phone
    email
    profileImgUrl
    professionalStatement
    boardCertifications
    educationTraining
    npiNumber
    specialty
    nextAvailability
    languages {
      code
      name
      __typename
    }
    organization {
      id
      name
      __typename
    }
    location {
      id
      name
      address1
      address2
      city
      state
      postalCode
      country
      distanceFromPatient
      distanceFromProvider
      latitude
      longitude
      phone
      timeZone
      __typename
    }
    isIntegrated
    isSendToProvider
    __typename
  }
}`;
const body = {
  query,
  operationName: 'SearchProfilesInOrganizationQuery',
  variables: {
    organizationId: 'abed2f58-0508-45c3-97bd-2ba4659c7942',
    page: 1,
    pageSize: 10,
    searchProfilesInput: {
      hasConsumerScheduling: true,
      isActive: true,
      organizationIsActive: true,
      procedureId: 'a562eea5-c72b-4032-b2ba-1c15f3b444bb', // dose 1
      // procedureId: "2318f28d-fc58-4181-a09b-2354e181c475", // for dose 2
      sort: 'NEXT_AVAILABILITY',
      specialtyId: '45a5acfb-ce82-473a-b320-7f415658031b', // dose 1
      // specialtyId: "45a5acfb-ce82-473a-b320-7f415658031b", //for dose 2
    },
  },
};

const headers = {
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'content-type': 'application/json',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'content-length': '1381',
  'origin': 'https://app.blockitnow.com',
};

const clinicsWithAppointments = [];

const checkCoryell = async () => {
  try {
    console.log('Checking Coryell for vaccines...');

    const response = fetch(coryellScheduleURL, {
      headers,
      method: 'post',
      body: JSON.stringify(body),
    }).then(async (response) => {
      if (response.status === 200) {
        try {
          result = await response.json();
        } catch (e) {
          console.error(e);
        }

        result.data.searchProfilesInOrganization.forEach((org) => {
          const {displayName, nextAvailability} = org;

          if (nextAvailability) {
            clinicsWithAppointments.push({store: displayName, nextAvailability});
          }
        });
      }
    });

    const slackFields = clinicsWithAppointments.map((clinic) => (
      {type: 'mrkdwn', text: clinic.name}
    ));

    if (slackFields.length > 10) {
      slackFields.length = 10; // Slack limits the number of fields to 10
    }
    if (slackFields.length > 0) {
      const slackMessage = renderSlackMessage(coryellURL, slackFields);
      await webhook.send(slackMessage);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = checkCoryell;
