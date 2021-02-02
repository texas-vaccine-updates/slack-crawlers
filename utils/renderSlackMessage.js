module.exports = (url, locations) => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*@here Vaccines are available! 💉*',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Click here to schedule:',
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
