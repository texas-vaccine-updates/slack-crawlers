module.exports = (url, locations) => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Vaccines are available! 💉 @channel*',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Click here to schedule (Direct links below):',
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Schedule',
            emoji: true,
          },
          value: 'vaccine',
          url,
          action_id: 'button-action',
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'section',
        fields: locations,
      },
    ],
  };
};
