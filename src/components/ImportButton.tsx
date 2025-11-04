/**
 * ImportButton component for importing Character Star Stats configuration
 */

import { useState, useRef } from 'react';
import { FunifierAPIService } from '../services/FunifierAPIService';
import { ConfirmDialog } from './ConfirmDialog';
import type { Area, Level, CreateAreaRequest, CreateLevelRequest } from '../types';

interface ImportButtonProps {
  apiService: FunifierAPIService;
  onImportComplete?: () => void;
}

interface ImportData {
  version: string;
  exportDate: string;
  areas: Area[];
  levels: Level[];
}

interface ImportResult {
  areasCreated: number;
  areasFailed: number;
  levelsCreated: number;
  levelsFailed: number;
  errors: string[];
}

export const ImportButton: React.FC<ImportButtonProps> = ({ apiService, onImportComplete }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingImportData, setPendingImportData] = useState<ImportData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateImportData = (data: any): data is ImportData => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON structure');
    }

    if (!data.version || typeof data.version !== 'string') {
      throw new Error('Missing or invalid version field');
    }

    if (!data.exportDate || typeof data.exportDate !== 'string') {
      throw new Error('Missing or invalid exportDate field');
    }

    if (!Array.isArray(data.areas)) {
      throw new Error('Missing or invalid areas array');
    }

    if (!Array.isArray(data.levels)) {
      throw new Error('Missing or invalid levels array');
    }

    // Validate area structure
    for (const area of data.areas) {
      if (!area._id || typeof area._id !== 'string') {
        throw new Error('Invalid area: missing or invalid _id');
      }
      if (!area.title || typeof area.title !== 'string') {
        throw new Error('Invalid area: missing or invalid title');
      }
    }

    // Validate level structure
    for (const level of data.levels) {
      if (!level.area || typeof level.area !== 'string') {
        throw new Error('Invalid level: missing or invalid area');
      }
      if (!level.level || typeof level.level !== 'string') {
        throw new Error('Invalid level: missing or invalid level name');
      }
      if (typeof level.position !== 'number') {
        throw new Error('Invalid level: missing or invalid position');
      }
      if (typeof level.minPoints !== 'number') {
        throw new Error('Invalid level: missing or invalid minPoints');
      }
    }

    return true;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setResult(null);
    setError(null);

    try {
      // Read file content
      const fileContent = await file.text();
      const importData = JSON.parse(fileContent);

      // Validate structure
      if (!validateImportData(importData)) {
        throw new Error('Invalid import data structure');
      }

      // Store the data and show confirmation dialog
      setPendingImportData(importData);
      setShowConfirm(true);
    } catch (err) {
      console.error('Import validation failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to read or validate configuration file');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImportConfirm = async () => {
    if (!pendingImportData) return;

    setShowConfirm(false);
    setIsImporting(true);
    setProgress('Importing configuration...');

    try {
      const importData = pendingImportData;

      const importResult: ImportResult = {
        areasCreated: 0,
        areasFailed: 0,
        levelsCreated: 0,
        levelsFailed: 0,
        errors: [],
      };

      // Import areas first
      setProgress(`Importing areas (0/${importData.areas.length})...`);
      for (let i = 0; i < importData.areas.length; i++) {
        const area = importData.areas[i];
        try {
          const createAreaRequest: CreateAreaRequest = {
            _id: area._id,
            title: area.title,
          };
          await apiService.createArea(createAreaRequest);
          importResult.areasCreated++;
          setProgress(`Importing areas (${i + 1}/${importData.areas.length})...`);
        } catch (err) {
          importResult.areasFailed++;
          const errorMsg = err instanceof Error ? err.message : 'Unknown error';
          importResult.errors.push(`Area "${area.title}": ${errorMsg}`);
        }
      }

      // Import levels
      setProgress(`Importing levels (0/${importData.levels.length})...`);
      for (let i = 0; i < importData.levels.length; i++) {
        const level = importData.levels[i];
        try {
          const createLevelRequest: CreateLevelRequest = {
            area: level.area,
            level: level.level,
            position: level.position,
            minPoints: level.minPoints,
          };
          await apiService.createLevel(createLevelRequest);
          importResult.levelsCreated++;
          setProgress(`Importing levels (${i + 1}/${importData.levels.length})...`);
        } catch (err) {
          importResult.levelsFailed++;
          const errorMsg = err instanceof Error ? err.message : 'Unknown error';
          importResult.errors.push(`Level "${level.level}": ${errorMsg}`);
        }
      }

      setResult(importResult);
      setProgress(null);

      // Call completion callback if provided
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (err) {
      console.error('Import failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to import configuration');
      setProgress(null);
    } finally {
      setIsImporting(false);
      setPendingImportData(null);
    }
  };

  const handleImportCancel = () => {
    setShowConfirm(false);
    setPendingImportData(null);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="import-button-container">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        onClick={handleButtonClick}
        disabled={isImporting}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isImporting ? 'Importing...' : 'Import Configuration'}
      </button>

      {progress && (
        <div className="mt-2 p-3 bg-blue-100 text-blue-800 border border-blue-300 rounded">
          {progress}
        </div>
      )}

      {result && (
        <div className="mt-2 p-4 bg-white border border-gray-300 rounded">
          <h3 className="font-semibold text-lg mb-2">Import Summary</h3>
          <div className="space-y-1 text-sm">
            <p className="text-green-700">
              ✓ Areas created: {result.areasCreated}
            </p>
            {result.areasFailed > 0 && (
              <p className="text-red-700">
                ✗ Areas failed: {result.areasFailed}
              </p>
            )}
            <p className="text-green-700">
              ✓ Levels created: {result.levelsCreated}
            </p>
            {result.levelsFailed > 0 && (
              <p className="text-red-700">
                ✗ Levels failed: {result.levelsFailed}
              </p>
            )}
          </div>

          {result.errors.length > 0 && (
            <div className="mt-3">
              <p className="font-semibold text-sm text-red-800 mb-1">Errors:</p>
              <ul className="text-xs text-red-700 space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 p-3 bg-red-100 text-red-800 border border-red-300 rounded">
          {error}
        </div>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        title="Import Configuration"
        message={`This will import ${pendingImportData?.areas.length || 0} areas and ${pendingImportData?.levels.length || 0} levels. Existing items with the same IDs may be affected. Do you want to continue?`}
        confirmLabel="Import"
        cancelLabel="Cancel"
        confirmVariant="primary"
        onConfirm={handleImportConfirm}
        onCancel={handleImportCancel}
      />
    </div>
  );
};
