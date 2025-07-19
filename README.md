# MediChat - AI-Powered Medical Assistant

A React + TypeScript + Vite application that provides AI-powered medical assistance using Google's Gemini API.

## Features

- Interactive chat interface for medical queries
- Multiple chat sessions with history
- Local storage for chat persistence
- Professional medical assistant responses
- Responsive design

## Setup

1. **Clone the repository and install dependencies:**

   ```bash
   npm install
   ```

2. **Get a Gemini API key:**

   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy your API key

3. **Configure environment variables:**

   - Copy `.env.example` to `.env`
   - Replace `your_gemini_api_key_here` with your actual Gemini API key:

   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## API Integration

This application uses Google's Gemini 1.5 Flash model for generating medical assistance responses. The AI is specifically prompted to:

- Provide accurate medical information
- Suggest consulting healthcare professionals for serious issues
- Decline non-medical queries
- Maintain a professional and confident tone

## Development

### Tech Stack

- React 18
- TypeScript
- Vite
- Google Generative AI
- CSS Modules

### Project Structure

```
src/
├── components/
│   ├── Chat.tsx          # Main chat interface
│   ├── ChatBox.tsx       # Message display component
│   ├── ChatHistory.tsx   # Chat sessions sidebar
│   ├── InputForm.tsx     # Message input form
│   └── NavBar.tsx        # Navigation bar
├── App.tsx               # Main application component
└── main.tsx             # Application entry point
```

## Disclaimer

This application is for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare professionals for medical concerns.
