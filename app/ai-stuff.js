import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
class GeminiService {
  constructor() {
    this.apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!this.apiKey) {
      console.warn('Gemini API key not found. Please set GOOGLE_AI_API_KEY or GEMINI_API_KEY environment variable.');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Process a transcript with Gemini AI
   * @param {string} transcript - The input transcript text
   * @param {string} prompt - Custom prompt for processing (optional)
   * @returns {Promise<string>} - AI response
   */
  async processTranscript(transcript, prompt = null) {
    if (!this.genAI) {
      throw new Error('Gemini AI not initialized. Please check your API key.');
    }

    try {
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
      
      const result = await this.model.generateContent(finalPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error processing transcript with Gemini:', error);
      throw new Error(`Failed to process transcript: ${error.message}`);
    }
  }

  /**
   * Analyze transcript for specific insights
   * @param {string} transcript - The input transcript text
   * @param {string} analysisType - Type of analysis (summary, sentiment, keywords, etc.)
   * @returns {Promise<string>} - AI analysis response
   */
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

  /**
   * Generate questions based on transcript content
   * @param {string} transcript - The input transcript text
   * @returns {Promise<string>} - Generated questions
   */
  async generateQuestions(transcript) {
    const prompt = `
      Based on this transcript, generate thoughtful follow-up questions that would help:
      1. Clarify unclear points
      2. Explore deeper insights
      3. Understand different perspectives
      4. Identify next steps
      
      Transcript:
      ${transcript}
    `;
    
    return await this.processTranscript(transcript, prompt);
  }

  /**
   * Compare multiple transcripts
   * @param {string[]} transcripts - Array of transcript texts
   * @returns {Promise<string>} - Comparison analysis
   */
  async compareTranscripts(transcripts) {
    if (!transcripts || transcripts.length < 2) {
      throw new Error('At least 2 transcripts are required for comparison');
    }

    const prompt = `
      Compare and analyze the following transcripts. Look for:
      1. Common themes and topics
      2. Different perspectives or viewpoints
      3. Contradictions or agreements
      4. Evolution of ideas across transcripts
      5. Key differences in content or tone
      
      ${transcripts.map((transcript, index) => 
        `Transcript ${index + 1}:\n${transcript}\n\n`
      ).join('')}
    `;

    return await this.processTranscript('', prompt);
  }
}

// Create singleton instance
const geminiService = new GeminiService();

// Export for use in other parts of the application
export default geminiService;

// Helper functions for easy use
export const processTranscript = (transcript, prompt) => 
  geminiService.processTranscript(transcript, prompt);

export const analyzeTranscript = (transcript, analysisType) => 
  geminiService.analyzeTranscript(transcript, analysisType);

export const generateQuestions = (transcript) => 
  geminiService.generateQuestions(transcript);

export const compareTranscripts = (transcripts) => 
  geminiService.compareTranscripts(transcripts);

// Utility function to validate transcript input
export const validateTranscript = (transcript) => {
  if (!transcript || typeof transcript !== 'string') {
    throw new Error('Transcript must be a non-empty string');
  }
  
  if (transcript.trim().length === 0) {
    throw new Error('Transcript cannot be empty');
  }
  
  if (transcript.length > 100000) { // Reasonable limit
    console.warn('Transcript is very long and may be truncated by the API');
  }
  
  return true;
};

// Example usage and testing function
export const testGeminiIntegration = async () => {
  const sampleTranscript = `
    Speaker 1: Good morning everyone, thanks for joining today's meeting.
    Speaker 2: Thanks for having us. I wanted to discuss the quarterly results.
    Speaker 1: Absolutely. Our revenue increased by 15% this quarter.
    Speaker 2: That's excellent news. What were the main drivers?
    Speaker 1: Primarily our new product launches and improved customer retention.
    Speaker 2: Should we plan to scale our marketing efforts?
    Speaker 1: Yes, I think that would be a good next step.
  `;

  try {
    console.log('Testing Gemini integration...');
    const analysis = await processTranscript(sampleTranscript);
    console.log('Analysis result:', analysis);
    return analysis;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
};