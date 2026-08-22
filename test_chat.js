const url1 = "https://www.kompasmigracji.com/api/chat";
const url2 = "https://www.kompasmigracji.com/api/orakul/chat";

async function test(url) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "Я шукаю роботу. Знайди вакансії зварювальника." }] }),
    });
    console.log(`[${url}] Status: ${res.status}`);
    const text = await res.text();
    console.log(`[${url}] Response: ${text.slice(0, 100)}`);
  } catch (err) {
    console.error(`[${url}] Error:`, err.message);
  }
}

test(url1).then(() => test(url2));
