# Gemini AI Transcript Processor

This application integrates Google's Gemini AI to process and analyze transcripts.

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables

1. Open the `.env.local` file in the root directory
2. Replace `your_gemini_api_key_here` with your actual API key:

```
GOOGLE_AI_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Access the Application

- Main page: http://localhost:3000
- Transcript processor: http://localhost:3000/transcript

## Features

### AI-Powered Transcript Analysis

The application provides several types of analysis:

- **Summary**: Concise overview of the transcript
- **Sentiment Analysis**: Emotional tone and sentiment
- **Keywords & Topics**: Key phrases and important topics
- **Action Items**: Tasks and decisions mentioned
- **Questions Asked**: List and categorization of questions
- **Deep Insights**: Comprehensive analysis of themes
- **Custom Analysis**: Default comprehensive analysis

### Question Generation

Generate thoughtful follow-up questions based on transcript content to:
- Clarify unclear points
- Explore deeper insights
- Understand different perspectives
- Identify next steps

## Usage

1. Navigate to the transcript processor page
2. Paste your transcript in the text area
3. Select the type of analysis you want
4. Click "Analyze Transcript" or "Generate Questions"
5. View the AI-generated results

### Sample Transcript Format

```
Speaker 1: Good morning everyone, thanks for joining today's meeting.
Speaker 2: Thanks for having us. I wanted to discuss the quarterly results.
Speaker 1: Absolutely. Our revenue increased by 15% this quarter.
```

## API Endpoints

### POST /api/process-transcript

Process a transcript with Gemini AI.

**Request Body:**
```json
{
  "transcript": "Speaker 1: Hello...",
  "analysisType": "summary",
  "customPrompt": "Optional custom prompt"
}
```

**Response:**
```json
{
  "success": true,
  "result": "AI analysis result...",
  "timestamp": "2025-08-02T10:30:00.000Z"
}
```

### GET /api/process-transcript

Get API information and available analysis types.

## Security Notes

- API keys are stored securely in environment variables
- Processing happens server-side to protect API credentials
- Input validation is performed on both client and server

## File Structure

```
app/
├── ai-stuff.js              # Gemini AI service and utilities
├── api/
│   └── process-transcript/
│       └── route.js          # API endpoint for transcript processing
├── components/
│   └── TranscriptProcessor.jsx # React component for transcript input/processing
├── transcript/
│   └── page.tsx             # Transcript processor page
└── page.tsx                 # Main application page
```

## Troubleshooting

### Common Issues

1. **"Gemini API key not found" error**
   - Make sure you've added your API key to `.env.local`
   - Restart the development server after adding the key

2. **"Failed to process transcript" error**
   - Check that your API key is valid
   - Ensure you have sufficient quota in your Google AI account
   - Verify your internet connection

3. **Empty or no response**
   - Check that the transcript is not empty
   - Try with a shorter transcript if the original is very long

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is correctly set
3. Ensure all dependencies are installed
4. Try restarting the development server
