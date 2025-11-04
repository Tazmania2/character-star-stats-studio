/**
 * LevelForm component - Modal form for creating and editing levels
 */

import { useState, useEffect, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FunifierAPIService } from '../services/FunifierAPIService';
import type { CreateLevelRequest, Area, Level } from '../types';

interface LevelFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedAreaId?: string | null;
  editLevel?: Level | null;
}

export function LevelForm({ isOpen, onClose, onSuccess, selectedAreaId, editLevel }: LevelFormProps) {
  const { config } = useAuth();
  const [areas, setAreas] = useState<Area[]>([]);
  const [formData, setFormData] = useState<CreateLevelRequest>({
    area: selectedAreaId || '',
    level: '',
    position: 0,
    minPoints: 0,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateLevelRequest, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const apiService = config ? new FunifierAPIService(config) : null;

  // Load areas for dropdown
  useEffect(() => {
    const fetchAreas = async () => {
      if (!apiService) return;
      try {
        const areasData = await apiService.getAreas();
        setAreas(areasData);
      } catch (err) {
        console.error('Failed to load areas:', err);
      }
    };

    if (isOpen) {
      fetchAreas();
    }
  }, [isOpen, config]);

  // Initialize form with selected area or edit data
  useEffect(() => {
    if (isOpen) {
      if (editLevel) {
        setFormData({
          area: editLevel.area,
          level: editLevel.level,
          position: editLevel.position,
          minPoints: editLevel.minPoints,
        });
      } else {
        setFormData({
          area: selectedAreaId || '',
          level: '',
          position: 0,
          minPoints: 0,
        });
      }
    }
  }, [isOpen, selectedAreaId, editLevel]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateLevelRequest, string>> = {};

    // Validate area
    if (!formData.area) {
      newErrors.area = 'Area is required';
    }

    // Validate level name
    if (!formData.level.trim()) {
      newErrors.level = 'Level name is required';
    }

    // Validate position
    if (formData.position < 0) {
      newErrors.position = 'Position must be a positive integer';
    }
    if (!Number.isInteger(formData.position)) {
      newErrors.position = 'Position must be an integer';
    }

    // Validate minPoints
    if (formData.minPoints < 0) {
      newErrors.minPoints = 'Minimum points must be a positive integer';
    }
    if (!Number.isInteger(formData.minPoints)) {
      newErrors.minPoints = 'Minimum points must be an integer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!apiService) return;
    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await apiService.createLevel(formData);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({
        area: selectedAreaId || '',
        level: '',
        position: 0,
        minPoints: 0,
      });
      setErrors({});
      
      // Notify parent and close after short delay
      setTimeout(() => {
        onSuccess();
        onClose();
        setSubmitSuccess(false);
      }, 1000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save level');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFormData({
        area: selectedAreaId || '',
        level: '',
        position: 0,
        minPoints: 0,
      });
      setErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto" style={{ zIndex: 9999 }}>
      <div className="rounded-lg shadow-xl max-w-md w-full my-8" style={{ backgroundColor: '#93c5fd' }}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {editLevel ? 'Edit Level' : 'Create New Level'}
          </h2>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {submitError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Level {editLevel ? 'updated' : 'created'} successfully!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="level-area" className="block text-sm font-medium text-gray-700 mb-1">
                Area
              </label>
              <select
                id="level-area"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                disabled={submitting}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.area ? 'border-red-300' : 'border-gray-300'}
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
              >
                <option value="">Select an area</option>
                {areas.map((area) => (
                  <option key={area._id} value={area._id}>
                    {area.title}
                  </option>
                ))}
              </select>
              {errors.area && (
                <p className="mt-1 text-sm text-red-600">{errors.area}</p>
              )}
            </div>

            <div>
              <label htmlFor="level-name" className="block text-sm font-medium text-gray-700 mb-1">
                Level Name
              </label>
              <input
                id="level-name"
                type="text"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                disabled={submitting}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.level ? 'border-red-300' : 'border-gray-300'}
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
                placeholder="e.g., Beginner"
              />
              {errors.level && (
                <p className="mt-1 text-sm text-red-600">{errors.level}</p>
              )}
            </div>

            <div>
              <label htmlFor="level-position" className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <input
                id="level-position"
                type="number"
                min="0"
                step="1"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) || 0 })}
                disabled={submitting}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.position ? 'border-red-300' : 'border-gray-300'}
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
                placeholder="0"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Order within the area (0-based)
              </p>
            </div>

            <div>
              <label htmlFor="level-minpoints" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Points
              </label>
              <input
                id="level-minpoints"
                type="number"
                min="0"
                step="1"
                value={formData.minPoints}
                onChange={(e) => setFormData({ ...formData, minPoints: parseInt(e.target.value) || 0 })}
                disabled={submitting}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.minPoints ? 'border-red-300' : 'border-gray-300'}
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
                placeholder="0"
              />
              {errors.minPoints && (
                <p className="mt-1 text-sm text-red-600">{errors.minPoints}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Points required to reach this level
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Saving...' : editLevel ? 'Update Level' : 'Create Level'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
