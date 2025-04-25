const axios = require('axios');

exports.handler = async (event) => {
  const RATE_LIMIT_SECONDS = 300; // 5 menit
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = process.env.CHANNEL_ID;

  try {
    console.log('Menerima event untuk validateAdWatch:', event);
    const { telegramId } = JSON.parse(event.body);

    if (!telegramId) {
      console.error('Validasi gagal: telegramId tidak ada');
      throw new Error('telegramId diperlukan');
    }

    console.log(`Validasi iklan untuk telegramId: ${telegramId}`);

    // Cek rate limiting
    const lastMessageResponse = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`, {
      offset: -1,
      limit: 1,
      timeout: 1
    });

    const lastMessage = lastMessageResponse.data.result[0];
    if (lastMessage && lastMessage.message && lastMessage.message.text) {
      const match = lastMessage.message.text.match(/User: (\d+)/);
      if (match && match[1] === telegramId.toString()) {
        const timeDiff = Math.floor((Date.now() - new Date(lastMessage.message.date * 1000)) / 1000);
        if (timeDiff < RATE_LIMIT_SECONDS) {
          throw new Error(`Anda harus menunggu ${RATE_LIMIT_SECONDS - timeDiff} detik sebelum menonton iklan lagi`);
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error di validateAdWatch:', error.message, error.response ? error.response.data : '');
    
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ 
        error: error.message,
        details: error.response ? error.response.data : undefined
      })
    };
  }
};