import "dotenv/config";

// First install: npm install langchain zod @langchain/google-genai
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { CommaSeparatedListOutputParser, StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GOOGLE_API_KEY!,
});

async function stringParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short description about {product_name}.",
  );

  const parser = new StringOutputParser();

  const chain = prompt.pipe(model).pipe(parser);

  const response = await chain.invoke({
    product_name: "Langchain",
  });

  console.log(response);
}

async function commaSeparatedParser() {
  const prompt = ChatPromptTemplate.fromTemplate(
    "Gimme the list of things to carry at {input} court.",
  );

  const parser = new CommaSeparatedListOutputParser();

  const chain = prompt.pipe(model).pipe(parser);

  const response = await chain.invoke({
    input: "Badminton",
  });

  console.log(response);
}


async function structuredParser() {
  const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
    title: "The title of the article",
    summary: "A summary of the article",
  });

  const templatePrompt = ChatPromptTemplate.fromTemplate(
    `Extract information from the following text: {text}.\n{format_instructions}`,
  );

  const chain = templatePrompt.pipe(model).pipe(outputParser);

  const response = await chain.invoke({
    text: "Badminton",
    format_instructions: outputParser.getFormatInstructions(),
  });

  console.log(response);
}
structuredParser();