'use client';
import { useState, useEffect } from 'react';

export default function InterviewPractice() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [scoreResult, setScoreResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const [error, setError] = useState('');
  const [practiceMode, setPracticeMode] = useState('sequential'); // 'sequential' or 'random'
  const [completedQuestions, setCompletedQuestions] = useState([]);

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, [practiceMode]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const params = new URLSearchParams({
        count: '10',
        random: practiceMode === 'random' ? 'true' : 'false'
      });
      
      const response = await fetch(`/api/questions?${params}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch questions');
      }
      
      setQuestions(data.questions);
    } catch (err) {
      setError(`Error loading questions: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      setError('Please provide an answer before submitting.');
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    
    try {
      setIsScoring(true);
      setError('');
      
      const response = await fetch('/api/score-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          answer: userAnswer,
          expectedPoints: currentQuestion.expectedPoints,
          questionId: currentQuestion.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to score answer');
      }
      
      setScoreResult(data);
      
      // Add to completed questions
      const newCompleted = {
        ...currentQuestion,
        answer: userAnswer,
        score: data.totalScore,
        grade: data.grade,
        timestamp: new Date().toISOString()
      };
      
      setCompletedQuestions(prev => [...prev, newCompleted]);
      
    } catch (err) {
      setError(`Error scoring answer: ${err.message}`);
    } finally {
      setIsScoring(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setUserAnswer('');
      setScoreResult(null);
      setError('');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setUserAnswer('');
      setScoreResult(null);
      setError('');
    }
  };

  const resetPractice = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setScoreResult(null);
    setCompletedQuestions([]);
    setError('');
    fetchQuestions();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading interview questions...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">No questions available. Please try again.</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Interview Practice</h1>
            <div className="flex space-x-4">
              <select
                value={practiceMode}
                onChange={(e) => setPracticeMode(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md"
                disabled={isScoring}
              >
                <option value="sequential">Sequential Order</option>
                <option value="random">Random Order</option>
              </select>
              <button
                onClick={resetPractice}
                disabled={isScoring}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
              >
                Reset Practice
              </button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length} • 
            Category: {currentQuestion.category} • 
            Completed: {completedQuestions.length}
          </div>
        </div>

        {/* Current Question */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-2">
              {currentQuestion.category}
            </span>
            <h2 className="text-xl font-semibold text-gray-800">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Expected Points Hint */}
          {currentQuestion.expectedPoints && currentQuestion.expectedPoints.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">💡 Key Points to Consider:</h4>
              <ul className="text-sm text-yellow-700">
                {currentQuestion.expectedPoints.map((point, index) => (
                  <li key={index} className="ml-4">• {point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Answer Input */}
          <div className="mb-4">
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
              Your Answer:
            </label>
            <textarea
              id="answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Type your answer here... Be specific and provide examples where possible."
              disabled={isScoring}
            />
            <div className="text-sm text-gray-500 mt-1">
              {userAnswer.length} characters
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleSubmitAnswer}
              disabled={isScoring || !userAnswer.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isScoring ? 'Scoring...' : 'Submit Answer'}
            </button>
            
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 || isScoring}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1 || isScoring}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Skip / Next
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Score Results */}
        {scoreResult && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold text-center mb-6 text-purple-800">
              Your Score: {scoreResult.totalScore}/5000 
              <span className="ml-4 text-lg">Grade: {scoreResult.grade}</span>
            </h3>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {scoreResult.breakdown?.contentQuality || 0}
                </div>
                <div className="text-sm text-gray-600">Content Quality</div>
                <div className="text-xs text-gray-500">/ 1500</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {scoreResult.breakdown?.communication || 0}
                </div>
                <div className="text-sm text-gray-600">Communication</div>
                <div className="text-xs text-gray-500">/ 1000</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {scoreResult.breakdown?.depth || 0}
                </div>
                <div className="text-sm text-gray-600">Depth</div>
                <div className="text-xs text-gray-500">/ 1000</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {scoreResult.breakdown?.professionalism || 0}
                </div>
                <div className="text-sm text-gray-600">Professionalism</div>
                <div className="text-xs text-gray-500">/ 750</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {scoreResult.breakdown?.impact || 0}
                </div>
                <div className="text-sm text-gray-600">Impact</div>
                <div className="text-xs text-gray-500">/ 750</div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-green-700">✅ Strengths:</h4>
                <ul className="list-disc list-inside bg-green-50 p-3 rounded text-sm">
                  {scoreResult.strengths?.map((strength, index) => (
                    <li key={index} className="mb-1">{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-orange-700">🎯 Improvements:</h4>
                <ul className="list-disc list-inside bg-orange-50 p-3 rounded text-sm">
                  {scoreResult.improvements?.map((improvement, index) => (
                    <li key={index} className="mb-1">{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Overall Assessment */}
            {scoreResult.overallAssessment && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Overall Assessment:</h4>
                <p className="text-gray-800">{scoreResult.overallAssessment}</p>
              </div>
            )}
          </div>
        )}

        {/* Completed Questions Summary */}
        {completedQuestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Practice Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedQuestions.map((completed, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Q{completed.id}: {completed.category}</div>
                  <div className="font-medium text-gray-800 mb-2">
                    Score: {completed.score}/5000 ({completed.grade})
                  </div>
                  <div className="text-xs text-gray-500">
                    {completed.question.substring(0, 60)}...
                  </div>
                </div>
              ))}
            </div>
            
            {completedQuestions.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Average Score:</strong> {Math.round(
                    completedQuestions.reduce((sum, q) => sum + q.score, 0) / completedQuestions.length
                  )}/5000
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
