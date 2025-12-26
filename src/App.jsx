import React, { useState } from 'react';
import GameLayout from './components/GameLayout';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { fetchQuestions, submitScore } from './services/api';

const PASS_THRESHOLD = Number(import.meta.env.VITE_PASS_THRESHOLD) || 3;
const QUESTION_COUNT = Number(import.meta.env.VITE_QUESTION_COUNT) || 5;

// APP STATES
const STATE_IDLE = 'IDLE';
const STATE_LOADING_QUESTIONS = 'LOADING_QUESTIONS';
const STATE_PLAYING = 'PLAYING';
const STATE_SUBMITTING = 'SUBMITTING';
const STATE_FINISHED = 'FINISHED';

function App() {
  const [gameState, setGameState] = useState(STATE_IDLE);
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleStart = async (id) => {
    setUserId(id);
    setGameState(STATE_LOADING_QUESTIONS);
    setError(null);

    try {
      const data = await fetchQuestions(QUESTION_COUNT);
      setQuestions(data);
      setGameState(STATE_PLAYING);
    } catch (err) {
      console.error(err);
      console.error(err);
      setError(err.message || "Failed to load questions. Please check connection or ID.");
      setGameState(STATE_IDLE); // Go back or show error state? 
      // Better to stay on loading screen or go back.
    }
  };

  const handleQuizFinish = async (answers) => {
    setGameState(STATE_SUBMITTING);
    try {
      // Calculate locally for immediate feedback? 
      // User requested "將作答結果傳送到 Google Apps Script 計算成績"
      // So we wait for server response.

      const response = await submitScore({
        userId,
        answers,
        passThreshold: PASS_THRESHOLD
      });

      setResult(response);
      setGameState(STATE_FINISHED);
    } catch (err) {
      console.error(err);
      setError("Failed to submit score.");
      setGameState(STATE_FINISHED); // Show error in result screen
    }
  };

  const handleRestart = () => {
    setGameState(STATE_IDLE);
    setUserId('');
    setQuestions([]);
    setResult(null);
    setError(null);
  };

  return (
    <GameLayout>
      {gameState === STATE_IDLE && (
        <>
          {error && <div className="nes-text is-error" style={{ marginBottom: "1rem", textAlign: 'center' }}>{error}</div>}
          <StartScreen onStart={handleStart} />
        </>
      )}

      {gameState === STATE_LOADING_QUESTIONS && (
        <div className="screen nes-container is-dark is-centered">
          <p>Seeking Challengers...</p>
          <progress className="nes-progress is-pattern"></progress>
        </div>
      )}

      {gameState === STATE_PLAYING && (
        <QuizScreen questions={questions} onFinish={handleQuizFinish} />
      )}

      {(gameState === STATE_SUBMITTING || gameState === STATE_FINISHED) && (
        <ResultScreen
          result={result}
          loading={gameState === STATE_SUBMITTING}
          error={error}
          onRestart={handleRestart}
        />
      )}
    </GameLayout>
  );
}

export default App;
