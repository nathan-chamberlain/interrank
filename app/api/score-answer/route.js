import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

class QuestionAnswerScoringService {
  constructor() {
    this.apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.error('Gemini API key not found');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async scoreQuestionAnswer(question, answer, expectedPoints = []) {
    if (!this.genAI) {
      throw new Error('Gemini AI not initialized. Please check your API key.');
    }

    const scoringPrompt = `
      Please analyze this interview question and answer, then calculate a comprehensive score out of 5000 points based on the following criteria:

      **Question Asked:**
      ${question}

      **Expected Key Points (if any):**
      ${expectedPoints.length > 0 ? expectedPoints.join(', ') : 'Evaluate based on question content and delivery quality'}

      **Candidate's Answer:**
      ${answer}

      **Scoring Criteria (Total: 5000 points):**
      
      1. **Content Quality & Relevance (1500 points)**
         - Directly answers the question asked
         - Provides specific examples and details
         - Demonstrates knowledge and understanding
         - Includes relevant experience or insights
      
      2. **Communication & Clarity (1000 points)**
         - Clear and articulate expression
         - Logical structure and flow
         - Appropriate vocabulary and tone
         - Easy to follow and understand
      
      3. **Depth & Completeness (1000 points)**
         - Thoroughly addresses all aspects of the question
         - Provides sufficient detail and context
         - Shows depth of thinking and analysis
         - Covers expected key points
      
      4. **Professionalism & Delivery (750 points)**
         - Professional tone and language
         - Confidence in delivery
         - Appropriate length (not too brief or verbose)
         - Maintains focus on the question
      
      5. **Impact & Impression (750 points)**
         - Memorable and engaging response
         - Shows personality and authenticity
         - Demonstrates problem-solving ability
         - Creates positive impression

      **Instructions:**
      - Provide a numerical score out of 5000
      - Break down the score by each category
      - Provide specific feedback with examples from the answer
      - Highlight what was done well
      - Suggest specific improvements
      - Rate the overall interview performance

      **Please respond in this exact JSON format:**
      {
        "totalScore": [number out of 5000],
        "breakdown": {
          "contentQuality": [score out of 1500],
          "communication": [score out of 1000],
          "depth": [score out of 1000],
          "professionalism": [score out of 750],
          "impact": [score out of 750]
        },
        "feedback": "Detailed feedback with specific examples from the answer",
        "strengths": ["List of specific strengths demonstrated"],
        "improvements": ["List of specific areas for improvement"],
        "keyPointsCovered": ["Which expected points were addressed"],
        "missedOpportunities": ["What could have been added or improved"],
        "overallAssessment": "Brief overall assessment of the response",
        "grade": "[Letter grade A-F based on performance]"
      }
    `;

    try {
      const result = await this.model.generateContent(scoringPrompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse as JSON
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.log('Could not parse JSON, returning structured response');
      }
      
      // Fallback: extract score and create structured response
      const scoreMatch = text.match(/(\d+)(?:\s*\/\s*5000|\s*out of 5000)/i);
      const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : 3000;
      
      return {
        totalScore: extractedScore,
        breakdown: {
          contentQuality: Math.round(extractedScore * 0.3),
          communication: Math.round(extractedScore * 0.2),
          depth: Math.round(extractedScore * 0.2),
          professionalism: Math.round(extractedScore * 0.15),
          impact: Math.round(extractedScore * 0.15)
        },
        feedback: text,
        strengths: ["Analysis provided in feedback"],
        improvements: ["See detailed feedback for improvement areas"],
        keyPointsCovered: ["Analysis provided in feedback"],
        missedOpportunities: ["See detailed feedback"],
        overallAssessment: "Response analyzed - see detailed feedback",
        grade: extractedScore >= 4000 ? "A" : extractedScore >= 3500 ? "B" : extractedScore >= 3000 ? "C" : extractedScore >= 2500 ? "D" : "F"
      };
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw new Error(`Scoring API error: ${error.message}`);
    }
  }
}

const validateInput = (question, answer) => {
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    throw new Error('Question is required and must be a non-empty string');
  }
  
  if (!answer || typeof answer !== 'string' || answer.trim().length === 0) {
    throw new Error('Answer is required and must be a non-empty string');
  }
  
  if (answer.length > 50000) {
    throw new Error('Answer is too long (max 50,000 characters)');
  }
  
  return true;
};

export async function POST(request) {
  try {
    console.log('Question-Answer Scoring API route called');
    
    const { question, answer, expectedPoints, questionId, username } = await request.json();
    console.log('Scoring request data:', { 
      question: question?.substring(0, 100) + '...', 
      answer: answer?.substring(0, 100) + '...',
      questionId,
      username,
      hasExpectedPoints: !!expectedPoints 
    });

    // Validate input
    validateInput(question, answer);

    // Initialize scoring service
    const scoringService = new QuestionAnswerScoringService();
    
    if (!scoringService.genAI) {
      return NextResponse.json(
        { error: 'Gemini AI not initialized. Check API key configuration.' },
        { status: 500 }
      );
    }

    // Calculate score
    const scoreResult = await scoringService.scoreQuestionAnswer(
      question, 
      answer, 
      expectedPoints || []
    );

    console.log('Scoring result:', scoreResult);

    // If username is provided, send score to leaderboard
    if (username && scoreResult.totalScore) {
      try {
        const leaderboardResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/leaderboard`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            score: scoreResult.totalScore
          })
        });

        if (!leaderboardResponse.ok) {
          console.error('Failed to add score to leaderboard:', await leaderboardResponse.text());
        } else {
          console.log('Score successfully added to leaderboard');
        }
      } catch (leaderboardError) {
        console.error('Error adding to leaderboard:', leaderboardError);
        // Don't fail the main request if leaderboard fails
      }
    }

    console.log('Question-Answer scoring completed successfully');
    return NextResponse.json({ 
      success: true, 
      question,
      answer: answer.substring(0, 200) + (answer.length > 200 ? '...' : ''),
      questionId,
      username,
      leaderboardSubmitted: !!username,
      ...scoreResult,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Question-Answer Scoring API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to score question and answer' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Question-Answer scoring API is running',
    description: 'POST a question and answer to get a detailed score out of 5000',
    scoringCriteria: {
      contentQuality: '1500 points - Relevance, examples, knowledge, insights',
      communication: '1000 points - Clarity, structure, vocabulary, tone',
      depth: '1000 points - Thoroughness, detail, analysis, key points',
      professionalism: '750 points - Professional tone, confidence, focus',
      impact: '750 points - Engagement, authenticity, problem-solving, impression'
    },
    expectedFields: {
      question: 'The interview question asked',
      answer: 'The candidate\'s response',
      expectedPoints: 'Optional array of key points to look for',
      questionId: 'Optional ID if using stock questions'
    }
  });
}
