const express = require('express');
const cron = require('node-cron');
const fetch = require('node-fetch');
const {setIntervalAsync} = require('set-interval-async/dynamic');
const checkHeb = require('./crawlers/heb');
// const checkRandalls = require('./crawlers/albertsons');
const checkAlamodome = require('./crawlers/alamodome');
const checkBellCounty = require('./crawlers/bell-county');
const checkUniversity = require('./crawlers/university');
const checkFallsHospital = require('./crawlers/falls-hospital');
const checkCoryell = require('./crawlers/coryellhealth');

const dotenv = require('dotenv');
dotenv.config();

const cronJobInterval = '*/1 * * * *';

app = express();

const keepaliveURL = process.env.KEEP_ALIVE_URL;

app.get('/alive', function(req, res) {
  res.send('Staying alive.');
});

cron.schedule(cronJobInterval, async () => {
  try {
    const keep = await fetch(keepaliveURL);
    const alive = await keep.text();
    console.log(alive);

    await checkBellCounty();
    await checkAlamodome();
    await checkUniversity();
    await checkFallsHospital();
    // await checkRandalls(); NOTE: Currently being blocked by Albertsons
    await checkCoryell();
  } catch (error) {
    console.error(error);
  }
});

try {
  setIntervalAsync(
      async () => {
        await checkHeb();
      },
      1000 * 10,
  );
} catch (e) {
  console.error(e);
}

app.listen(process.env.PORT);
