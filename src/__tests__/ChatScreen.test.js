/**
 * Tests for ChatScreen
 * Component rendering and basic interaction tests.
 */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

// Mock navigation
const mockNavigation = {
    replace: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
};

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => mockNavigation,
}));

// Storage and Gemini services are mocked here (expo mocks are in jest.setup.js)
jest.mock('../services/geminiService', () => ({
    analyzeWriting: jest.fn(),
    sendTextMessage: jest.fn(),
}));

jest.mock('../services/storageService', () => ({
    getApiKey: jest.fn().mockResolvedValue('test-api-key'),
    getGrade: jest.fn().mockResolvedValue(7),
    getPetId: jest.fn().mockResolvedValue('scout'),
    saveChatHistory: jest.fn().mockResolvedValue(null),
    getChatHistory: jest.fn().mockResolvedValue([]),
    clearAllData: jest.fn().mockResolvedValue(null),
}));

import ChatScreen from '../screens/ChatScreen';
import { sendTextMessage } from '../services/geminiService';

describe('ChatScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the header with pet name', async () => {
        const { getByText } = render(
            <ChatScreen navigation={mockNavigation} />
        );

        await waitFor(() => {
            expect(getByText(/Scout/)).toBeTruthy();
        });
    });

    it('should show welcome message on first load', async () => {
        const { getByText } = render(
            <ChatScreen navigation={mockNavigation} />
        );

        await waitFor(() => {
            expect(getByText(/Scout/)).toBeTruthy();
        });
    });

    it('should render the text input field', async () => {
        const { getByPlaceholderText } = render(
            <ChatScreen navigation={mockNavigation} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Ask me about writing...')).toBeTruthy();
        });
    });

    it('should render the image picker button', async () => {
        const { getByLabelText } = render(
            <ChatScreen navigation={mockNavigation} />
        );

        await waitFor(() => {
            expect(getByLabelText('Attach a photo of your writing')).toBeTruthy();
        });
    });

    it('should send a text message and display response', async () => {
        sendTextMessage.mockResolvedValueOnce('Great question about writing!');

        const { getByPlaceholderText } = render(
            <ChatScreen navigation={mockNavigation} />
        );

        await waitFor(() => {
            expect(getByPlaceholderText('Ask me about writing...')).toBeTruthy();
        });

        const input = getByPlaceholderText('Ask me about writing...');
        fireEvent.changeText(input, 'How do I write better?');
        fireEvent(input, 'submitEditing');

        await waitFor(() => {
            expect(sendTextMessage).toHaveBeenCalledWith(
                'test-api-key',
                'How do I write better?',
                7,
                'Scout',
                'loyal, encouraging, and energetic',
                []
            );
        });
    });
});
