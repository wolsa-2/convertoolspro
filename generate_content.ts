import { GoogleGenAI } from "@google/genai";
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

async function generateContent() {
  const model = "gemini-3.1-pro-preview";
  
  const toolPrompt = `Generate high-quality, SEO-friendly, professional, and human-like descriptions (approx 400 words each) for the following web tools on a site called Convertools:
  1. Image Placeholder: Why developers need them and how to use ours.
  2. PDF Metadata: Explain privacy risks of hidden data in PDFs.
  3. Tweet Generator: Use cases for designers and marketers (include a disclaimer that it's for entertainment/mockup purposes only).
  4. Base64 & Hash Tools: Difference between encoding and hashing for security.
  
  Format the output as a JSON object with keys: "image-placeholder", "pdf-metadata", "tweet-generator", "encryption-tools". Each value should be the HTML-formatted string (using <p>, <h2>, <ul>, <li> tags).`;

  const blogPrompt = `Generate three high-quality, SEO-optimized blog articles (approx 1000 words each) with H1, H2 tags for a site called Convertools:
  1. "10 Productivity Tools Every Developer Needs in 2026"
  2. "The Importance of Data Encryption and Privacy in the Digital Age"
  3. "How to Optimize Website Images for Lightning Fast Performance"
  
  Format the output as a JSON array of objects with keys: "id", "title", "content" (HTML-formatted string), "date", "author", "category", "excerpt".`;

  const pagesPrompt = `Generate professional text for the following pages for Convertools:
  1. Privacy Policy: Specifically mention Google AdSense, cookies, and data handling (we process data locally).
  2. Terms of Service: Standard terms for a utility tools website.
  3. About Us: Describe Shivam Kumar as the creator and the mission of Convertools (simplifying digital workflows, privacy-first).
  
  Format the output as a JSON object with keys: "privacy", "terms", "about". Each value should be the HTML-formatted string.`;

  console.log("Generating tools content...");
  const toolsResponse = await ai.models.generateContent({ model, contents: toolPrompt, config: { responseMimeType: "application/json" } });
  
  console.log("Generating blogs content...");
  const blogsResponse = await ai.models.generateContent({ model, contents: blogPrompt, config: { responseMimeType: "application/json" } });
  
  console.log("Generating pages content...");
  const pagesResponse = await ai.models.generateContent({ model, contents: pagesPrompt, config: { responseMimeType: "application/json" } });

  const content = `
export const TOOLS_SEO_CONTENT = ${toolsResponse.text};

export const BLOG_POSTS = ${blogsResponse.text};

export const STATIC_PAGES_CONTENT = ${pagesResponse.text};
`;

  fs.writeFileSync('src/content.ts', content);
  console.log("Content generated successfully in src/content.ts");
}

generateContent();
