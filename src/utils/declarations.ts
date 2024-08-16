import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export const predefinedKeywords = ['Cylinder', 'Sensor', 'Hammer', 'Valve'];
