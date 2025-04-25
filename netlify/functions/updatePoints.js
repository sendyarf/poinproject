const axios = require('axios');

exports.handler = async (event) => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = '-1002697590626';

  try {
    const { telegramId, points, messageId } = JSON.parse(event.body);

    // Validasi input
    if (!telegramId || points === undefined) {
      throw new Error('telegramId dan points diperlukan');
    }

    const messageText = `User: ${telegramId}\nPoints: ${points}`;

    let response;
    if (messageId) {
      // Update pesan yang ada
      response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
        chat_id: CHANNEL_ID,
        message_id: messageId,
        text: messageText
      });
    } else {
      // Kirim pesan baru
      response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: CHANNEL_ID,
        text: messageText
      });
    }

    // Ambil message_id dari respons jika pesan baru
    const newMessageId = response.data.result.message_id || messageId;

    return {
      statusCode: 200,
      body: JSON.stringify({ points, messageId: newMessageId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};