'use client';
import { useState } from 'react';

export default function TranscriptProcessor() {
  const [transcript, setTranscript] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisType, setAnalysisType] = useState('summary');
  const [error, setError] = useState('');

  const handleProcessTranscript = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript to analyze.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      
      console.log('Sending request to API...');
      
      const response = await fetch('/api/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          analysisType: analysisType === 'custom' ? 'summary' : analysisType
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to process transcript');
      }
      
      setAnalysisResult(data.result);
    } catch (err) {
      console.error('Full error object:', err);
      setError(`Error processing transcript: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript to generate questions from.');
      return;
    }

    try {
      setIsProcessing(true);
      setError('');
      
      const customPrompt = `
        Based on this transcript, generate thoughtful follow-up questions that would help:
        1. Clarify unclear points
        2. Explore deeper insights
        3. Understand different perspectives
        4. Identify next steps
        
        Transcript:
        ${transcript}
      `;

      const response = await fetch('/api/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          customPrompt
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }
      
      setAnalysisResult(data.result);
    } catch (err) {
      setError(`Error generating questions: ${err.message}`);
      console.error('Question generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const analysisOptions = [
    { value: 'summary', label: 'Summary' },
    { value: 'sentiment', label: 'Sentiment Analysis' },
    { value: 'keywords', label: 'Keywords & Topics' },
    { value: 'actionItems', label: 'Action Items' },
    { value: 'questions', label: 'Questions Asked' },
    { value: 'insights', label: 'Deep Insights' },
    { value: 'custom', label: 'Custom Analysis' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Transcript AI Processor</h1>
        
        {/* Transcript Input */}
        <div className="mb-4">
          <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Transcript:
          </label>
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Paste your transcript here... (e.g., Speaker 1: Hello everyone, Speaker 2: Thanks for joining...)"
          />
        </div>

        {/* Analysis Type Selection */}
        <div className="mb-4">
          <label htmlFor="analysisType" className="block text-sm font-medium text-gray-700 mb-2">
            Analysis Type:
          </label>
          <select
            id="analysisType"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {analysisOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mb-4">
          <button
            onClick={handleProcessTranscript}
            disabled={isProcessing || !transcript.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Analyze Transcript'}
          </button>
          
          <button
            onClick={handleGenerateQuestions}
            disabled={isProcessing || !transcript.trim()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Generate Questions'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Results Display */}
        {analysisResult && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Analysis Result:</h3>
            <div className="whitespace-pre-wrap text-gray-800">
              {analysisResult}
            </div>
          </div>
        )}
      </div>

      {/* Sample Transcript for Testing */}
      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Sample Transcript for Testing:</h3>
        <p className="text-sm text-gray-600 mb-2">You can copy and paste this sample to test the functionality:</p>
        <div className="bg-white p-3 rounded border text-sm">
          Speaker 1: Good morning everyone, thanks for joining today's project meeting.<br/>
          Speaker 2: Thanks for having us. I wanted to discuss our progress on the mobile app.<br/>
          Speaker 1: Absolutely. We've completed 80% of the frontend development this quarter.<br/>
          Speaker 2: That's excellent progress. What are the main challenges we're facing?<br/>
          Speaker 1: The main issues are API integration and user authentication.<br/>
          Speaker 2: Should we bring in additional developers to help?<br/>
          Speaker 1: Yes, I think we should hire two more frontend developers by next month.<br/>
          Speaker 2: Agreed. Let's also schedule weekly check-ins to monitor progress.
        </div>
      </div>
    </div>
  );
}
