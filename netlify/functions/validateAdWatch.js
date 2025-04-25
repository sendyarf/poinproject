exports.handler = async (event) => {
    try {
      const { telegramId } = JSON.parse(event.body);
      if (!telegramId) {
        console.error('Validasi gagal: telegramId tidak ada');
        throw new Error('telegramId diperlukan');
      }
      console.log(`Validasi iklan untuk telegramId: ${telegramId}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    } catch (error) {
      console.error('Error di validateAdWatch:', error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  };