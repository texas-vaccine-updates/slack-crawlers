module.exports = (url, lastTime) => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Vaccines are available! 💉 @here*',
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
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `There are ${lastTime} appointments available over the next 30 days.`,
        },
      },
    ],
  };
};
