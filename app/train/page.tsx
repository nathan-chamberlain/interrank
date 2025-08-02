'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const Train = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [question, setQuestion] = useState<string | null>(null);
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [questionCategory, setQuestionCategory] = useState<string | null>(null);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);

  // Fetch a random question from the API
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch('/api/questions?random=true&count=1');
        const data = await response.json();
        
        if (data.success && data.questions.length > 0) {
          const selectedQuestion = data.questions[0];
          setQuestion(selectedQuestion.question);
          setQuestionId(selectedQuestion.id);
          setQuestionCategory(selectedQuestion.category);
        } else {
          setQuestion("What are your biggest strengths?"); // fallback
          setQuestionId(5); // fallback ID
          setQuestionCategory("Self-Assessment");
        }
      } catch (error) {
        console.error('Failed to fetch question:', error);
        setQuestion("What are your biggest strengths?"); // fallback
        setQuestionId(5); // fallback ID
        setQuestionCategory("Self-Assessment");
      } finally {
        setIsLoadingQuestion(false);
      }
    };

    fetchQuestion();
  }, []);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }

        if (final) {
          setFinalTranscript(prev => prev + final);
        }
        setInterimTranscript(interim);
      };

      recognitionRef.current.onerror = (event) => {
        setSpeechError(`Speech recognition error: ${event.error}`);
        setIsRecording(false);
        // Clear timer on error
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        // Clear timer when recording ends
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    } else {
      setSpeechError('Speech recognition not supported in this browser');
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLoading(false);
      } catch (err) {
        setError('Failed to access camera. Please ensure camera permissions are granted.');
        setIsLoading(false);
        console.error('Error accessing camera:', err);
      }
    };

    const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    const stopRecording = () => {
      if (recognitionRef.current && isRecording) {
        recognitionRef.current.stop();
      }
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    // Handle visibility change (tab switch, minimize)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopCamera();
        stopRecording();
      } else if (!error) {
        startCamera();
      }
    };

    // Handle page unload and navigation
    const handleBeforeUnload = () => {
      stopCamera();
      stopRecording();
    };

    // Handle route changes (Next.js navigation)
    const handleRouteChange = () => {
      stopCamera();
      stopRecording();
    };

    startCamera();

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handleRouteChange);
    
    // Listen for programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      stopCamera();
      stopRecording();
      return originalPushState.apply(history, args);
    };
    
    history.replaceState = function(...args) {
      stopCamera();
      stopRecording();
      return originalReplaceState.apply(history, args);
    };

    // Cleanup function
    return () => {
      stopCamera();
      stopRecording();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handleRouteChange);
      
      // Restore original history methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [error]);
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition not available');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimTranscript(''); // Clear interim transcript when stopping
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      setSpeechError(null);
      setFinalTranscript('');
      setInterimTranscript('');
      setTimeRemaining(60); // Reset timer to 60 seconds
      
      recognitionRef.current.start();
      setIsRecording(true);
      
      // Start 60-second timer
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            // Time's up - stop recording
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
            setIsRecording(false);
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
  };

  // Navigate to score page with transcript and question data
  const navigateToScore = () => {
    if (!finalTranscript.trim()) {
      setSpeechError('No transcript to analyze');
      return;
    }

    // Create URL with all necessary parameters
    const params = new URLSearchParams({
      transcript: finalTranscript,
      question: question || '',
      questionId: questionId?.toString() || '',
      category: questionCategory || ''
    });

    router.push(`/train/score?${params.toString()}`);
  };

  // Update the transcript display
  const transcript = finalTranscript + interimTranscript;

  // Show loading state while fetching question
  if (isLoadingQuestion) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-white">Loading question...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen flex flex-col p-4">
      
      {/* Question Display - Centered */}
      <div className="text-center mb-6 mt-8"> {/* Added mt-8 for top margin */}
        <h2 className="text-2xl text-white mb-3">Question:</h2>
        <p className="text-2xl text-blue-300 font-medium mb-2">{question}</p>
        {questionCategory && (
          <p className="text-sm text-gray-400">Category: {questionCategory}</p>
        )}
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex flex-col md:flex-row gap-1 px-8 justify-center"> {/* Changed gap-2 to gap-1 */}
        {/* Left Side - Video */}
        <div className=""> {/* Changed from 0.7 to 0.65 */}
          {isLoading && (
            <p className="text-white">Loading camera...</p>
          )}
          
          {error && (
            <p className="text-red-500 text-center max-w-md">{error}</p>
          )}
          
          {!error && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="rounded-lg border-2 border-white w-full"
              style={{ 
                maxHeight: '50vh',  
                maxWidth: '640px',  // Increased from 480px to 640px
                margin: '0 auto'   
              }}
            />
          )}

          {/* Recording Controls under video */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={toggleRecording}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                isRecording 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              disabled={!!speechError}
            >
              {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording (60s)'}
            </button>
          </div>
        </div>

        {/* Right Side - Transcript and Controls */}
        <div className="px-8 min-w-[300px] max-w-[50%] flex flex-col"> {/* Added max-w-[50%] */}
          {isRecording && (
            <div className="mb-4 flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-white text-sm">Recording...</span>
              </div>
              <div className="text-white text-lg font-mono">
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((60 - timeRemaining) / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Transcript Display */}
          <div className="flex-grow">
            <h3 className="text-white text-lg font-semibold mb-2">Transcript:</h3>
            <div className="bg-gray-800 p-4 rounded-lg text-white text-sm h-[calc(60vh-100px)] overflow-y-auto">
              {finalTranscript && <span className="text-green-300">{finalTranscript}</span>}
              {interimTranscript && <span className="text-gray-400 italic">{interimTranscript}</span>}
            </div>
          </div>

          {/* Analysis Button */}
          {finalTranscript && !isRecording && (
            <div className="mt-4">
              <button
                onClick={navigateToScore}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-colors bg-green-600 hover:bg-green-700 text-white"
              >
                📊 View Score & Analysis
              </button>
            </div>
          )}

          {speechError && (
            <p className="text-red-500 text-center mt-4">{speechError}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Train;