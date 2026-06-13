const payload = {
  update_id: 123,
  message: {
    message_id: 1,
    from: { id: 9999999, first_name: "Test" },
    chat: { id: 9999999, type: "private" },
    text: "/start"
  }
};
fetch("http://localhost:3000/api/bot/webhook", {
  method: "POST",
  body: JSON.stringify(payload)
})
.then(res => res.json())
.then(console.log)
.catch(console.error);
