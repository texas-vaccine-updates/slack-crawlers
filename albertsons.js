const fetch = require("node-fetch");
const dotenv = require("dotenv");
const { IncomingWebhook } = require("@slack/webhook");
const texasRandalls = require("./randalls_locations.json");
const renderSlackMessage = require("./utils/renderSlackMessage");

dotenv.config();

const url = process.env.SLACK_WEBHOOK_URL;
const scheduleURL = 'https://www.mhealthappointments.com/covidappt';
const webhook = new IncomingWebhook(url);

const checkRandalls = async () => {
  const storesWithAppointments = [];
  const promises = texasRandalls.map((store) =>
    fetch(
      "https://kordinator.mhealthcoach.net/loadEventSlotDaysForCoach.do?_r=2796256831995363&csrfKey=U0_OsFJtgsfQYEGGrn_h",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,es;q=0.8",
          "cache-control": "no-cache",
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8;",
          pragma: "no-cache",
          "sec-ch-ua":
            '"Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"',
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "cookie": "_ga=GA1.3.II0ynmRV1omFIP5gOUX-j-KMeKCWAp-LRVlRLLATRhgvdAzyMz22wxzgpAgGOvxgE8kpGwBvcHhGsBQEBVhOIfHmv7tWg-e1VLp4eyC_VGHna5iSm_upyfhf9LRGNyJj995gljFXyHt6kJEI6XiW_KbZ7jh3cql3dpcgLZVEfEoUuiD1t7TXqWHUYfrAd-h6G3fFxDpRH49xc4mp_WDEVTDk99rONRfGJ-pvh4MZ0is5UCCkpZrlo6I9J6NzaMuh; _gid=GA1.3.144205805.1612231811; _gat=1; JSESSIONID=DC2CA7CB09D41C782F79CDB3411D69A2; AWSALBTG=bH4p3gC3FSqPiz0Z7fEL15k6XrJyRAA9lDdtLEerLItLj27HTvjju20Y0GsZtIoHxuNL2BkzwUpek43oaOosmZFT/0VOcTbDXHoOokTlNueCQSM4wfdi1fl7q3ztxnvxArYzy3L7yDCCQe9DhZt5EqYXEEgKGaaBp/VTkT+r+1WmwN9QuN0=; AWSALBTGCORS=bH4p3gC3FSqPiz0Z7fEL15k6XrJyRAA9lDdtLEerLItLj27HTvjju20Y0GsZtIoHxuNL2BkzwUpek43oaOosmZFT/0VOcTbDXHoOokTlNueCQSM4wfdi1fl7q3ztxnvxArYzy3L7yDCCQe9DhZt5EqYXEEgKGaaBp/VTkT+r+1WmwN9QuN0=; AWSALB=Uo2pQnMx4RQRdJ+KzCXKHgU+h1490rHHRuP0pwZLQQ02DWnh+nPyFsP97NKJHkQqIWv+NK6qDALGcI92PNfUfrPSi5ROVD5M8mns0YZ+dw16RczPAowgOVlequHW; AWSALBCORS=Uo2pQnMx4RQRdJ+KzCXKHgU+h1490rHHRuP0pwZLQQ02DWnh+nPyFsP97NKJHkQqIWv+NK6qDALGcI92PNfUfrPSi5ROVD5M8mns0YZ+dw16RczPAowgOVlequHW"
        },
        referrer: "https://kordinator.mhealthcoach.net/vt-kit-v2/index.html",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: `slotsYear=2021&slotsMonth=1&forceAllAgents=&manualOptionAgents=&companyName=${store.clientName}&eventType=COVID+Vaccine+Dose+1+Appt&eventTitle=&location=Randalls+-+5145+N+Fm+620+Rd+Suite+A%2C+Austin%2C+TX%2C+78732&locationTimezone=America%2FChicago&csrfKey=DMKFcrRW0vw-QLuYnUQw`,
        method: "POST",
        mode: "cors",
      }
    ).then(async (res) => {
      try {
        result = await res.json();
      } catch (e) {
        console.log(e);
      }
      console.log(`${store.clientName} ${JSON.stringify(result.slotDates)}`);
      if (result.slotDates.length > 0) {
        storesWithAppointments.push({ ...store, slotDates: result.slotDates });
      }
    })
  );

  await Promise.allSettled(promises);
  const slackFields = storesWithAppointments.map(store => {
    return {
      type: 'mrkdwn',
      text: store.name
    }
  });

  if (slackFields.length > 10) {
    slackFields.length = 10; // Slack limits the number of fields to 10
  }
  if (slackFields.length > 0) {
    const slackMessage = renderSlackMessage(scheduleURL, slackFields);
    await webhook.send(slackMessage);
  }  
};

checkRandalls();

module.exports = checkRandalls;


