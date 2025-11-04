/**
 * LevelList component - Displays and manages levels for a selected area
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FunifierAPIService } from '../services/FunifierAPIService';
import { LoadingSpinner } from './LoadingSpinner';
import { ConfirmDialog } from './ConfirmDialog';
import type { Level } from '../types';

interface LevelListProps {
  selectedAreaId: string | null;
  onCreateLevel: () => void;
  onEditLevel: (level: Level) => void;
  onLevelsChange: () => void;
}

export function LevelList({ selectedAreaId, onCreateLevel, onEditLevel, onLevelsChange }: LevelListProps) {
  const { config } = useAuth();
  const [levels, setLevels] = useState<Level[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ levelId: string; levelName: string } | null>(null);

  const apiService = config ? new FunifierAPIService(config) : null;

  // Fetch levels for selected area
  const fetchLevels = async () => {
    if (!apiService || !selectedAreaId) {
      setLevels([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const levelsData = await apiService.getLevels({ area: selectedAreaId });
      
      // Sort by position
      const sortedLevels = levelsData.sort((a, b) => a.position - b.position);
      setLevels(sortedLevels);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load levels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, [selectedAreaId, config]);

  // Expose refresh to parent
  useEffect(() => {
    const handleRefresh = () => fetchLevels();
    window.addEventListener('refresh-levels', handleRefresh);
    return () => window.removeEventListener('refresh-levels', handleRefresh);
  }, [selectedAreaId, config]);

  const handleDeleteClick = (level: Level) => {
    setDeleteConfirm({ levelId: level._id!, levelName: level.level });
  };

  const handleDeleteConfirm = async () => {
    if (!apiService || !deleteConfirm) return;

    try {
      await apiService.deleteLevel(deleteConfirm.levelId);
      await fetchLevels();
      onLevelsChange();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete level');
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  // Empty state when no area is selected
  if (!selectedAreaId) {
    return (
      <div className="p-4" style={{ backgroundColor: '#4ade80' }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Levels</h2>
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p>Select an area to view its levels</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4" style={{ backgroundColor: '#4ade80' }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Levels</h2>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4" style={{ backgroundColor: '#4ade80' }}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Levels</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Error loading levels</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchLevels}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4" style={{ backgroundColor: '#4ade80' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Levels</h2>
        <button
          onClick={onCreateLevel}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Create Level
        </button>
      </div>

      {levels.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No levels yet</p>
          <p className="text-sm mt-1">Create the first level for this area</p>
        </div>
      ) : (
        <div className="space-y-2">
          {levels.map((level) => (
            <div
              key={level._id}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                      {level.position}
                    </span>
                    <h3 className="font-medium text-gray-900">{level.level}</h3>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <p>Minimum Points: <span className="font-medium">{level.minPoints}</span></p>
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => onEditLevel(level)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Edit level"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(level)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete level"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Level"
        message={`Are you sure you want to delete "${deleteConfirm?.levelName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
