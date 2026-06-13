const url = 'https://kompas-migracji-domusv.vercel.app/api/bot/webhook?token=AAH0SSDkxJq2ktr2OdkrnfSusdJqtFBQP1M';
const payload = {
  update_id: 123456,
  message: {
    message_id: 1,
    from: { id: 9999999, is_bot: false, first_name: 'Test', username: 'testuser' },
    chat: { id: 9999999, type: 'private' },
    date: 1234567890,
    text: '/start'
  }
};
fetch(url, { method: 'POST', body: JSON.stringify(payload) })
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
