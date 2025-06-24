import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // =============================================
    //          NEW, ADVANCED SYSTEM PROMPT
    // =============================================
    const systemPrompt = `
      You are a helpful financial AI assistant named BullBear AI. Your goal is to provide insightful, accurate, and easy-to-understand answers about finance, stock markets, and trading concepts. Do not give financial advice.
      
      ALWAYS respond with a JSON object that follows this exact schema:
      {
        "introduction": "A brief introductory paragraph.",
        "keyPoints": ["An array of key takeaways as strings, formatted as bullet points."],
        "highlight": "A single, crucial insight or 'did you know?' fact, as a string.",
        "conclusion": "A brief concluding paragraph."
      }

      Do not include any other text, greetings, or markdown formatting outside of the JSON object.
    `;
    
    const chat = model.startChat({
      history: [{ role: "user", parts: [{ text: systemPrompt }] }],
      generationConfig: {
        maxOutputTokens: 500, // Increased for more detailed responses
        responseMimeType: "application/json", // Instruct the model to output JSON
      },
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const rawText = response.text();

    // Parse the JSON response from the AI
    try {
      const parsedJson = JSON.parse(rawText);
      return NextResponse.json({ reply: parsedJson });
    } catch (e) {
      console.error("Failed to parse AI JSON response:", e);
      // Fallback for when the AI doesn't return perfect JSON
      return NextResponse.json({ 
        reply: {
          introduction: rawText,
          keyPoints: [],
          highlight: "Error",
          conclusion: "The AI returned an invalid format. Please try rephrasing your question."
        } 
      });
    }

  } catch (error) {
    console.error("AI Co-Pilot API Error:", error);
    return NextResponse.json({ error: 'Failed to get a response from the AI' }, { status: 500 });
  }
}