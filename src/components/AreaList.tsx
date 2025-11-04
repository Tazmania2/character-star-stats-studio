/**
 * AreaList component - Displays and manages areas
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FunifierAPIService } from '../services/FunifierAPIService';
import { LoadingSpinner } from './LoadingSpinner';
import { ConfirmDialog } from './ConfirmDialog';
import type { Area, Level } from '../types';

interface AreaListProps {
  selectedAreaId: string | null;
  onAreaSelect: (areaId: string) => void;
  onCreateArea: () => void;
  onAreasChange: () => void;
}

export function AreaList({ selectedAreaId, onAreaSelect, onCreateArea, onAreasChange }: AreaListProps) {
  const { config } = useAuth();
  const [areas, setAreas] = useState<Area[]>([]);
  const [levelCounts, setLevelCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ areaId: string; areaTitle: string } | null>(null);

  const apiService = config ? new FunifierAPIService(config) : null;

  // Fetch areas and level counts
  const fetchAreas = async () => {
    if (!apiService) return;

    setLoading(true);
    setError(null);

    try {
      const [areasData, levelsData] = await Promise.all([
        apiService.getAreas(),
        apiService.getLevels(),
      ]);

      setAreas(areasData);

      // Count levels per area
      const counts: Record<string, number> = {};
      levelsData.forEach((level: Level) => {
        counts[level.area] = (counts[level.area] || 0) + 1;
      });
      setLevelCounts(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load areas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, [config]);

  // Expose refresh to parent
  useEffect(() => {
    const handleRefresh = () => fetchAreas();
    window.addEventListener('refresh-areas', handleRefresh);
    return () => window.removeEventListener('refresh-areas', handleRefresh);
  }, [config]);

  const handleDeleteClick = (area: Area) => {
    setDeleteConfirm({ areaId: area._id, areaTitle: area.title });
  };

  const handleDeleteConfirm = async () => {
    if (!apiService || !deleteConfirm) return;

    try {
      await apiService.deleteArea(deleteConfirm.areaId);
      await fetchAreas();
      onAreasChange();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete area');
      setDeleteConfirm(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-medium">Error loading areas</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={fetchAreas}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Areas</h2>
        <button
          onClick={onCreateArea}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Create Area
        </button>
      </div>

      {areas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No areas yet</p>
          <p className="text-sm mt-1">Create your first area to get started</p>
        </div>
      ) : (
        <div className="space-y-2">
          {areas.map((area) => (
            <div
              key={area._id}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all
                ${selectedAreaId === area._id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
              onClick={() => onAreaSelect(area._id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{area.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {levelCounts[area._id] || 0} level{levelCounts[area._id] !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(area);
                  }}
                  className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete area"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm !== null}
        title="Delete Area"
        message={`Are you sure you want to delete "${deleteConfirm?.areaTitle}"? This action cannot be undone and will also delete all associated levels.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
