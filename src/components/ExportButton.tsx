/**
 * ExportButton component for exporting Character Star Stats configuration
 */

import { useState } from 'react';
import { FunifierAPIService } from '../services/FunifierAPIService';
import type { Area, Level } from '../types';

interface ExportButtonProps {
  apiService: FunifierAPIService;
}

interface ExportData {
  version: string;
  exportDate: string;
  areas: Area[];
  levels: Level[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({ apiService }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setMessage(null);

    try {
      // Fetch all areas and levels
      const [areas, levels] = await Promise.all([
        apiService.getAreas(),
        apiService.getLevels(),
      ]);

      // Generate export data structure
      const exportData: ExportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        areas,
        levels,
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const filename = `character-stats-${timestamp}.json`;

      // Create temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setMessage({
        type: 'success',
        text: `Configuration exported successfully! (${areas.length} areas, ${levels.length} levels)`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to export configuration',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="export-button-container">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isExporting ? 'Exporting...' : 'Export Configuration'}
      </button>

      {message && (
        <div
          className={`mt-2 p-3 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};
