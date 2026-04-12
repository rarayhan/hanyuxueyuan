import OpenAI from 'openai';

// Initialize the DeepSeek client using the OpenAI SDK
// Note: In a production app, this should be done on a backend server to protect the API key.
const deepseekClient = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-459b6ee92e4342578507638ca9cd8884',
  dangerouslyAllowBrowser: true // Required for client-side usage in this demo
});

export default deepseekClient;
