'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Add interface for score data
interface ScoreData {
  totalScore: number;
  breakdown: {
    communicationSkills: number;
    contentQuality: number;
    engagement: number;
    professionalism: number;
    leadership: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
  speakerAnalyzed: string;
}

const Score = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transcript, setTranscript] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const transcriptParam = searchParams.get('transcript');
    if (transcriptParam) {
      const decodedTranscript = decodeURIComponent(transcriptParam);
      setTranscript(decodedTranscript);
      processTranscript(decodedTranscript);
    } else {
      setError('No transcript provided');
    }
  }, [searchParams]);

  const processTranscript = async (transcriptText: string) => {
    if (!transcriptText.trim()) {
      setError('No transcript to process');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Process transcript for analysis
      const response = await fetch('/api/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcriptText,
          analysisType: 'summary',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process transcript');
      }

      setAnalysisResult(data.result);
      
      // Now calculate the score
      await calculateScore(transcriptText);
    } catch (error) {
      console.error('Error processing transcript:', error);
      setError(error instanceof Error ? error.message : 'Failed to process transcript');
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateScore = async (transcriptText: string) => {
    setIsScoring(true);
    
    try {
      const response = await fetch('/api/score-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcriptText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate score');
      }

      setScoreData(data);
    } catch (error) {
      console.error('Error calculating score:', error);
      setError(error instanceof Error ? error.message : 'Failed to calculate score');
    } finally {
      setIsScoring(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  return (
    <div className="bg-black min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Speech Analysis Score</h1>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            ← Back to Training
          </button>
        </div>

        {/* Processing State */}
        {(isProcessing || isScoring) && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white text-lg">
                {isProcessing ? '🔄 Analyzing your speech...' : '📊 Calculating your score...'}
              </span>
            </div>
            <div className="w-64 bg-gray-700 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Error:</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Transcript Section */}
        {transcript && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Your Speech Transcript:</h2>
            <div className="bg-gray-800 p-4 rounded-lg text-gray-300 text-sm max-h-40 overflow-y-auto border border-gray-600">
              {transcript}
            </div>
          </div>
        )}

        {/* Score Display */}
        {scoreData && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Your Speech Score</h2>
            
            {/* Total Score */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-lg mb-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {scoreData.totalScore}/5000
              </div>
              <div className="text-lg text-gray-300">
                Overall Score ({Math.round((scoreData.totalScore / 5000) * 100)}%)
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {Object.entries(scoreData.breakdown).map(([category, score]) => {
                const categoryNames: { [key: string]: string } = {
                  communicationSkills: 'Communication Skills',
                  contentQuality: 'Content Quality',
                  engagement: 'Engagement & Interaction',
                  professionalism: 'Professionalism',
                  leadership: 'Leadership & Initiative'
                };
                
                const percentage = (score / 1000) * 100;
                
                return (
                  <div key={category} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium">{categoryNames[category]}</span>
                      <span className="text-green-400 font-bold">{score}/1000</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feedback */}
            <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Detailed Feedback</h3>
              <div className="text-gray-300 whitespace-pre-wrap">{scoreData.feedback}</div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-900 bg-opacity-50 p-4 rounded-lg border border-green-600">
                <h3 className="text-lg font-semibold text-green-300 mb-3">💪 Strengths</h3>
                <ul className="text-green-200 space-y-1">
                  {scoreData.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-yellow-900 bg-opacity-50 p-4 rounded-lg border border-yellow-600">
                <h3 className="text-lg font-semibold text-yellow-300 mb-3">🎯 Areas for Improvement</h3>
                <ul className="text-yellow-200 space-y-1">
                  {scoreData.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Result (if you still want to show the original analysis) */}
        {analysisResult && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Additional Analysis:</h2>
            <div className="bg-gray-900 p-6 rounded-lg text-green-300 text-sm border border-gray-600 whitespace-pre-wrap">
              {analysisResult}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(analysisResult || scoreData) && (
          <div className="flex space-x-4 justify-center">
            <button
              onClick={goBack}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              🎤 Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              🏠 Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Score;