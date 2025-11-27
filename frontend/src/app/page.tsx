'use client';

import { useState, useEffect } from 'react';
import { SimpleGameCanvas } from '@/components/SimpleGameCanvas';
import { NewWalletConnection } from '@/components/NewWalletConnection';
import { GameUI } from '@/components/GameUI';
import { QuizModal } from '@/components/QuizModal';
import { GameOverModal } from '@/components/GameOverModal';
import { PixelBackground } from '@/components/PixelBackground';
import { ContractManager } from '@/components/ContractManager';
import { GameNotification } from '@/components/GameNotification';
import { useGameStore, LeaderboardEntry } from '@/store/gameStore';
import { useGameSounds } from '@/hooks/useGameSounds';
import { Volume2, VolumeX } from 'lucide-react';

export default function Home() {
  const { isConnected, player, notification, hideNotification } = useGameStore();
  const loadLeaderboard = useGameStore(state => state.loadLeaderboard);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const { startBackgroundMusic, stopBackgroundMusic, toggleAllAudio, isAudioEnabled, playSound } = useGameSounds();

  // Start background music when component mounts
  useEffect(() => {
    // Delay to allow user interaction (browsers block autoplay)
    const timer = setTimeout(() => {
      try {
        startBackgroundMusic();
      } catch (error) {
        console.error('Error starting background music:', error);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      try {
        stopBackgroundMusic();
      } catch (error) {
        console.error('Error stopping background music:', error);
      }
    };
  }, [startBackgroundMusic, stopBackgroundMusic]);

  // Load leaderboard data when showing leaderboard
  useEffect(() => {
    if (showLeaderboard) {
      console.log('🔄 Dashboard - Loading leaderboard');
      loadLeaderboard().then((data) => {
        console.log('🔄 Dashboard - Leaderboard data received:', data);
        setLeaderboardData(data || []);
      }).catch((error) => {
        console.error('❌ Dashboard - Failed to load leaderboard:', error);
        setLeaderboardData([]);
      });
    }
  }, [showLeaderboard, loadLeaderboard]);

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-0 sm:p-4 relative overflow-hidden">
      {/* Contract Manager - handles contract callbacks */}
      <ContractManager />

      {/* Audio Control and Back Button */}
      <div className="fixed top-2 sm:top-4 right-2 sm:right-4 z-50 flex gap-2">
        {showGame && (
          <button
            onClick={() => setShowGame(false)}
            className="nes-btn is-warning p-2 sm:p-3 pixel-font text-xs sm:text-sm"
            title="Back to Menu"
          >
            ← MENU
          </button>
        )}
        <button
          onClick={toggleAllAudio}
          className="nes-btn is-primary p-2 sm:p-3"
          title={isAudioEnabled ? 'Mute All Audio' : 'Unmute All Audio'}
        >
          {isAudioEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />}
        </button>
      </div>

      {/* Pixel Art Background */}
      <PixelBackground />

      <main className="relative w-full max-w-full sm:max-w-3xl md:max-w-4xl mx-auto my-0 sm:my-8">
        {!isConnected || !player?.isRegistered ? (
          <>
            <NewWalletConnection />
          <div className="nes-container with-title is-centered pixel-art relative z-10 max-w-[90%] sm:max-w-md mx-auto" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <p className="title pixel-font text-primary text-sm sm:text-base">CELO RUNNER</p>
            <h1 className="pixel-font text-base sm:text-xl mb-4 sm:mb-6 text-gray-800 text-center">
              Run • Learn • Earn
            </h1>

            <div className="text-center mb-4 sm:mb-6">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">�‍♂️</div>
              <p className="pixel-font text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                Jump obstacles, answer questions,<br/>
                earn tokens & NFTs on Celo!
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-600 mb-3 sm:mb-4">
                {!isConnected ? 'Connect wallet to start' : 'Complete registration to play'}
              </p>
            </div>
          </div>
          </>
        ) : showGame ? (
          <div className="relative w-full">
            <SimpleGameCanvas />
            <GameUI />
          </div>
        ) : (
          /* Dashboard View - After wallet connection */
          <div className="relative z-10 space-y-4">
            {/* Player Stats Card */}
            <div className="nes-container with-title is-centered pixel-art" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <p className="title pixel-font" style={{ color: '#209cee', fontSize: '1.25rem', fontWeight: 'bold' }}>
                WELCOME BACK, {player?.username?.toUpperCase() || 'RUNNER'}!
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 mt-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <p className="text-xs font-bold text-gray-700 pixel-font mb-1">TOTAL SCORE</p>
                  <p className="text-2xl sm:text-3xl font-bold pixel-font" style={{ color: '#209cee' }}>{player?.totalScore || 0}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                  <p className="text-xs font-bold text-gray-700 pixel-font mb-1">TOKENS</p>
                  <p className="text-2xl sm:text-3xl font-bold pixel-font" style={{ color: '#92cc41' }}>{player?.tokensEarned || 0}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                  <p className="text-xs font-bold text-gray-700 pixel-font mb-1">CURRENT STAGE</p>
                  <p className="text-2xl sm:text-3xl font-bold pixel-font" style={{ color: '#f7d51d' }}>{player?.currentStage || 1}</p>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg border-2 border-red-200">
                  <p className="text-xs font-bold text-gray-700 pixel-font mb-1">NFTs EARNED</p>
                  <p className="text-2xl sm:text-3xl font-bold pixel-font" style={{ color: '#e76e55' }}>
                    {(player?.completedStages?.includes(1) ? 1 : 0) + (player?.completedStages?.includes(2) ? 1 : 0) + (player?.completedStages?.includes(3) ? 1 : 0)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGame(true)}
                className="nes-btn is-primary pixel-font w-full py-3 text-lg"
                style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
              >
                ▶ START GAME
              </button>
            </div>

            {/* Leaderboard Button */}
            <div className="nes-container with-title is-centered pixel-art" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <p className="title pixel-font" style={{ color: '#f7d51d', fontSize: '1.25rem', fontWeight: 'bold' }}>
                🏆 LEADERBOARD
              </p>
              <p className="pixel-font text-sm mb-4" style={{ color: '#333', fontWeight: '500' }}>
                Check where you rank among other players!
              </p>
              <button
                onClick={() => setShowLeaderboard(true)}
                className="nes-btn is-warning pixel-font w-full py-3 text-lg"
              >
                🏆 VIEW LEADERBOARD
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Leaderboard Modal - Same as GameUI */}
      {showLeaderboard && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 pointer-events-auto p-2 sm:p-4">
          <div className="nes-container pixel-art w-full max-w-[95%] sm:max-w-xl md:max-w-2xl mx-auto" style={{ backgroundColor: 'white', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="text-center mb-3 sm:mb-4">
              <p className="pixel-font text-base sm:text-xl md:text-2xl text-gray-800 mb-1">🏆 Leaderboard</p>
              <p className="pixel-font text-xs sm:text-sm text-gray-600">Top Players - All Stages</p>
            </div>

            <div className="space-y-2 mb-4">
              {leaderboardData.length > 0 ? (
                leaderboardData.slice(0, 10).map((entry, index) => {
                  // Medal for top 3
                  const getMedal = (rank: number) => {
                    if (rank === 0) return '🥇';
                    if (rank === 1) return '🥈';
                    if (rank === 2) return '🥉';
                    return '';
                  };

                  const medal = getMedal(index);
                  const bgColor = index === 0 ? 'bg-yellow-50 border-yellow-300' :
                                  index === 1 ? 'bg-gray-50 border-gray-300' :
                                  index === 2 ? 'bg-orange-50 border-orange-300' : 'bg-white border-gray-200';

                  // Clean username - remove any special characters
                  const cleanUsername = (name: string) => {
                    if (!name) return 'Anonymous';
                    // Remove any non-printable characters and trim
                    return name.replace(/[^\x20-\x7E]/g, '').trim() || `Player ${entry.player?.slice(-4)}`;
                  };

                  return (
                    <div
                      key={`${entry.player}-${index}`}
                      className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 border-2 rounded ${bgColor} hover:shadow-md transition-shadow`}
                    >
                      {/* Rank with Medal */}
                      <div className="flex-shrink-0 w-10 sm:w-12 text-center">
                        {medal ? (
                          <div className="text-xl sm:text-2xl leading-none">{medal}</div>
                        ) : (
                          <div className="pixel-font text-base sm:text-lg font-bold text-gray-600">#{index + 1}</div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="flex-grow min-w-0">
                        <div className="pixel-font text-sm sm:text-base font-bold text-gray-800 truncate">
                          {cleanUsername(entry.username || '')}
                        </div>
                        <div className="pixel-font text-xs text-gray-500 truncate">
                          {entry.player?.slice(0, 6)}...{entry.player?.slice(-4)}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex-shrink-0 text-right">
                        <div className="pixel-font text-base sm:text-lg font-bold text-gray-800">
                          {entry.score || 0} pts
                        </div>
                        <div className="pixel-font text-xs text-gray-500">
                          {entry.totalCoins || entry.coinsCollected || 0} coins
                        </div>
                        {entry.totalGames && entry.totalGames > 1 && (
                          <div className="pixel-font text-xs text-gray-400">
                            {entry.totalGames} games
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🏆</div>
                  <div className="pixel-font text-base text-gray-500 mb-2">No games recorded yet!</div>
                  <div className="pixel-font text-sm text-gray-400">Complete a stage to appear on the leaderboard</div>
                </div>
              )}
            </div>

            <button
              onClick={() => { playSound('button'); setShowLeaderboard(false); }}
              className="nes-btn is-primary pixel-font w-full"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Quiz Modal */}
      <QuizModal />

      {/* Game Over Modal */}
      <GameOverModal />

      {/* Game Notifications */}
      <GameNotification 
        notification={notification} 
        onClose={hideNotification} 
      />
    </div>
  );
}
