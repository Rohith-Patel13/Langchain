/**
 * @see https://docs.langchain.com/oss/javascript/langgraph/agentic-rag#1-preprocess-documents
 */

import "dotenv/config";

// First install: npm install langchain zod @langchain/google-genai @langchain/classic
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { TokenTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "node:path";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY!,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GOOGLE_API_KEY!,
});

const question = "What ai skills does rohith have?";

async function main() {
  const loader = new PDFLoader(
    path.join(__dirname, "Resume_Rohith_Appala.pdf"),
  );
  const document = await loader.load();
  const splitter = new TokenTextSplitter({
    chunkSize: 100,
    chunkOverlap: 0,
  });
  const texts = await splitter.splitDocuments(document);
  const vectorStore = new MemoryVectorStore(embeddings);

  await vectorStore.addDocuments(texts);

  const results = await vectorStore.similaritySearch(question, 2);

  const template = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Answer the user's question based on the context below: {context}`,
    ],
    ["user", `{question}`],
  ]);

  const chain = template.pipe(model);

  const response = await chain.invoke({
    context: results,
    question: question,
  });
  console.log(response.content);
}

main();
