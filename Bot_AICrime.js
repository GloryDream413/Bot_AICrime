import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const TelegramBot = require('node-telegram-bot-api')
const axios = require('axios');
const dotenv = require('dotenv')

dotenv.config()
const token = process.env.TELEGRAM_BOT_TOKEN
const bot = new TelegramBot(token, { polling: true })

const prompt = "Hello, I'm a chatbot about crime. Could you tell me about your age?" + 
               "\nUser : I'm 13." +
               "\nYou are not alllowed to use this bot. This bot is allowed for users more than 14." +
               "\nUser : I'm 15." +
               "\nNice to meet you. I'd like to collect data of the crime from you. Could you tell me in details?" +
               "\nUser : Yes. I will.";

bot.sendMessage("5973551893", "Hello, I'm a chatbot about crime. Could you tell me about your age?");
const chatbotParams = {
  temperature: 0.7,
  maxTokens: 3000,
  topP: 1,
  frequencyPenalty: 0.7,
  presencePenalty: 0
};

// Define a function to generate a response from the ChatGPT model
async function generateResponse(prompt, chatbotParams) {
  const response = await axios({
    method: 'post',
    //url: 'https://api.openai.com/v1/engines/text-davinci-003/completions',
    url: 'https://api.openai.com/v1/engines/text-davinci-003/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    data: {
      prompt: prompt,
      temperature: chatbotParams.temperature,
      max_tokens: chatbotParams.maxTokens,
      top_p: chatbotParams.topP,
      frequency_penalty: chatbotParams.frequencyPenalty,
      presence_penalty: chatbotParams.presencePenalty,
      n : 1
    }
  });
  
  let reply = response.data.choices[0].text.trim();
  return reply;
}

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userText = msg.text;
  let promptText = prompt + "\nUser: " + userText;
  const chatbotResponse = await generateResponse(promptText, chatbotParams);
  const responseText = chatbotResponse;
  bot.sendMessage(chatId, responseText);
});

if(bot.isPolling()) {
  await bot.stopPolling();
}
await bot.startPolling();