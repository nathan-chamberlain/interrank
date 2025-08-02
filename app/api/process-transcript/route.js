import { NextResponse } from 'next/server';

// Simple inline Gemini service for API route
import { GoogleGenerativeAI } from '@google/generative-ai';

class SimpleGeminiService {
  constructor() {
    this.apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.error('Gemini API key not found');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async processTranscript(transcript, prompt = null) {
    if (!this.genAI) {
      throw new Error('Gemini AI not initialized. Please check your API key.');
    }

    const defaultPrompt = `
      Please analyze the following transcript and provide:
      1. A brief summary
      2. Key points discussed
      3. Any action items or important decisions
      4. Overall tone and sentiment
      
      Transcript:
      ${transcript}
    `;

    const finalPrompt = prompt || defaultPrompt;
    
    try {
      const result = await this.model.generateContent(finalPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  async analyzeTranscript(transcript, analysisType = 'summary') {
    const prompts = {
      summary: `Provide a concise summary of this transcript:\n${transcript}`,
      sentiment: `Analyze the sentiment and emotional tone of this transcript:\n${transcript}`,
      keywords: `Extract the key topics, keywords, and important phrases from this transcript:\n${transcript}`,
      actionItems: `Identify any action items, tasks, or decisions mentioned in this transcript:\n${transcript}`,
      questions: `List all questions asked in this transcript and categorize them:\n${transcript}`,
      insights: `Provide deep insights and analysis of the main themes in this transcript:\n${transcript}`
    };

    const prompt = prompts[analysisType] || prompts.summary;
    return await this.processTranscript(transcript, prompt);
  }
}

const validateTranscript = (transcript) => {
  if (!transcript || typeof transcript !== 'string') {
    throw new Error('Transcript must be a non-empty string');
  }
  
  if (transcript.trim().length === 0) {
    throw new Error('Transcript cannot be empty');
  }
  
  if (transcript.length > 100000) {
    throw new Error('Transcript is too long (max 100,000 characters)');
  }
  
  return true;
};

export async function POST(request) {
  try {
    console.log('API route called');
    
    const { transcript, analysisType = 'summary', customPrompt } = await request.json();
    console.log('Request data:', { transcript: transcript?.substring(0, 100) + '...', analysisType, hasCustomPrompt: !!customPrompt });

    // Validate input
    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    validateTranscript(transcript);

    // Initialize Gemini service
    const geminiService = new SimpleGeminiService();
    
    if (!geminiService.genAI) {
      return NextResponse.json(
        { error: 'Gemini AI not initialized. Check API key configuration.' },
        { status: 500 }
      );
    }

    // Process with Gemini AI
    let result;
    if (customPrompt) {
      result = await geminiService.processTranscript(transcript, customPrompt);
    } else {
      result = await geminiService.analyzeTranscript(transcript, analysisType);
    }

    console.log('Analysis completed successfully');
    return NextResponse.json({ 
      success: true, 
      result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process transcript' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Transcript processing API is running',
    availableAnalysisTypes: [
      'summary',
      'sentiment', 
      'keywords',
      'actionItems',
      'questions',
      'insights'
    ]
  });
}
