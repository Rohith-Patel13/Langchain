
import "dotenv/config";

// First install: npm install langchain zod @langchain/google-genai
import { createAgent } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const agent = createAgent({
  model: new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey: process.env.GOOGLE_API_KEY!,
  }),
  tools: [{ googleSearch: {} }],
});

async function main() { 
   const result = await agent.invoke({
     messages: [{ role: "human", content: "What's the weather at kothaguda in hyderabad in South india telangana today?" }],
   });
   console.log(`result`, result);
}

main();