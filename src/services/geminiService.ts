import { GoogleGenAI, Chat } from "@google/genai";
import { MENU_ITEMS } from '../constants';

let chatSession: Chat | null = null;

const formatInventoryForAI = () => {
  return MENU_ITEMS.map(item => 
    `${item.name} ($${item.price}): ${item.description} [Stock: ${item.stock}]`
  ).join('\n');
};

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = async () => {
  const ai = getClient();
  if (!ai) return null;

  const systemInstruction = `
    You are "Quartermaster AI", a strict but efficient logistics assistant for a military base supply store.
    
    Current Inventory:
    ${formatInventoryForAI()}

    Rules:
    1. Assist personnel with locating equipment, rations, and uniform items.
    2. Keep responses brief, precise, and military-styled (e.g., use "Affirmative", "Negative", "Item located").
    3. If asked about items not in stock, suggest the closest alternative from the inventory.
    4. Provide specs if asked (e.g., is the flashlight waterproof?).
    5. Maintain a professional, dutiful tone.
  `;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction,
      temperature: 0.4, // Lower temperature for more deterministic/factual responses
    }
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }
  
  if (!chatSession) {
    return "Connection to HQ failed. Radio silence.";
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return result.text || "Transmission unclear. Repeat.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Signal lost. Re-establishing secure link...";
  }
};
