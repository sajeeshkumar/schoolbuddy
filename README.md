# 🎓 SchoolBuddy

A child-friendly **React Native Expo** chatbot for students (Kindergarten to Grade 12) that analyzes photos of English writing and provides encouraging, **Ontario curriculum-aligned** feedback powered by **Google Gemma 3 27B**.

## ✨ Features

- **🐾 Pet Companions** — Choose your study buddy: Scout 🐕, Whiskers 🐱, Sage 🦉, Bamboo 🐼, or Finn 🦊
- **📸 Photo Analysis** — Take a photo of handwritten writing and get AI-powered feedback
- **💬 Chat Interface** — Ask your pet buddy questions about grammar, essays, or English
- **📊 Rubric Feedback** — Structured ratings across 4 Ontario curriculum criteria
- **🌟 Encouraging Tone** — Age-appropriate, positive feedback that motivates young writers
- **🏫 K-12 Support** — Curriculum rubrics tailored from Kindergarten to Grade 12
- **🔒 Privacy First** — API key stored locally, never sent to third parties

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Google Gemini API Key** — Get one free at [Google AI Studio](https://aistudio.google.com/apikey)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/schoolbuddy.git
cd schoolbuddy

# 2. Install dependencies
npm install

# 3. Configure your API key
cp src/config/apiConfig.example.js src/config/apiConfig.js
# Edit src/config/apiConfig.js and paste your Gemini API key

# 4. Run the app
npx expo start --web        # Browser
npx expo start              # Expo Go (scan QR code on phone)
npx expo start --ios        # iOS Simulator (requires Xcode)
npx expo start --android    # Android Emulator
```

### Run Tests

```bash
npm test
```

---

## 📁 Project Structure

```
schoolbuddy/
├── App.js                          # Navigation + onboarding check
├── app.json                        # Expo configuration
├── jest.setup.js                   # Test setup (expo module mocks)
├── package.json                    # Dependencies + jest config
├── src/
│   ├── config/
│   │   ├── apiConfig.example.js    # Template — copy to apiConfig.js
│   │   └── apiConfig.js            # Your API key (gitignored)
│   ├── screens/
│   │   ├── WelcomeScreen.js        # 2-step onboarding (Welcome → Grade)
│   │   └── ChatScreen.js           # Chat + image analysis + error handling
│   ├── components/
│   │   ├── FeedbackCard.js         # Animated per-criterion rubric display
│   │   └── ImagePickerButton.js    # Camera/gallery picker modal
│   ├── services/
│   │   ├── geminiService.js        # Gemma 3 27B API integration
│   │   └── storageService.js       # AsyncStorage wrapper
│   ├── data/
│   │   └── curriculumData.js       # Ontario curriculum rubrics
│   ├── theme/
│   │   └── theme.js                # Colors, typography, animations
│   ├── __tests__/                  # Unit + integration tests (44 tests)
│   └── __mocks__/                  # Jest mocks for React Native modules
└── assets/                         # App icons and splash screen
```

---

## 🤖 How It Works

```
Student writes an essay
        ↓
Takes a photo with the app (📸)
        ↓
Image sent to Gemma 3 27B with Ontario rubric prompt
        ↓
AI returns structured JSON feedback
        ↓
App displays encouraging, criteria-based ratings (⭐1-4)
```

### Curriculum Criteria (Ontario Language Arts)

| Criterion | What's Evaluated |
|-----------|-----------------|
| **Ideas & Organization** | Main idea, supporting details, structure |
| **Voice & Word Choice** | Tone, vocabulary, audience awareness |
| **Conventions** | Spelling, grammar, punctuation, capitalization |
| **Sentence Fluency** | Sentence variety, flow, readability |

---

## 🔑 API Key Setup

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **"Create API key"**
3. Copy the key
4. Create your config file:

```bash
cp src/config/apiConfig.example.js src/config/apiConfig.js
```

5. Paste your key into `src/config/apiConfig.js`:

```javascript
export const API_CONFIG = {
  GEMINI_API_KEY: 'your-actual-key-here',
};
```

> ⚠️ **Never commit `apiConfig.js`** — it's already in `.gitignore`

---

## 🧪 Testing

```bash
# Run all 44 tests
npm test

# Run E2E image analysis test (requires valid API key)
node src/__tests__/e2e_image_test.mjs
```

---

## 📱 Running on a Phone

### Using Expo Go (Fastest)

1. Install **Expo Go** on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Run `npx expo start`
3. Scan the QR code with your phone camera

### Building a Standalone App

```bash
npm install -g eas-cli
eas login
eas build --platform ios --profile preview     # iOS
eas build --platform android --profile preview  # Android
```

---

## 🛠 Tech Stack

- **React Native** + **Expo** — Cross-platform mobile framework
- **Google Gemma 3 27B** — AI model via Google AI API
- **AsyncStorage** — Local data persistence
- **React Navigation** — Screen navigation
- **expo-image-picker** — Camera and gallery access

---

## 📄 License

MIT
