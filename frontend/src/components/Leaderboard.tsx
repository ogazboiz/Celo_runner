'use client';

import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, Star, Users, Zap } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface LeaderboardEntry {
  rank: number;
  player: string;
  walletAddress: string;
  score: number;
  stage: number;
  tokens: number;
  nfts: number;
  completionTime?: number;
  streakDays: number;
  totalGamesPlayed: number;
}

export function Leaderboard() {
  const showNotification = useGameStore(state => state.showNotification);
  const loadLeaderboard = useGameStore(state => state.loadLeaderboard);
  const { player, walletAddress } = useGameStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'all'>('all');
  const [leaderboardType, setLeaderboardType] = useState<'score' | 'tokens' | 'speed'>('score');

  useEffect(() => {
    // Load real leaderboard data from blockchain
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const data = await loadLeaderboard();
        console.log('📊 Loaded leaderboard:', data);
        setLeaderboard(data);
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        showNotification('error', 'Error', 'Failed to load leaderboard');
        // Fallback to empty array
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeframe, leaderboardType, loadLeaderboard, showNotification]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Trophy className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-500 to-amber-700 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading leaderboard...</span>
      </div>
    );
  }

  const getSortedLeaderboard = () => {
    return [...leaderboard].sort((a, b) => {
      switch (leaderboardType) {
        case 'tokens':
          return b.tokens - a.tokens;
        case 'speed':
          return (a.completionTime || 999) - (b.completionTime || 999);
        default:
          return b.score - a.score;
      }
    }).map((entry, index) => ({ ...entry, rank: index + 1 }));
  };

  const getLeaderboardValue = (entry: LeaderboardEntry) => {
    switch (leaderboardType) {
      case 'tokens':
        return `${entry.tokens.toLocaleString()} tokens`;
      case 'speed':
        return entry.completionTime ? `${entry.completionTime}s` : '--';
      default:
        return `${entry.score.toLocaleString()} points`;
    }
  };

  const getPlayerRank = () => {
    if (!walletAddress) return null;
    const sortedBoard = getSortedLeaderboard();
    return sortedBoard.find(entry => entry.walletAddress === walletAddress);
  };

  return (
    <div className="space-y-6">
      {/* Tournament Section */}
      {/* Leaderboard Controls */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        {/* Timeframe Selector */}
        <div className="flex space-x-2">
          {(['daily', 'weekly', 'all'] as const).map((time) => (
            <button
              key={time}
              onClick={() => setTimeframe(time)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeframe === time
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {time.charAt(0).toUpperCase() + time.slice(1)}
            </button>
          ))}
        </div>

        {/* Leaderboard Type Selector */}
        <div className="flex space-x-2">
          <button
            onClick={() => setLeaderboardType('score')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
              leaderboardType === 'score'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Score</span>
          </button>
          <button
            onClick={() => setLeaderboardType('tokens')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
              leaderboardType === 'tokens'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Tokens</span>
          </button>
          <button
            onClick={() => setLeaderboardType('speed')}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg font-medium transition-colors ${
              leaderboardType === 'speed'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Speed</span>
          </button>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {getSortedLeaderboard().map((entry) => (
          <div
            key={entry.walletAddress}
            className={`flex items-center p-4 rounded-lg transition-all hover:scale-102 ${getRankColor(entry.rank)} ${
              entry.walletAddress === walletAddress ? 'ring-2 ring-blue-400' : ''
            }`}
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="flex items-center space-x-2">
                {getRankIcon(entry.rank)}
                <span className="font-bold text-lg">#{entry.rank}</span>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-lg flex items-center space-x-2">
                  <span>{entry.player}</span>
                  {entry.streakDays > 7 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      🔥 {entry.streakDays} day streak
                    </span>
                  )}
                </div>
                <div className="text-sm opacity-90">
                  Stage {entry.stage} • {entry.nfts} NFTs • {entry.totalGamesPlayed} games played
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-xl">{getLeaderboardValue(entry)}</div>
              <div className="text-sm opacity-90">
                {leaderboardType === 'score' && 'points'}
                {leaderboardType === 'tokens' && 'earned'}
                {leaderboardType === 'speed' && 'avg time'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Your Rank */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Your Rank
            </h3>
            <p className="text-sm text-blue-700">
              {walletAddress ? 'Your current position' : 'Connect your wallet to see your position'}
            </p>
          </div>
          <div className="text-right">
            {(() => {
              const playerRank = getPlayerRank();
              if (playerRank) {
                return (
                  <>
                    <div className="text-2xl font-bold text-blue-900">#{playerRank.rank}</div>
                    <div className="text-sm text-blue-700">{getLeaderboardValue(playerRank)}</div>
                  </>
                );
              }
              return (
                <>
                  <div className="text-2xl font-bold text-blue-900">--</div>
                  <div className="text-sm text-blue-700">Not ranked</div>
                </>
              );
            })()}
          </div>
        </div>
        {walletAddress && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-900">{player?.totalScore || 0}</div>
                <div className="text-xs text-blue-700">Total Score</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-900">{player?.tokensEarned || 0}</div>
                <div className="text-xs text-blue-700">Tokens Earned</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-900">{player?.currentStage || 1}</div>
                <div className="text-xs text-blue-700">Current Stage</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{leaderboard.length}</div>
          <div className="text-sm text-green-800">Total Players</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(leaderboard.reduce((sum, p) => sum + p.score, 0) / leaderboard.length).toLocaleString()}
          </div>
          <div className="text-sm text-blue-800">Avg Score</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">
            {leaderboard.reduce((sum, p) => sum + p.tokens, 0).toLocaleString()}
          </div>
          <div className="text-sm text-purple-800">Total Tokens</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {leaderboard.reduce((sum, p) => sum + p.nfts, 0)}
          </div>
          <div className="text-sm text-yellow-800">Total NFTs</div>
        </div>
      </div>
    </div>
  );
}
