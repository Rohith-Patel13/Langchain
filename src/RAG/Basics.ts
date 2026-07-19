import "dotenv/config";

// First install: npm install langchain zod @langchain/google-genai @langchain/classic
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
   model: "gemini-2.5-flash",
   apiKey: process.env.GOOGLE_API_KEY!,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
   model: "gemini-embedding-001",
   apiKey: process.env.GOOGLE_API_KEY!,
});

const data = [
   "Hi My name is akash",
   "Hi My name is rohith",
   "Rohith likes to play Badminton",
   "Akash likes to go to gym and perform benches press",
];

async function main() {
   const vectorStore = new MemoryVectorStore(embeddings);

   await vectorStore.addDocuments(
      data.map((text) => ({ pageContent: text, metadata: {} })),
   );

   const results = await vectorStore.similaritySearch("What does rohith like to play?", 2);

   const template = ChatPromptTemplate.fromMessages([
      ['system', `Answer the user's question based on the context below: {context}`],
      ['user', `{question}`],
   ]);

   const chain = template.pipe(model);

   const response = await chain.invoke({
      context: results,
      question: "What does rohith like to play?",
   });
   console.log(response.content);
};

main();
