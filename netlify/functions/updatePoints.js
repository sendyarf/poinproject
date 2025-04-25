const axios = require('axios');

exports.handler = async (event) => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = '-1002697590626';

  try {
    console.log('Menerima event:', event);
    const { telegramId, points } = JSON.parse(event.body);

    // Validasi input
    if (!telegramId || points === undefined) {
      console.error('Validasi gagal: telegramId atau points tidak ada', { telegramId, points });
      throw new Error('telegramId dan points diperlukan');
    }

    console.log(`Mengirim pesan ke channel: telegramId: ${telegramId}, points: ${points}`);

    const messageText = `User: ${telegramId}\nPoints: ${points}`;

    // Kirim pesan baru ke channel
    const response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: CHANNEL_ID,
      text: messageText
    });

    console.log('Pesan dikirim:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ points })
    };
  } catch (error) {
    console.error('Error di updatePoints:', error.message, error.response ? error.response.data : '');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};