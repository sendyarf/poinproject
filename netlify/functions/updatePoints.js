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

    console.log(`Mengupdate poin untuk telegramId: ${telegramId}, points: ${points}, messageId: ${messageId}`);

    const messageText = `User: ${telegramId}\nPoints: ${points}`;

    let response;
    if (messageId) {
      // Coba edit pesan yang ada
      try {
        response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
          chat_id: CHANNEL_ID,
          message_id: messageId,
          text: messageText
        });
        console.log(`Pesan diedit untuk telegramId: ${telegramId}, messageId: ${messageId}`);
      } catch (editError) {
        console.error(`Gagal mengedit pesan: ${editError.message}`);
        // Jika gagal edit, kirim pesan baru
        response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          chat_id: CHANNEL_ID,
          text: messageText
        });
        console.log(`Pesan baru dikirim untuk telegramId: ${telegramId}`);
      }
    } else {
      // Kirim pesan baru
      response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: CHANNEL_ID,
        text: messageText
      });
      console.log(`Pesan baru dikirim untuk telegramId: ${telegramId}`);
    }

    // Ambil message_id dari respons
    const newMessageId = response.data.result.message_id || messageId;

    return {
      statusCode: 200,
      body: JSON.stringify({ points, messageId: newMessageId })
    };
  } catch (error) {
    console.error(`Error di updatePoints: ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};