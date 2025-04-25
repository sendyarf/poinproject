exports.handler = async (event) => {
    try {
      const { telegramId, messageId } = JSON.parse(event.body);
  
      if (!telegramId) {
        throw new Error('telegramId diperlukan');
      }
  
      console.log(`Mengambil poin untuk telegramId: ${telegramId}, messageId: ${messageId}`);
  
      // Karena Telegram tidak mendukung pengambilan pesan, kembalikan 0
      // Untuk sinkronisasi antar perangkat, gunakan database
      let points = 0;
  
      return {
        statusCode: 200,
        body: JSON.stringify({ points })
      };
    } catch (error) {
      console.error(`Error di getUserPoints: ${error.message}`);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  };