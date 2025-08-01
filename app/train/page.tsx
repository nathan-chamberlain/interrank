'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const Train = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  // Add new states for API processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState('summary');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();

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
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
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
  }, [error, isRecording]);
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setSpeechError('Speech recognition not available');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setInterimTranscript(''); // Clear interim transcript when stopping
    } else {
      setSpeechError(null);
      setFinalTranscript('');
      setInterimTranscript('');
      setAnalysisResult(null); // Clear previous results
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Add function to send transcript to API
  const processTranscript = async () => {
    if (!finalTranscript.trim()) {
      setSpeechError('No transcript to process');
      return;
    }

    setIsProcessing(true);
    setSpeechError(null);

    try {
      const response = await fetch('/api/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: finalTranscript,
          analysisType: analysisType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process transcript');
      }

      setAnalysisResult(data.result);
    } catch (error) {
      console.error('Error processing transcript:', error);
      setSpeechError(error instanceof Error ? error.message : 'Failed to process transcript');
    } finally {
      setIsProcessing(false);
    }
  };

  // Update the transcript display
  const transcript = finalTranscript + interimTranscript;

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-white mb-8">Train Page</h1>
      
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
          className="rounded-lg border-2 border-white mb-6"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      )}

      {/* Speech Recognition Controls */}
      <div className="flex flex-col items-center space-y-4 w-full max-w-4xl">
        <div className="flex space-x-4">
          <button
            onClick={toggleRecording}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              isRecording 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={!!speechError}
          >
            {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
          </button>
        </div>

        {isRecording && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Recording...</span>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="w-full max-w-2xl">
            <h3 className="text-white text-lg font-semibold mb-2">Transcript:</h3>
            <div className="bg-gray-800 p-4 rounded-lg text-white text-sm max-h-40 overflow-y-auto">
              {finalTranscript && <span className="text-green-300">{finalTranscript}</span>}
              {interimTranscript && <span className="text-gray-400 italic">{interimTranscript}</span>}
            </div>
          </div>
        )}

        {/* Analysis Controls */}
        {finalTranscript && !isRecording && (
          <div className="w-full max-w-2xl space-y-4">
            <div className="flex flex-col space-y-2">
              <label className="text-white text-sm font-medium">Analysis Type:</label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="summary">Summary</option>
              </select>
            </div>

            <button
              onClick={processTranscript}
              disabled={isProcessing}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                isProcessing
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isProcessing ? '🔄 Processing...' : '🤖 Analyze Transcript'}
            </button>
          </div>
        )}

        {/* Analysis Result */}
        {analysisResult && (
          <div className="w-full max-w-2xl">
            <h3 className="text-white text-lg font-semibold mb-2">Analysis Result:</h3>
            <div className="bg-gray-900 p-4 rounded-lg text-green-300 text-sm max-h-60 overflow-y-auto whitespace-pre-wrap">
              {analysisResult}
            </div>
          </div>
        )}

        {speechError && (
          <p className="text-red-500 text-center max-w-md">{speechError}</p>
        )}
      </div>
    </div>
  );
};

export default Train;