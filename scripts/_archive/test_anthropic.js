const apiKey = "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";

async function test(model) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 600,
      messages: [{ role: 'user', content: 'test' }],
    }),
  });
  const data = await response.json();
  console.log(`Model ${model}:`, response.status, data);
}

test('claude-haiku-4-5-20251001').then(() => test('claude-3-5-haiku-20241022')).then(() => test('claude-3-haiku-20240307'));
