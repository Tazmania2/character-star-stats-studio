/**
 * PlayerEvaluationPanel component - Evaluates and displays player progress
 */

import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FunifierAPIService } from '../services/FunifierAPIService';
import { LoadingSpinner } from './LoadingSpinner';
import type { PlayerStats } from '../types';

interface PlayerEvaluationPanelProps {
  onPlayerStatsChange?: (stats: PlayerStats | null) => void;
}

export function PlayerEvaluationPanel({ onPlayerStatsChange }: PlayerEvaluationPanelProps) {
  const { config } = useAuth();
  const [playerId, setPlayerId] = useState('');
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiService = config ? new FunifierAPIService(config) : null;

  const handleEvaluate = async (e: FormEvent) => {
    e.preventDefault();

    if (!apiService || !playerId.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const stats = await apiService.evaluatePlayer(playerId.trim());
      setPlayerStats(stats);
      onPlayerStatsChange?.(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate player');
      setPlayerStats(null);
      onPlayerStatsChange?.(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPlayerId('');
    setPlayerStats(null);
    setError(null);
    onPlayerStatsChange?.(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Player Evaluation</h2>

      <form onSubmit={handleEvaluate} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={playerId}
            onChange={(e) => setPlayerId(e.target.value)}
            placeholder="Enter player ID"
            disabled={loading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={loading || !playerId.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'Evaluating...' : 'Evaluate'}
          </button>
          {playerStats && (
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {playerStats && !loading && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h3 className="font-medium text-gray-900">
              Player: <span className="text-blue-600">{playerStats.player}</span>
            </h3>
          </div>

          {playerStats.stats.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No stats available for this player</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Level
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points to Next
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {playerStats.stats.map((stat, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {stat.area}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {stat.next_level?.level || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(stat.percent_completed, 100)}%` }}
                            />
                          </div>
                          <span className="text-gray-700 font-medium">
                            {stat.percent_completed.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {stat.next_points > 0 ? (
                          <span>{stat.next_points} pts</span>
                        ) : (
                          <span className="text-green-600 font-medium">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
            <p>
              Total Areas: <span className="font-medium">{playerStats.stats.length}</span>
            </p>
          </div>
        </div>
      )}

      {!playerStats && !loading && !error && (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <p>Enter a player ID to view their progress</p>
        </div>
      )}
    </div>
  );
}
