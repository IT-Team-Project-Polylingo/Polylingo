# PolyLingo - AI Language Tutor 🌍🤖

PolyLingo is a next generation language learning platform that allows users to practice speaking, writing and understanding over 10+ languages with a native level AI tutor powered by OpenAI's GPT-4o.

## 🚀 Features

- **Interactive AI Chat:** Practice natural conversations in your target language.
- **Instant Grammar Feedback:** The AI tutor corrects mistakes and explains them in English.
- **Conversation History:** Save and review past sessions.
- **Secure Authentication:** JWT based access and refresh token architecture.

## 💻 Tech Stack

- **Frontend:** React 19, Next.js 15, Tailwind CSS v4, Framer Motion, Zustand
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **AI Integration:** OpenAI API (gpt-4o-mini)

## 🛠️ Getting Started Locally

### Prerequisites

- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/polylingo.git
   cd polylingo
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install

   # Create a .env file based on .env.example

   npm run dev
   ```

3. **Setup the Frontend**
   ```bash
   cd frontend
   npm install

   # Create a .env.local file with NEXT_PUBLIC_API_URL=http://localhost:5000

   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
