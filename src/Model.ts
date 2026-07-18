// First install: npm install langchain zod @langchain/google-genai
import { createAgent } from "langchain";

const agent = createAgent({
  model: "google-genai:gemini-2.5-flash-lite",
});

async function main() {
   const result = await agent.invoke({
     messages: [{ role: "human", content: "What's the weather at kothaguda in hyderabad in South india telangana today?" }],
   });
   console.log(`result`, result);
   console.log(`result messages`, result.messages);
}

main();