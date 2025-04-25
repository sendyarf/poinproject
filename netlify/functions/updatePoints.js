const axios = require('axios');

exports.handler = async (event, context) => {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHANNEL_ID = process.env.CHANNEL_ID; // Gunakan env variable untuk channel ID

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
      text: messageText,
      parse_mode: 'Markdown',
      disable_notification: true // Tidak mengirim notifikasi
    });

    console.log('Pesan dikirim:', response.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ points })
    };
  } catch (error) {
    console.error('Error di updatePoints:', error.message, error.response ? error.response.data : '');
    
    // Jika error 403 (Forbidden), coba autentikasi ulang
    if (error.response && error.response.status === 403) {
      console.error('Akses ke channel ditolak. Pastikan bot sudah ditambahkan ke channel dan memiliki izin yang diperlukan.');
    }

    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({ 
        error: error.message,
        details: error.response ? error.response.data : undefined
      })
    };
  }
};