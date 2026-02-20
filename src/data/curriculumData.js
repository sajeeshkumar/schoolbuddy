/**
 * Ontario Curriculum, Grades 1–8: Language (2023)
 * Strand B: Composition — Expressing Ideas and Creating Texts
 *
 * This module defines grade-specific rubric criteria aligned with the Ontario
 * curriculum expectations. The structure is subject-extensible: add new subjects
 * (e.g., 'math', 'science', 'french') alongside 'english'.
 */

export const SUBJECTS = {
    english: {
        id: 'english',
        name: 'English Language',
        icon: '📝',
        description: 'Writing analysis aligned with Ontario Language curriculum',
    },
    // Future subjects can be added here:
    // math: { id: 'math', name: 'Mathematics', icon: '🔢', ... },
    // science: { id: 'science', name: 'Science', icon: '🔬', ... },
    // french: { id: 'french', name: 'French', icon: '🇫🇷', ... },
};

/**
 * Rubric criteria for English writing, per grade level.
 * Each criterion maps to Ontario Language 2023 Strand B expectations.
 */
export const ENGLISH_RUBRIC = {
    6: {
        grade: 6,
        gradeLabel: 'Grade 6',
        criteria: [
            {
                id: 'ideas_organization',
                name: 'Ideas & Organization',
                icon: '💡',
                description: 'Clear main idea with supporting details organized logically',
                ontarioExpectation:
                    'B1.3 – Organize ideas and information using a variety of patterns (e.g., comparison, cause and effect, chronological order)',
                promptGuidance:
                    'Evaluate whether the writing has a clear main idea, logical paragraph structure, relevant supporting details, and uses organizational patterns appropriate for Grade 6 (comparison, cause-and-effect, chronological).',
            },
            {
                id: 'voice_style',
                name: 'Voice & Word Choice',
                icon: '🎨',
                description: 'Engaging voice with varied and precise vocabulary',
                ontarioExpectation:
                    'B1.4 – Draft and revise writing using a variety of sentence types and appropriate vocabulary for purpose and audience',
                promptGuidance:
                    'Evaluate the variety of sentence structures, word choice precision, awareness of audience, and whether the writer\'s voice is developing and engaging for Grade 6 level.',
            },
            {
                id: 'conventions',
                name: 'Language Conventions',
                icon: '📏',
                description: 'Spelling, grammar, and punctuation accuracy',
                ontarioExpectation:
                    'B2.1 – Spell familiar and frequently used words correctly; use resources to check spelling; apply knowledge of spelling patterns',
                promptGuidance:
                    'Evaluate spelling accuracy, use of grammar and punctuation conventions expected at Grade 6 level, including correct use of commas, apostrophes, and subject-verb agreement.',
            },
            {
                id: 'reflection',
                name: 'Thinking & Reflection',
                icon: '🤔',
                description: 'Evidence of thinking, revision, and self-improvement',
                ontarioExpectation:
                    'B1.6 – Reflect on and identify strengths, areas for improvement, and strategies used in writing',
                promptGuidance:
                    'Look for evidence that the student has revised or thought critically about their writing. Note any self-corrections, crossed-out sections, or evidence of drafting. Encourage the practice of reflection.',
            },
        ],
    },
    7: {
        grade: 7,
        gradeLabel: 'Grade 7',
        criteria: [
            {
                id: 'ideas_organization',
                name: 'Ideas & Organization',
                icon: '💡',
                description: 'Well-developed thesis with structured arguments and transitions',
                ontarioExpectation:
                    'B1.3 – Organize ideas and information into a coherent whole using a range of organizational patterns and techniques',
                promptGuidance:
                    'Evaluate whether the writing has a clear thesis or central argument, uses transition words and phrases effectively, maintains coherent paragraph structure, and develops ideas with specific evidence appropriate for Grade 7.',
            },
            {
                id: 'voice_style',
                name: 'Voice & Word Choice',
                icon: '🎨',
                description: 'Distinctive voice with sophisticated and varied language',
                ontarioExpectation:
                    'B1.4 – Use a range of sentence structures and vocabulary appropriate for Grade 7 to communicate ideas clearly',
                promptGuidance:
                    'Evaluate sentence variety (simple, compound, complex), vocabulary sophistication, use of figurative language or literary devices, and whether the writing demonstrates an emerging personal voice appropriate for Grade 7.',
            },
            {
                id: 'conventions',
                name: 'Language Conventions',
                icon: '📏',
                description: 'Consistent accuracy in grammar, spelling, and punctuation',
                ontarioExpectation:
                    'B2.1 – Apply knowledge of spelling rules and conventions; use punctuation correctly including semicolons and colons in appropriate contexts',
                promptGuidance:
                    'Evaluate Grade 7-level conventions: consistent verb tenses, proper pronoun usage, comma usage in complex sentences, spelling of challenging words, and paragraph formatting.',
            },
            {
                id: 'critical_thinking',
                name: 'Critical Thinking',
                icon: '🧠',
                description: 'Analysis, evaluation, and connection of ideas',
                ontarioExpectation:
                    'B1.1 – Generate, gather, and organize ideas for writing using a variety of strategies and tools',
                promptGuidance:
                    'Evaluate depth of thinking: Does the writing go beyond surface observation? Are ideas connected logically? Is there evidence of analysis or evaluation? Does the student consider multiple perspectives? At Grade 7, expect developing analytical skills.',
            },
        ],
    },
    8: {
        grade: 8,
        gradeLabel: 'Grade 8',
        criteria: [
            {
                id: 'ideas_organization',
                name: 'Ideas & Organization',
                icon: '💡',
                description: 'Sophisticated structure with compelling thesis and strong evidence',
                ontarioExpectation:
                    'B1.3 – Organize ideas using the most effective pattern for the purpose, including thesis-based structures with counterarguments',
                promptGuidance:
                    'Evaluate the clarity and strength of the thesis, logical flow of arguments, use of evidence and examples, effective introduction and conclusion, and sophisticated transitions. For Grade 8, expect well-structured multi-paragraph compositions with clear purpose.',
            },
            {
                id: 'voice_style',
                name: 'Voice & Word Choice',
                icon: '🎨',
                description: 'Strong personal voice with precise, powerful language choices',
                ontarioExpectation:
                    'B1.4 – Use a variety of sentence types and structures and vocabulary that is precise and vivid to create specific effects',
                promptGuidance:
                    'Evaluate sophistication of sentence structures, precise vocabulary use, rhetorical techniques, tone consistency, and whether the writing demonstrates a strong and authentic voice. At Grade 8, expect purposeful stylistic choices.',
            },
            {
                id: 'conventions',
                name: 'Language Conventions',
                icon: '📏',
                description: 'Strong command of grammar, spelling, and punctuation conventions',
                ontarioExpectation:
                    'B2.1 – Apply knowledge of conventions consistently to produce polished drafts, including complex punctuation and varied sentence patterns',
                promptGuidance:
                    'Evaluate Grade 8-level conventions: correct use of complex punctuation (semicolons, colons, dashes), consistent verb tense management across paragraphs, proper parallel structure, sophisticated spelling, and polished formatting.',
            },
            {
                id: 'critical_literacy',
                name: 'Critical Literacy & Perspective',
                icon: '🌍',
                description: 'Awareness of audience, purpose, and diverse perspectives',
                ontarioExpectation:
                    'B1.1 – Generate, gather, evaluate, and organize ideas for writing, demonstrating awareness of purpose, audience, and context',
                promptGuidance:
                    'Evaluate the student\'s awareness of audience and purpose, ability to consider alternative viewpoints, evidence of research or outside knowledge, and critical thinking depth. At Grade 8, expect awareness of bias, persuasive techniques, and contextual writing choices.',
            },
        ],
    },
};

/**
 * Get rubric for a specific grade and subject.
 * @param {number} grade - 6, 7, or 8
 * @param {string} subject - 'english' (default); extensible
 * @returns {object} rubric with criteria array
 */
export const getRubric = (grade, subject = 'english') => {
    if (subject === 'english') {
        return ENGLISH_RUBRIC[grade] || ENGLISH_RUBRIC[6];
    }
    // Future: return rubrics for other subjects
    return ENGLISH_RUBRIC[grade] || ENGLISH_RUBRIC[6];
};

/**
 * Build the system prompt for Gemini based on grade and subject.
 */
export const buildSystemPrompt = (grade, subject = 'english', petName = 'your buddy', petPersonality = 'warm, encouraging') => {
    const rubric = getRubric(grade, subject);
    const criteriaText = rubric.criteria
        .map(
            (c, i) =>
                `${i + 1}. **${c.name}** (${c.ontarioExpectation})\n   Guidance: ${c.promptGuidance}`
        )
        .join('\n\n');

    return `You are "${petName}", a ${petPersonality} writing buddy for ${rubric.gradeLabel} students in Ontario, Canada. You analyze photos of student writing and provide helpful, curriculum-aligned feedback.

## Your Personality
- Friendly, warm, and encouraging — like a favorite teacher
- Use age-appropriate language for ${rubric.gradeLabel} students (ages ${grade + 5}-${grade + 6})
- Always start with something positive about the writing
- Frame suggestions as opportunities, not criticisms
- Use emojis naturally but not excessively
- Be specific — point to actual examples from the student's writing

## Ontario Curriculum Alignment
You are aligned with the Ontario Curriculum, Grades 1–8: Language (2023), Strand B: Composition.

## Evaluation Criteria
Evaluate the writing on each of these criteria, giving a score from 1-5 stars:

${criteriaText}

## Response Format
You MUST respond in valid JSON with this exact structure:
{
  "overallEncouragement": "A warm, personalized 2-3 sentence encouragement about their writing",
  "overallStars": <number 1-5>,
  "criteria": [
    {
      "id": "<criterion_id>",
      "name": "<criterion_name>",
      "stars": <number 1-5>,
      "feedback": "Specific, encouraging feedback (2-3 sentences) referencing their actual writing",
      "tip": "One specific, actionable tip for improvement"
    }
  ],
  "funFact": "An interesting, fun fact about writing or language that a ${rubric.gradeLabel} student would enjoy",
  "nextChallenge": "A fun, optional writing challenge they could try next"
}

## Important Rules
- ALWAYS find something genuinely positive to highlight first
- Be specific — reference actual words, sentences, or ideas from their writing
- Keep feedback age-appropriate and encouraging
- If you cannot read the handwriting clearly, kindly mention it and do your best
- If the image is not writing (e.g., a drawing or random photo), gently redirect
- Never be harsh, sarcastic, or discouraging
- Scores should reflect genuine assessment — don't inflate to 5/5 for everything, but be generous and focus on growth`;
};
