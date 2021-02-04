const express = require('express');
const cron = require('node-cron');
const fetch = require('node-fetch');
const checkHeb = require('./crawlers/heb');
const checkFHS = require('./crawlers/fhs');
const checkRandalls = require('./crawlers/albertsons');
const checkAlamodome = require('./crawlers/alamodome');
const checkBellCounty = require('./crawlers/bell-county');

const cronJobInterval = '*/2 * * * *';

app = express();

const keepaliveURL = 'https://texas-vaccines.herokuapp.com/';

app.get('/', function(req, res) {
  res.send('Staying alive.');
});

cron.schedule(cronJobInterval, async () => {
  try {
    const keep = await fetch(keepaliveURL);
    const alive = await keep.text();
    console.log(alive);

    await checkHeb();
    await checkBellCounty();
    await checkFHS();
    await checkAlamodome();
    await checkRandalls();
  } catch (error) {
    console.error(error);
  }
});

app.listen(process.env.PORT);
