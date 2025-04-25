exports.handler = async (event) => {
    try {
      const { telegramId } = JSON.parse(event.body);
      // Simulasi rate-limiting (bisa diperluas dengan menyimpan timestamp di channel)
      // Monetag validasi dilakukan di frontend via show_9244919().then()
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  };