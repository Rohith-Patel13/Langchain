/**
 * @see https://docs.langchain.com/oss/javascript/langgraph/agentic-rag#1-preprocess-documents
 */

import "dotenv/config";

// First install: npm install langchain zod @langchain/google-genai @langchain/classic
import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "node:path";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const pc = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY!,
});

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
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const texts = await splitter.splitDocuments(document);

  console.log("\nTotal Chunks:", texts.length);

  if (texts.length === 0) {
    throw new Error(
      "No chunks were created. Your PDF may contain only images or no extractable text."
    );
  }

  const vectorStore = new PineconeStore(embeddings, {
    pineconeIndex: pc.index('test-index'),
  });

  console.log("Uploading documents to Pinecone...", {
    texts
  });
  await vectorStore.addDocuments(texts);
  console.log("Upload Complete.");

  const results = await vectorStore.similaritySearch(question, 2);

  console.log("\nSearch Results:");
  console.log(results);

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
