'use client';

import { useGeneralLeaderboard } from '@/hooks/useCeloRunner';
import Link from 'next/link';

export default function LeaderboardPage() {
  const { leaderboard, isLoading } = useGeneralLeaderboard(20);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-900 via-blue-900 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="nes-container with-title is-centered pixel-art" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <p className="title pixel-font text-primary">LEADERBOARD</p>
          
          <div className="text-center mb-6">
            <p className="text-sm text-gray-700">
              Top players across all stages
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-700">Loading leaderboard...</p>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-700">No games played yet. Be the first!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="nes-table is-bordered w-full">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player</th>
                    <th>Stage</th>
                    <th>Score</th>
                    <th>Coins</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={`${entry.player}-${entry.timestamp}`}>
                      <td className="text-center">
                        {entry.rank === 1 && '🥇'}
                        {entry.rank === 2 && '🥈'}
                        {entry.rank === 3 && '🥉'}
                        {entry.rank > 3 && entry.rank}
                      </td>
                      <td className="text-xs">
                        {entry.player.slice(0, 6)}...{entry.player.slice(-4)}
                      </td>
                      <td className="text-center">{entry.stage}</td>
                      <td className="text-center font-bold">{entry.score}</td>
                      <td className="text-center">{entry.coinsCollected}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/">
              <button className="nes-btn is-primary">
                ← Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
