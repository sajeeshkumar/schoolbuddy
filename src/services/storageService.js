/**
 * Storage Service — AsyncStorage wrapper
 * Manages API key, grade preference, and chat history persistence.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/apiConfig';

const KEYS = {
    API_KEY: '@schoolbuddy_api_key',
    GRADE: '@schoolbuddy_grade',
    PET_ID: '@schoolbuddy_pet_id',
    CHAT_HISTORY: '@schoolbuddy_chat_history',
    ONBOARDED: '@schoolbuddy_onboarded',
};

/**
 * Save the Gemini API key.
 */
export const saveApiKey = async (apiKey) => {
    await AsyncStorage.setItem(KEYS.API_KEY, apiKey);
};

/**
 * Retrieve the Gemini API key.
 * Uses the embedded config key if no user-provided key exists.
 */
export const getApiKey = async () => {
    const stored = await AsyncStorage.getItem(KEYS.API_KEY);
    return stored || API_CONFIG.GEMINI_API_KEY || null;
};

/**
 * Save the selected grade level (6, 7, or 8).
 */
export const saveGrade = async (grade) => {
    await AsyncStorage.setItem(KEYS.GRADE, String(grade));
};

/**
 * Retrieve the selected grade level.
 * @returns {number} grade level, defaults to 6
 */
export const getGrade = async () => {
    const grade = await AsyncStorage.getItem(KEYS.GRADE);
    return grade ? parseInt(grade, 10) : 6;
};

/**
 * Save the selected pet ID.
 */
export const savePetId = async (petId) => {
    await AsyncStorage.setItem(KEYS.PET_ID, petId);
};

/**
 * Retrieve the selected pet ID.
 * @returns {string} pet ID, defaults to 'scout'
 */
export const getPetId = async () => {
    return (await AsyncStorage.getItem(KEYS.PET_ID)) || 'scout';
};

/**
 * Save chat history.
 * @param {Array} messages - Array of message objects
 */
export const saveChatHistory = async (messages) => {
    // Keep only last 50 messages to conserve storage
    const trimmed = messages.slice(-50);
    await AsyncStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(trimmed));
};

/**
 * Retrieve chat history.
 * @returns {Array} messages
 */
export const getChatHistory = async () => {
    const data = await AsyncStorage.getItem(KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : [];
};

/**
 * Mark onboarding as complete.
 */
export const setOnboarded = async () => {
    await AsyncStorage.setItem(KEYS.ONBOARDED, 'true');
};

/**
 * Check if user has completed onboarding.
 */
export const isOnboarded = async () => {
    const val = await AsyncStorage.getItem(KEYS.ONBOARDED);
    return val === 'true';
};

/**
 * Clear all app data (for testing / reset).
 */
export const clearAllData = async () => {
    await AsyncStorage.multiRemove(Object.values(KEYS));
};
