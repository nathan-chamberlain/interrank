'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/SupabaseProvider';

// Update interface to match the score-answer API response
interface ScoreData {
  totalScore: number;
  breakdown: {
    contentQuality: number;
    communication: number;
    depth: number;
    professionalism: number;
    impact: number;
  };
  feedback: string;
  strengths: string[];
  improvements: string[];
  keyPointsCovered: string[];
  missedOpportunities: string[];
  overallAssessment: string;
  grade: string;
}

const Score = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transcript, setTranscript] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [questionId, setQuestionId] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useSupabase();

  // Get username from session
  const username = session?.user?.user_metadata?.full_name || 
                   session?.user?.user_metadata?.name || 
                   session?.user?.email?.split('@')[0] || 
                   'Unknown User';

  useEffect(() => {
    const transcriptParam = searchParams.get('transcript');
    const questionParam = searchParams.get('question');
    const questionIdParam = searchParams.get('questionId');
    const categoryParam = searchParams.get('category');
    
    if (transcriptParam && questionParam) {
      const decodedTranscript = decodeURIComponent(transcriptParam);
      const decodedQuestion = decodeURIComponent(questionParam);
      
      setTranscript(decodedTranscript);
      setQuestion(decodedQuestion);
      setQuestionId(questionIdParam || '');
      setCategory(categoryParam || '');
      
      calculateScore(decodedQuestion, decodedTranscript, questionIdParam);
    } else {
      setError('Missing transcript or question data');
    }
  }, [searchParams]);

  const calculateScore = async (questionText: string, transcriptText: string, questionIdParam: string | null) => {
    setIsScoring(true);
    setError(null);
    
    try {
      const response = await fetch('/api/score-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionText,
          answer: transcriptText,
          questionId: questionIdParam ? parseInt(questionIdParam) : undefined,
          expectedPoints: [], // Could be enhanced to fetch expected points for the question
          username: username || 'Guest', // Use username from AccountProvider
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
          <h1 className="text-3xl font-bold text-white">Interview Answer Analysis</h1>
          <button
            onClick={goBack}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors cursor-pointer"
          >
            ← Back to Training
          </button>
        </div>

        {/* Processing State */}
        {isScoring && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white text-lg">
                📊 Analyzing your answer...
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

        {/* Question and Answer Section */}
        {question && transcript && (
          <div className="mb-8 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Question Asked:</h2>
              <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                <p className="text-blue-200 text-lg">{question}</p>
                {category && (
                  <p className="text-blue-400 text-sm mt-2">Category: {category}</p>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Your Answer:</h2>
              <div className="bg-gray-800 p-4 rounded-lg text-gray-300 text-sm max-h-40 overflow-y-auto border border-gray-600">
                {transcript}
              </div>
            </div>
          </div>
        )}

        {/* Score Display */}
        {scoreData && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-6">Your Interview Score</h2>
            
            {/* Total Score with Grade */}
            <div className="bg-gradient-to-r from-purple-900 to-blue-900 p-6 rounded-lg mb-6 text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {scoreData.totalScore}/5000
              </div>
              <div className="text-lg text-gray-300 mb-2">
                Overall Score ({Math.round((scoreData.totalScore / 5000) * 100)}%)
              </div>
              <div className={`text-2xl font-bold ${
                scoreData.grade === 'A' ? 'text-green-400' :
                scoreData.grade === 'B' ? 'text-blue-400' :
                scoreData.grade === 'C' ? 'text-yellow-400' :
                scoreData.grade === 'D' ? 'text-orange-400' : 'text-red-400'
              }`}>
                Grade: {scoreData.grade}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {Object.entries(scoreData.breakdown).map(([category, score]) => {
                const categoryNames: { [key: string]: { name: string; max: number } } = {
                  contentQuality: { name: 'Content Quality & Relevance', max: 1500 },
                  communication: { name: 'Communication & Clarity', max: 1000 },
                  depth: { name: 'Depth & Completeness', max: 1000 },
                  professionalism: { name: 'Professionalism & Delivery', max: 750 },
                  impact: { name: 'Impact & Impression', max: 750 }
                };
                
                const categoryInfo = categoryNames[category];
                if (!categoryInfo) return null;
                
                const percentage = (score / categoryInfo.max) * 100;
                
                return (
                  <div key={category} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium text-sm">{categoryInfo.name}</span>
                      <span className="text-green-400 font-bold">{score}/{categoryInfo.max}</span>
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

            {/* Overall Assessment */}
            {scoreData.overallAssessment && (
              <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Overall Assessment</h3>
                <div className="text-gray-300">{scoreData.overallAssessment}</div>
              </div>
            )}

            {/* Detailed Feedback */}
            <div className="bg-gray-900 p-6 rounded-lg mb-6 border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-4">Detailed Feedback</h3>
              <div className="text-gray-300 whitespace-pre-wrap">{scoreData.feedback}</div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
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

            {/* Key Points and Missed Opportunities */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg border border-blue-600">
                <h3 className="text-lg font-semibold text-blue-300 mb-3">✅ Key Points Covered</h3>
                <ul className="text-blue-200 space-y-1">
                  {scoreData.keyPointsCovered.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-orange-900 bg-opacity-50 p-4 rounded-lg border border-orange-600">
                <h3 className="text-lg font-semibold text-orange-300 mb-3">💡 Missed Opportunities</h3>
                <ul className="text-orange-200 space-y-1">
                  {scoreData.missedOpportunities.map((opportunity, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {scoreData && (
          <div className="flex space-x-4 justify-center">
            <button
              onClick={goBack}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              🎤 Try Again
            </button>
            <button
              onClick={() => router.push('/train')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              📚 New Question
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
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