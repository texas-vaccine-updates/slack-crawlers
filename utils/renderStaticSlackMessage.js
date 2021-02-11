module.exports = (url) => {
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
  ];
};
