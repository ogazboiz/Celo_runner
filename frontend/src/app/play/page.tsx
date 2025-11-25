'use client';

import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { usePlayerData, useCeloRunner } from '@/hooks/useCeloRunner';
import { getStageQuestions } from '@/data/quizzes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PlayPage() {
  const account = useActiveAccount();
  const address = account?.address;
  const { player, refetch } = usePlayerData(address);
  const { saveGameSession, isPending } = useCeloRunner();
  const router = useRouter();

  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);

  const startGame = (stage: number) => {
    setSelectedStage(stage);
    setIsPlaying(true);
    setScore(0);
    setCoins(0);
    // Simulate game - in real implementation, this would be Phaser game
    setTimeout(() => {
      // Simulate game completion
      const finalScore = Math.floor(Math.random() * 1000) + 500;
      const finalCoins = Math.floor(Math.random() * 50) + 20;
      setScore(finalScore);
      setCoins(finalCoins);
      setIsPlaying(false);
      
      // Show quiz
      const questions = getStageQuestions(stage, 5);
      setQuizQuestions(questions);
      setShowQuiz(true);
      setCurrentQuestionIndex(0);
      setQuestionsCorrect(0);
    }, 5000); // 5 second simulated game
  };

  const handleQuizAnswer = async (answerIndex: number) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setQuestionsCorrect(prev => prev + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Quiz complete - save game session
      const allCorrect = questionsCorrect + (isCorrect ? 1 : 0);
      const stageCompleted = allCorrect >= 3; // Need 3/5 correct to complete

      try {
        await saveGameSession(
          selectedStage,
          score,
          coins,
          allCorrect,
          stageCompleted
        );
        
        setShowQuiz(false);
        refetch();
        
        // Redirect after save
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } catch (error) {
        console.error('Failed to save game session:', error);
      }
    }
  };

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-900 via-blue-900 to-black">
        <div className="nes-container with-title is-centered pixel-art max-w-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <p className="title pixel-font text-primary">LOADING...</p>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-900 via-blue-900 to-black">
        <div className="nes-container with-title is-centered pixel-art max-w-2xl w-full" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <p className="title pixel-font text-primary">CELO QUIZ</p>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
            <div className="nes-progress is-primary mt-2">
              <progress value={currentQuestionIndex + 1} max={quizQuestions.length}></progress>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-lg text-gray-800 font-bold mb-4">{currentQuestion.question}</p>
            
            <div className="space-y-2">
              {currentQuestion.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleQuizAnswer(index)}
                  className="nes-btn w-full text-left"
                  disabled={isPending}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="nes-container is-rounded">
            <p className="text-xs text-gray-700">
              <strong>Score:</strong> {score} | <strong>Coins:</strong> {coins} | <strong>Correct:</strong> {questionsCorrect}/{currentQuestionIndex}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-900 via-blue-900 to-black">
        <div className="nes-container with-title is-centered pixel-art max-w-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <p className="title pixel-font text-primary">PLAYING STAGE {selectedStage}</p>
          
          <div className="text-center py-8">
            <div className="text-6xl mb-4 animate-bounce">🏃‍♂️</div>
            <p className="text-gray-700 mb-4">Running through obstacles...</p>
            <div className="nes-progress is-primary">
              <progress value="50" max="100"></progress>
            </div>
          </div>

          <p className="text-xs text-gray-600 text-center">
            (Simulated gameplay - full game coming soon!)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-900 via-blue-900 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="nes-container with-title is-centered pixel-art mb-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <p className="title pixel-font text-primary">SELECT STAGE</p>
          
          <div className="text-center mb-6">
            <p className="text-sm text-gray-700">
              Current Stage: <strong>{player.currentStage}</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((stage) => {
              const isLocked = stage > player.currentStage;
              const isCompleted = stage < player.currentStage;

              return (
                <div key={stage} className={`nes-container ${isLocked ? 'is-dark' : 'is-rounded'}`}>
                  <h3 className="text-xl font-bold mb-2">Stage {stage}</h3>
                  
                  {isLocked ? (
                    <div className="text-center py-4">
                      <p className="text-4xl mb-2">🔒</p>
                      <p className="text-sm">Complete Stage {stage - 1} to unlock</p>
                    </div>
                  ) : (
                    <div>
                      {isCompleted && (
                        <div className="mb-2">
                          <span className="nes-badge is-success">
                            <span className="is-success">✓ Completed</span>
                          </span>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-700 mb-3">
                        Rewards: {[20, 50, 100][stage - 1]} QUEST tokens
                      </p>
                      
                      <button
                        onClick={() => startGame(stage)}
                        className="nes-btn is-primary w-full"
                      >
                        {isCompleted ? 'Play Again' : 'Start'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Link href="/">
              <button className="nes-btn">
                ← Back to Home
              </button>
            </Link>
          </div>
        </div>

        <div className="nes-container is-rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <h3 className="text-lg font-bold text-gray-800 mb-2">How to Play</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Jump over obstacles to collect coins</li>
            <li>• Complete the stage to unlock quiz questions</li>
            <li>• Answer 3/5 questions correctly to complete the stage</li>
            <li>• Earn QUEST tokens and NFT badges!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
