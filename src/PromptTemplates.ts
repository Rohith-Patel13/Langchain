
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

fromTemplate();