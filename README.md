<img height="100" alt="portfolio_view" src="https://github.com/jameskip/texas-vaccines/blob/main/IMG_0339.JPG">

# Texas Vaccine Updates


If you would like to contribute a crawler just follow the folder structure and add your file to `crawlers/`

### Install
```bash
npm install
```

### Run
```bash
npm start
```

### Test
```bash
npm test
```

Here is a `.env` file that will get you up and running. Just save it as `.env` in this project.
```
NODE_ENV=development
PORT=666
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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
HEB_WEBHOOK_URL=https://hooks.slack.com/services/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
ALBERTSONS_WEBHOOK_URL=https://hooks.slack.com/services/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
ALAMO_WEBHOOK_URL=https://hooks.slack.com/services/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
BELL_WEBHOOK_URL=https://hooks.slack.com/services/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
FHS_WEBHOOK_URL=https://hooks.slack.com/services/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
UNIVERSITY_WEBHOOK_URL=https://hooks.slack.com/services/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
```
The above webhooks all point to our `#__test_channel__` in Slack.
