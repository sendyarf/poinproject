exports.handler = async (event) => {
    try {
      const { telegramId } = JSON.parse(event.body);
      // Tambahkan rate-limiting jika diperlukan
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