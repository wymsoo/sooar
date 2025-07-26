import OpenAI from "openai";

//for backward compatibility, you can still use `https://api.deepseek.com/v1` as `baseURL`.
const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: 'sk-9be07e99e2514a719c7f4066a6f184d1'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
}

main();