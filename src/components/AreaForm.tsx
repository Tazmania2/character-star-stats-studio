/**
 * AreaForm component - Modal form for creating areas
 */

import { useState, type FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FunifierAPIService } from '../services/FunifierAPIService';
import type { CreateAreaRequest } from '../types';

interface AreaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AreaForm({ isOpen, onClose, onSuccess }: AreaFormProps) {
  const { config } = useAuth();
  const [formData, setFormData] = useState<CreateAreaRequest>({
    _id: '',
    title: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof CreateAreaRequest, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const apiService = config ? new FunifierAPIService(config) : null;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateAreaRequest, string>> = {};

    // Validate ID
    if (!formData._id.trim()) {
      newErrors._id = 'Area ID is required';
    } else if (!/^[a-z0-9-]+$/.test(formData._id)) {
      newErrors._id = 'Area ID must be lowercase letters, numbers, and hyphens only';
    }

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = 'Area title is required';
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
      await apiService.createArea(formData);
      setSubmitSuccess(true);
      
      // Reset form
      setFormData({ _id: '', title: '' });
      setErrors({});
      
      // Notify parent and close after short delay
      setTimeout(() => {
        onSuccess();
        onClose();
        setSubmitSuccess(false);
      }, 1000);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create area');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setFormData({ _id: '', title: '' });
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
          <h2 className="text-xl font-semibold text-gray-900">Create New Area</h2>
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
              Area created successfully!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="area-id" className="block text-sm font-medium text-gray-700 mb-1">
                Area ID
              </label>
              <input
                id="area-id"
                type="text"
                value={formData._id}
                onChange={(e) => setFormData({ ...formData, _id: e.target.value })}
                disabled={submitting}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors._id ? 'border-red-300' : 'border-gray-300'}
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
                placeholder="e.g., combat-skills"
              />
              {errors._id && (
                <p className="mt-1 text-sm text-red-600">{errors._id}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Use lowercase letters, numbers, and hyphens (e.g., combat-skills)
              </p>
            </div>

            <div>
              <label htmlFor="area-title" className="block text-sm font-medium text-gray-700 mb-1">
                Area Title
              </label>
              <input
                id="area-title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={submitting}
                className={`
                  w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${errors.title ? 'border-red-300' : 'border-gray-300'}
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                `}
                placeholder="e.g., Combat Skills"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed font-medium"
            >
              {submitting ? 'Creating...' : 'Create Area'}
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
