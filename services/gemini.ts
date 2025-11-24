import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Quiz, ImageSize } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for structured quiz generation
const quizSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Title of the quiz" },
    description: { type: Type.STRING, description: "Short description" },
    topic: { type: Type.STRING, description: "Main topic of the quiz" },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "The question text" },
          explanation: { type: Type.STRING, description: "Explanation of the correct answer" },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN }
              },
              required: ["text", "isCorrect"]
            }
          }
        },
        required: ["text", "options"]
      }
    }
  },
  required: ["title", "description", "questions", "topic"]
};

interface FileData {
  mimeType: string;
  data: string;
}

export const generateQuizWithGemini = async (
  topic: string, 
  fileData?: FileData, 
  numQuestions?: number
): Promise<Partial<Quiz>> => {
  try {
    const questionCountPrompt = numQuestions 
      ? `Generate exactly ${numQuestions} questions.` 
      : `Generate between 5 to 10 questions, depending on the depth of the content.`;

    let contents;

    if (fileData) {
      // Multimodal request (Document + Text)
      const promptText = topic 
        ? `Analyze the attached document and create a challenging quiz focusing on the topic: "${topic}". ${questionCountPrompt} Make sure one option is correct per question.`
        : `Analyze the attached document and create a challenging quiz based on its key concepts. ${questionCountPrompt} Make sure one option is correct per question.`;

      contents = {
        parts: [
          {
            inlineData: {
              mimeType: fileData.mimeType,
              data: fileData.data
            }
          },
          { text: promptText }
        ]
      };
    } else {
      // Text-only request
      contents = `Create a challenging and interesting quiz about: ${topic}. ${questionCountPrompt} Make sure one option is correct.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Supports text and multimodal inputs with high reasoning
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        thinkingConfig: { thinkingBudget: 32768 }, 
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from Gemini");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};

export const generateQuizImage = async (prompt: string, size: ImageSize): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size, // 1K, 2K, 4K
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};