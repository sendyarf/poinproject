const axios = require('axios');

exports.handler = async (event) => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = '-1002697590626';

  try {
    const { telegramId } = JSON.parse(event.body);

    // Ambil riwayat pesan dari channel
    const response = await axios.get(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatHistory`, {
      params: {
        chat_id: CHANNEL_ID,
        limit: 100
      }
    });

    const messages = response.data.result;
    let points = 0;

    for (const msg of messages) {
      if (msg.text && msg.text.startsWith(`User: ${telegramId}`)) {
        const match = msg.text.match(/Points: (\d+)/);
        if (match) {
          points = parseInt(match[1]);
        }
        break;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ points })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};