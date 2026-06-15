import OpenAI from "openai";

async function main() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.error('OPENAI_API_KEY not set');
    process.exit(2);
  }

  const client = new OpenAI({ apiKey: key });

  try {
    const resp = await client.responses.create({
      model: 'gpt-4o-mini',
      input: 'Say hello in one sentence.'
    });
    console.log('OK', JSON.stringify(resp.output ?? resp, null, 2));
  } catch (err) {
    console.error('ERR', err);
    process.exit(1);
  }
}

main();
