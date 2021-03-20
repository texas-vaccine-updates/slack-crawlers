require('dotenv').config();
const express = require('express');
const cron = require('node-cron');
const fetch = require('node-fetch');
const {setIntervalAsync} = require('set-interval-async/dynamic');
const checkHeb = require('./crawlers/heb');
const checkAlamodome = require('./crawlers/alamodome');
const checkBellCounty = require('./crawlers/bell-county');
const checkUniversity = require('./crawlers/university');
const checkFallsHospital = require('./crawlers/falls-hospital');
// const checkCoryell = require('./crawlers/coryellhealth');
const checkWalmart = require('./crawlers/walmart');
const checkWalgreens = require('./crawlers/walgreens')

const dotenv = require('dotenv');
const checkWalgreens = require('./crawlers/walgreens');
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
    // await checkRandalls(); NOTE: Currently being blocked by Albertsons
    // await checkCoryell(); TODO: FIX: 400 requests
    await checkWalmart();
    await checkWalgreens();
    await checkFallsHospital();
  } catch (error) {
    console.error(error);
  }
});

try {
  setIntervalAsync(
      async () => {
        await checkHeb();
      },
      1000 * 5,
  );
} catch (e) {
  console.error(e);
}

app.listen(process.env.PORT);
