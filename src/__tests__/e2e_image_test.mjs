/**
 * E2E Test: Image Analysis Pipeline
 * Tests the full image → Gemma 3 27B → structured feedback flow.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the API key
const API_KEY = 'AIzaSyCFNLNjO-YnhsuLHn5F5uKptlEfmvZ9k8k';
const IMAGE_PATH = path.join(__dirname, 'fixtures', 'sample_writing.jpg');
const GRADE = 6;

// Build the same system prompt the app uses
function buildPrompt(grade) {
    return `You are "Coach Ella" 🎓, a warm, encouraging English writing coach for Grade ${grade} students in Ontario, Canada. 
  
Analyze the student's writing in the photo. Evaluate based on the Ontario Language Arts curriculum rubric.

Respond in this EXACT JSON format (no markdown, no code fences, just raw JSON):
{
  "overallEncouragement": "A warm, specific 2-3 sentence encouragement about their writing",
  "overallStars": 3,
  "criteria": [
    {
      "name": "Ideas & Organization",
      "stars": 3,
      "strength": "Something specific they did well",
      "suggestion": "One friendly, actionable tip to improve"
    },
    {
      "name": "Voice & Word Choice",
      "stars": 3,
      "strength": "Something specific they did well",
      "suggestion": "One friendly, actionable tip"
    },
    {
      "name": "Conventions",
      "stars": 3,
      "strength": "Something specific they did well",
      "suggestion": "One friendly, actionable tip"
    },
    {
      "name": "Sentence Fluency",
      "stars": 3,
      "strength": "Something specific they did well",
      "suggestion": "One friendly, actionable tip"
    }
  ]
}

Rules:
- Stars range from 1 to 4 (1=Limited, 2=Some, 3=Considerable, 4=Thorough)
- Be encouraging and age-appropriate for Grade ${grade}
- Reference specific parts of their writing
- Keep suggestions short and actionable`;
}

async function runTest() {
    console.log('🎓 English Coach — E2E Image Analysis Test');
    console.log('='.repeat(50));
    console.log(`📁 Image: ${IMAGE_PATH}`);
    console.log(`📐 Grade: ${GRADE}`);
    console.log(`🤖 Model: gemma-3-27b-it\n`);

    // Read the image
    const imageBuffer = fs.readFileSync(IMAGE_PATH);
    const base64 = imageBuffer.toString('base64');
    console.log(`📸 Image loaded: ${(imageBuffer.length / 1024).toFixed(1)} KB`);
    console.log(`📊 Base64 length: ${base64.length} chars\n`);

    // Call Gemma 3 27B
    console.log('⏳ Sending to Gemma 3 27B for analysis...\n');
    const startTime = Date.now();

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemma-3-27b-it' });

    const result = await model.generateContent([
        { text: buildPrompt(GRADE) },
        {
            inlineData: {
                mimeType: 'image/jpeg',
                data: base64,
            },
        },
    ]);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const responseText = result.response.text();
    console.log(`✅ Response received in ${elapsed}s\n`);

    // Parse the JSON feedback
    let feedback;
    try {
        const cleaned = responseText.replace(/```json\n?|\n?```/g, '').trim();
        feedback = JSON.parse(cleaned);
    } catch (e) {
        console.log('⚠️  Raw response (not valid JSON):');
        console.log(responseText);
        return;
    }

    // Display the results
    console.log('═'.repeat(50));
    console.log('📝 COACH ELLA\'S FEEDBACK');
    console.log('═'.repeat(50));
    console.log(`\n💬 ${feedback.overallEncouragement}`);
    console.log(`\n⭐ Overall: ${'⭐'.repeat(feedback.overallStars)} (${feedback.overallStars}/4)\n`);

    for (const c of feedback.criteria) {
        console.log(`━━━ ${c.name} ${'⭐'.repeat(c.stars)} (${c.stars}/4) ━━━`);
        console.log(`  ✅ Strength: ${c.strength}`);
        console.log(`  💡 Tip: ${c.suggestion}\n`);
    }

    console.log('═'.repeat(50));
    console.log('✅ E2E IMAGE ANALYSIS TEST PASSED');
    console.log('═'.repeat(50));
}

runTest().catch((err) => {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
});
