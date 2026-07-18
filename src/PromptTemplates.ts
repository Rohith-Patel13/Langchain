
import "dotenv/config";

// First install: npm install langchain zod @langchain/google-genai
import {
   ChatPromptTemplate,
} from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
   model: "gemini-2.5-flash",
   apiKey: process.env.GOOGLE_API_KEY!,
});

async function fromTemplate() {
   const prompt = ChatPromptTemplate.fromTemplate('Write a short description about {product_name}.');

   // const wholePrompt = await prompt.format({ product_name: "Langchain" });
   // console.log(wholePrompt);

   const chain = prompt.pipe(model);

   const response = await chain.invoke({
     product_name: "Langchain",
   });

   console.log(response);
}

async function fromMessage() {
   const prompt = ChatPromptTemplate.fromMessages([
      [
         "system",
         "You are a helpful AI assistant. Answer all questions to the best of your ability.",
      ],
      ["human", "Hello, how are you doing?"],
      ["ai", "I'm doing well, thanks!"],
      ["human", "{input}"],
   ]);

   const chain = prompt.pipe(model);
   const result = await chain.invoke({
      input: "I want you to tell me which is the best age to get married ?",
   });
   console.log(result);
}
fromMessage();
