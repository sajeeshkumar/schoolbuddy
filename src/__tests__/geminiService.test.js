/**
 * Tests for geminiService.js
 * Unit tests for prompt construction, response parsing, error handling.
 * Mocks the Gemini API (no real API calls).
 */
import { parseGeminiFeedback } from '../services/geminiService';

// Mock the @google/generative-ai module
jest.mock('@google/generative-ai', () => ({
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
        getGenerativeModel: jest.fn().mockReturnValue({
            generateContent: jest.fn(),
        }),
    })),
}));

describe('Gemini Service', () => {
    describe('parseGeminiFeedback', () => {
        it('should parse valid JSON feedback', () => {
            const validJson = JSON.stringify({
                overallEncouragement: 'Great job on your essay!',
                overallStars: 4,
                criteria: [
                    {
                        id: 'ideas_organization',
                        name: 'Ideas & Organization',
                        stars: 4,
                        feedback: 'Your paragraphs flow well.',
                        tip: 'Try using more transition words.',
                    },
                ],
                funFact: 'The longest sentence ever is 823 words!',
                nextChallenge: 'Try writing a persuasive paragraph.',
            });

            const result = parseGeminiFeedback(validJson);
            expect(result.overallEncouragement).toBe('Great job on your essay!');
            expect(result.overallStars).toBe(4);
            expect(result.criteria).toHaveLength(1);
            expect(result.criteria[0].id).toBe('ideas_organization');
            expect(result.funFact).toBeDefined();
            expect(result.nextChallenge).toBeDefined();
        });

        it('should handle JSON wrapped in markdown code blocks', () => {
            const wrapped = '```json\n{"overallEncouragement":"Nice!","overallStars":3,"criteria":[{"id":"test","name":"Test","stars":3,"feedback":"Good","tip":"Try more"}]}\n```';
            const result = parseGeminiFeedback(wrapped);
            expect(result.overallEncouragement).toBe('Nice!');
            expect(result.overallStars).toBe(3);
        });

        it('should handle JSON wrapped in plain code blocks', () => {
            const wrapped = '```\n{"overallEncouragement":"Nice!","overallStars":3,"criteria":[]}\n```';
            const result = parseGeminiFeedback(wrapped);
            expect(result.overallEncouragement).toBe('Nice!');
        });

        it('should clamp star ratings to valid range (1-5)', () => {
            const json = JSON.stringify({
                overallEncouragement: 'Good!',
                overallStars: 10,
                criteria: [
                    { id: 'test', name: 'Test', stars: 0, feedback: 'Test', tip: 'Test' },
                    { id: 'test2', name: 'Test2', stars: 99, feedback: 'Test', tip: 'Test' },
                ],
            });
            const result = parseGeminiFeedback(json);
            expect(result.overallStars).toBe(5);
            expect(result.criteria[0].stars).toBe(1);
            expect(result.criteria[1].stars).toBe(5);
        });

        it('should handle missing optional fields gracefully', () => {
            const json = JSON.stringify({
                overallEncouragement: 'Good work!',
                overallStars: 3,
                criteria: [
                    { id: 'test', name: 'Test', stars: 3, feedback: 'Fine' },
                ],
            });
            const result = parseGeminiFeedback(json);
            expect(result.overallEncouragement).toBe('Good work!');
            expect(result.funFact).toBeUndefined();
        });

        it('should return fallback for malformed JSON', () => {
            const malformed = 'This is not JSON at all. Just some text feedback.';
            const result = parseGeminiFeedback(malformed);
            expect(result.overallStars).toBe(3);
            expect(result.criteria).toEqual([]);
            expect(result.rawText).toBe(malformed);
        });

        it('should throw for empty input', () => {
            expect(() => parseGeminiFeedback('')).toThrow('Empty response');
            expect(() => parseGeminiFeedback('   ')).toThrow('Empty response');
        });

        it('should throw for null input', () => {
            expect(() => parseGeminiFeedback(null)).toThrow('Empty response');
        });

        it('should handle JSON with missing criteria array gracefully', () => {
            const json = JSON.stringify({
                overallEncouragement: 'Keep going!',
                overallStars: 2,
            });
            const result = parseGeminiFeedback(json);
            // Should fall through to fallback since criteria is missing
            expect(result).toBeDefined();
        });

        it('should handle default stars when not provided', () => {
            const json = JSON.stringify({
                overallEncouragement: 'Nice!',
                criteria: [{ id: 'test', name: 'Test', feedback: 'Good' }],
            });
            const result = parseGeminiFeedback(json);
            expect(result.overallStars).toBe(3); // default
            expect(result.criteria[0].stars).toBe(3); // default
        });
    });
});
