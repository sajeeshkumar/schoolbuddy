/**
 * Tests for curriculumData.js
 * Validates rubric structure and completeness for all three grades.
 */
import {
    SUBJECTS,
    ENGLISH_RUBRIC,
    getRubric,
    buildSystemPrompt,
} from '../data/curriculumData';

describe('Curriculum Data', () => {
    describe('SUBJECTS', () => {
        it('should have english subject defined', () => {
            expect(SUBJECTS.english).toBeDefined();
            expect(SUBJECTS.english.id).toBe('english');
            expect(SUBJECTS.english.name).toBe('English Language');
            expect(SUBJECTS.english.icon).toBe('📝');
        });
    });

    describe('ENGLISH_RUBRIC', () => {
        const grades = [6, 7, 8];

        grades.forEach((grade) => {
            describe(`Grade ${grade}`, () => {
                it('should have rubric defined', () => {
                    expect(ENGLISH_RUBRIC[grade]).toBeDefined();
                });

                it('should have correct grade number and label', () => {
                    expect(ENGLISH_RUBRIC[grade].grade).toBe(grade);
                    expect(ENGLISH_RUBRIC[grade].gradeLabel).toBe(`Grade ${grade}`);
                });

                it('should have exactly 4 criteria', () => {
                    expect(ENGLISH_RUBRIC[grade].criteria).toHaveLength(4);
                });

                it('each criterion should have required fields', () => {
                    ENGLISH_RUBRIC[grade].criteria.forEach((criterion) => {
                        expect(criterion.id).toBeDefined();
                        expect(criterion.id.length).toBeGreaterThan(0);
                        expect(criterion.name).toBeDefined();
                        expect(criterion.name.length).toBeGreaterThan(0);
                        expect(criterion.icon).toBeDefined();
                        expect(criterion.description).toBeDefined();
                        expect(criterion.ontarioExpectation).toBeDefined();
                        expect(criterion.promptGuidance).toBeDefined();
                    });
                });

                it('should reference Ontario expectations (B strand)', () => {
                    ENGLISH_RUBRIC[grade].criteria.forEach((criterion) => {
                        expect(criterion.ontarioExpectation).toMatch(/B\d/);
                    });
                });

                it('should always have ideas_organization and conventions criteria', () => {
                    const ids = ENGLISH_RUBRIC[grade].criteria.map((c) => c.id);
                    expect(ids).toContain('ideas_organization');
                    expect(ids).toContain('conventions');
                });
            });
        });
    });

    describe('getRubric', () => {
        it('should return rubric for valid grades', () => {
            expect(getRubric(6).grade).toBe(6);
            expect(getRubric(7).grade).toBe(7);
            expect(getRubric(8).grade).toBe(8);
        });

        it('should default to grade 6 for invalid grade', () => {
            expect(getRubric(5).grade).toBe(6);
            expect(getRubric(9).grade).toBe(6);
            expect(getRubric(0).grade).toBe(6);
        });

        it('should accept subject parameter', () => {
            const rubric = getRubric(7, 'english');
            expect(rubric.grade).toBe(7);
        });
    });

    describe('buildSystemPrompt', () => {
        it('should build a non-empty prompt', () => {
            const prompt = buildSystemPrompt(6);
            expect(prompt.length).toBeGreaterThan(100);
        });

        it('should include writing buddy persona', () => {
            const prompt = buildSystemPrompt(7);
            expect(prompt).toContain('writing buddy');
        });

        it('should accept pet name and personality', () => {
            const prompt = buildSystemPrompt(6, 'english', 'Sage', 'wise, patient');
            expect(prompt).toContain('Sage');
            expect(prompt).toContain('wise, patient');
        });

        it('should include grade-specific content', () => {
            const prompt6 = buildSystemPrompt(6);
            const prompt8 = buildSystemPrompt(8);
            expect(prompt6).toContain('Grade 6');
            expect(prompt8).toContain('Grade 8');
        });

        it('should include Ontario curriculum reference', () => {
            const prompt = buildSystemPrompt(7);
            expect(prompt).toContain('Ontario');
            expect(prompt).toContain('Strand B');
        });

        it('should include JSON response format instructions', () => {
            const prompt = buildSystemPrompt(6);
            expect(prompt).toContain('JSON');
            expect(prompt).toContain('overallEncouragement');
            expect(prompt).toContain('criteria');
        });

        it('should include encouraging tone instructions', () => {
            const prompt = buildSystemPrompt(6);
            expect(prompt).toContain('encouraging');
            expect(prompt).toContain('positive');
        });

        it('should include all rubric criteria for the grade', () => {
            const prompt = buildSystemPrompt(7);
            ENGLISH_RUBRIC[7].criteria.forEach((criterion) => {
                expect(prompt).toContain(criterion.name);
            });
        });
    });
});
