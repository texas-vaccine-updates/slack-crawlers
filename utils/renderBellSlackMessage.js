module.exports = (url, location) => {
  return {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: `Vaccines are available in ${location} 💉 @channel`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'Click here to schedule:',
          emoji: true,
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
    ],
  };
};
