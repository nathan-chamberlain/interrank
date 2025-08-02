import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

class TranscriptScoringService {
  constructor() {
    this.apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.error('Gemini API key not found');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async calculateScore(transcript) {
    if (!this.genAI) {
      throw new Error('Gemini AI not initialized. Please check your API key.');
    }

    const scoringPrompt = `
      Please analyze this transcript and calculate a comprehensive score out of 5000 points for the person speaking based on the following criteria:

      **Scoring Criteria (Total: 5000 points):**
      
      1. **Communication Skills (1000 points)**
         - Clarity of speech and expression
         - Use of appropriate vocabulary
         - Ability to articulate thoughts clearly
      
      2. **Content Quality (1000 points)**
         - Depth of knowledge demonstrated
         - Relevance of information shared
         - Quality of insights provided
      
      3. **Engagement & Interaction (1000 points)**
         - Active participation in conversation
         - Asking thoughtful questions
         - Responding appropriately to others
      
      4. **Professionalism (1000 points)**
         - Professional tone and language
         - Respect for others in conversation
         - Meeting etiquette and conduct
      
      5. **Leadership & Initiative (1000 points)**
         - Taking initiative in discussions
         - Providing direction or solutions
         - Demonstrating leadership qualities

      **Instructions:**
      - Provide a numerical score out of 5000
      - Break down the score by each category
      - Provide specific examples from the transcript
      - Include constructive feedback for improvement
      - If multiple speakers, focus on the primary/main speaker or specify which speaker you're scoring

      **Transcript:**
      ${transcript}

      **Please respond in this exact JSON format:**
      {
        "totalScore": [number out of 5000],
        "breakdown": {
          "communicationSkills": [score out of 1000],
          "contentQuality": [score out of 1000],
          "engagement": [score out of 1000],
          "professionalism": [score out of 1000],
          "leadership": [score out of 1000]
        },
        "feedback": "Detailed feedback with specific examples",
        "strengths": ["List of key strengths"],
        "improvements": ["List of areas for improvement"],
        "speakerAnalyzed": "Which speaker was primarily analyzed"
      }
    `;

    try {
      const result = await this.model.generateContent(scoringPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse as JSON, if it fails return the raw text with a default structure
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.log('Could not parse JSON, returning structured response');
      }
      
      // Fallback: extract score from text and create structured response
      const scoreMatch = text.match(/(\d+)(?:\s*\/\s*5000|\s*out of 5000)/i);
      const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : 3000; // Default to 3000 if no score found
      
      return {
        totalScore: extractedScore,
        breakdown: {
          communicationSkills: Math.round(extractedScore * 0.2),
          contentQuality: Math.round(extractedScore * 0.2),
          engagement: Math.round(extractedScore * 0.2),
          professionalism: Math.round(extractedScore * 0.2),
          leadership: Math.round(extractedScore * 0.2)
        },
        feedback: text,
        strengths: ["Analysis provided in feedback"],
        improvements: ["See detailed feedback for improvement areas"],
        speakerAnalyzed: "Primary speaker in transcript"
      };
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw new Error(`Scoring API error: ${error.message}`);
    }
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
    console.log('Scoring API route called');
    
    const { transcript } = await request.json();
    console.log('Scoring request data:', { transcript: transcript?.substring(0, 100) + '...' });

    // Validate input
    if (!transcript) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      );
    }

    validateTranscript(transcript);

    // Initialize scoring service
    const scoringService = new TranscriptScoringService();
    
    if (!scoringService.genAI) {
      return NextResponse.json(
        { error: 'Gemini AI not initialized. Check API key configuration.' },
        { status: 500 }
      );
    }

    // Calculate score
    const scoreResult = await scoringService.calculateScore(transcript);

    console.log('Scoring completed successfully');
    return NextResponse.json({ 
      success: true, 
      ...scoreResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Scoring API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate score' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Transcript scoring API is running',
    description: 'POST a transcript to get a score out of 5000',
    scoringCriteria: {
      communicationSkills: '1000 points - Clarity, vocabulary, articulation',
      contentQuality: '1000 points - Knowledge depth, relevance, insights',
      engagement: '1000 points - Participation, questions, responses',
      professionalism: '1000 points - Tone, respect, conduct',
      leadership: '1000 points - Initiative, direction, leadership'
    }
  });
}
