import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const classifyTicketContext = async (title) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Classify this customer support ticket based strictly on its title:
        Title: "${title}"
        
        Respond ONLY with a valid JSON object matching this schema without any markdown formatting like \`\`\`json:
        {
           "category": "billing" | "technical" | "general",
           "priority": "low" | "medium" | "high",
           "sentiment": "negative" | "neutral" | "positive"
        }
        
        Rules:
        - category: use 'billing' for refunds/charges, 'technical' for bugs/errors/broken logic, 'general' otherwise.
        - priority: 'high' if urgent or aggressive, 'medium' if standard issue, 'low' if inquiry.
        - sentiment: 'negative' if angry/upset, 'positive' if happy, 'neutral' otherwise.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Clean markdown backticks if Gemini includes them
        if(text.includes('```json')) {
            text = text.split('```json')[1].split('```')[0].trim();
        } else if (text.includes('```')) {
            text = text.split('```')[1].split('```')[0].trim();
        }
        
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Classification Error:", error);
        // Fallback
        return { category: 'general', priority: 'medium', sentiment: 'neutral' };
    }
};

export const generateAgentReply = async (contextMessages) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        let discussion = contextMessages.map(m => `${m.senderRole || m.senderName}: ${m.content}`).join('\n');
        
        const prompt = `You are an AI co-pilot assisting a customer support agent. 
        Read the conversation context below and suggest a short, actionable, and category-relevant reply the agent can send.
        The tone should match the context (e.g., sympathetic for billing/frustration, technical and clear for tech issues).
        Do not include placeholders, just write the actual professional response.
        
        Conversation:
        ${discussion}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Reply Generation Error:", error);
        return "I'm sorry, I'm having trouble connecting to my AI assistant right now.";
    }
};
export const generateBotResponse = async (userMessage, contextHistory = []) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        let historyPrompt = contextHistory.map(m => `${m.senderName}: ${m.content}`).join('\n');

        const prompt = `You are "Deskora Bot", the official AI customer service agent for the Deskora platform. 
        Your goal is to solve all user queries related to the platform professionally and helpfully.
        
        PLATFORM KNOWLEDGE BASE:
        - Deskora: An AI-powered customer support system with real-time chat, AI-assisted agent replies, and smart routing.
        - Features: Real-time messaging (WebSockets), ticket classification (Billing, technical, general), and user profile management.
        - Roles: Admin (full access), Agent (handles assigned tickets), and User (creates support requests).
        - Usage: To create a ticket, click the "New Ticket" button on your dashboard. Use the profile page to update your bio or location. 
        - Support: AI is available 24/7. Human agents are online from 9 AM to 5 PM EST.
        - Priority: We use AI to detect the urgency of your requests automatically.
        
        CONVERSATION HISTORY:
        ${historyPrompt}
        
        USER MESSAGE:
        ${userMessage}
        
        INSTRUCTIONS:
        - Be friendly, concise, and accurate.
        - If the query is about the platform, use the knowledge base.
        - If the query is outside platform scope, redirect them politely to create a technical/billing ticket.
        - Do not use placeholders. Write a direct response.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Bot Response Error:", error);
        return "I am currently undergoing maintenance. Please create a ticket if your request is urgent!";
    }
};

export const translateText = async (text, targetLanguage) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Translate this text strictly into the target language "${targetLanguage}":
        Text: "${text}"
        
        Rules:
        - Respond ONLY with the translated text.
        - Do not add any explanation, quotes, or markdown.
        - If the text is already in the target language, return it exactly as is.
        - Preserve the original meaning and tone (professional and helpful).
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI Translation Error:", error);
        return text; // Fallback to original
    }
};

export const queryKB = async (userQuery, kbArticles) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const contextString = kbArticles.map(a => `Title: ${a.title}\nContent: ${a.content}`).join('\n\n');

        const prompt = `You are a Deskora Support Expert. Answer the user's question using ONLY the provided Knowledge Base context. 
        If the answer is not in the context, politely inform them that you don't have that specific information and suggest they create a support ticket.
        
        KNOWLEDGE BASE CONTEXT:
        ${contextString}
        
        USER QUESTION:
        ${userQuery}
        
        INSTRUCTIONS:
        - Be concise, professional, and clear.
        - Use bullet points if helpful.
        - Do not hallucinate information outside the provided context.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("AI KB Query Error:", error);
        return "I encountered an error searching the knowledge base. Please try browsing the articles manually.";
    }
};
