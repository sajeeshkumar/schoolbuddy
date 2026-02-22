/**
 * Gemini Service — Google Gemini AI API integration
 * Handles image analysis for English writing feedback.
 */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildSystemPrompt } from '../data/curriculumData';

/**
 * Analyze a student's writing from an image.
 *
 * @param {string} apiKey - Google Gemini API key
 * @param {string} base64Image - Base64-encoded image data
 * @param {string} mimeType - Image MIME type (e.g., 'image/jpeg')
 * @param {number} grade - Grade level (6, 7, or 8)
 * @param {string} subject - Subject (default: 'english')
 * @returns {object} Parsed feedback object
 */
export const analyzeWriting = async (apiKey, base64Image, mimeType, grade = 6, subject = 'english', petName = 'your buddy', petPersonality = 'warm, encouraging') => {
    if (!apiKey) {
        throw new Error('API key is required. Please add your Gemini API key in Settings.');
    }

    if (!base64Image) {
        throw new Error('No image provided. Please take a photo or select one from your gallery.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

    const systemPrompt = buildSystemPrompt(grade, subject, petName, petPersonality);

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType || 'image/jpeg',
        },
    };

    const result = await model.generateContent([
        systemPrompt,
        imagePart,
        'Please analyze this student\'s writing and provide curriculum-aligned feedback in the JSON format specified.',
    ]);

    const response = await result.response;
    const text = response.text();

    return parseGeminiFeedback(text);
};

/**
 * Parse Gemini's response text into a structured feedback object.
 * Handles cases where JSON is wrapped in markdown code blocks.
 *
 * @param {string} text - Raw response text from Gemini
 * @returns {object} Parsed feedback object
 */
export const parseGeminiFeedback = (text) => {
    if (!text || text.trim().length === 0) {
        throw new Error('Empty response from AI. Please try again.');
    }

    // Strip markdown code block wrappers if present
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
        cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    try {
        const parsed = JSON.parse(cleaned);

        // Validate required fields
        if (!parsed.overallEncouragement || !parsed.criteria || !Array.isArray(parsed.criteria)) {
            throw new Error('Invalid response structure');
        }

        // Ensure stars are in valid range
        parsed.overallStars = Math.max(1, Math.min(5, parsed.overallStars != null ? parsed.overallStars : 3));
        parsed.criteria = parsed.criteria.map((c) => ({
            ...c,
            stars: Math.max(1, Math.min(5, c.stars != null ? c.stars : 3)),
        }));

        return parsed;
    } catch (parseError) {
        // If JSON parsing fails, create a graceful fallback
        return {
            overallEncouragement: text.slice(0, 300),
            overallStars: 3,
            criteria: [],
            funFact: '',
            nextChallenge: '',
            rawText: text,
        };
    }
};

/**
 * Send a text-only message to the pet buddy (no image).
 * Uses Gemini's multi-turn chat API to maintain conversation context.
 *
 * @param {string} apiKey - Google Gemini API key
 * @param {string} message - User's text message
 * @param {number} grade - Grade level
 * @param {string} petName - Pet's name
 * @param {string} petPersonality - Pet's personality description
 * @param {Array} chatHistory - Previous conversation turns as {role, parts} objects
 * @returns {string} Bot's text response
 */
export const sendTextMessage = async (apiKey, message, grade = 6, petName = 'your buddy', petPersonality = 'warm, encouraging', chatHistory = []) => {
    if (!apiKey) {
        throw new Error('API key is required.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

    const systemPrompt = `You are "${petName}", a ${petPersonality} writing buddy for Grade ${grade} students in Ontario, Canada.

A student is chatting with you. Respond in a friendly, age-appropriate way. Keep your response concise (2-4 sentences) unless they ask for a detailed explanation.

If they ask about writing, grammar, or English language topics, provide helpful guidance aligned with the Ontario curriculum.
If they ask unrelated or inappropriate questions, gently redirect them to English writing topics.`;

    // Build history: inject system prompt as the first exchange if no prior history
    const history = chatHistory.length > 0
        ? [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: `Hi there! I'm ${petName}, your writing buddy! How can I help you today? ✏️` }] },
            ...chatHistory,
        ]
        : [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: `Hi there! I'm ${petName}, your writing buddy! How can I help you today? ✏️` }] },
        ];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
};
