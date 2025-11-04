/**
 * Main App component with layout and routing
 */

import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useApp } from './contexts/AppContext';
import { FunifierAPIService } from './services/FunifierAPIService';
import { AuthenticationForm } from './components/AuthenticationForm';
import { AreaList } from './components/AreaList';
import { AreaForm } from './components/AreaForm';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LevelList } from './components/LevelList';
import { LevelForm } from './components/LevelForm';
import { PlayerEvaluationPanel } from './components/PlayerEvaluationPanel';
import { StarVisualization } from './components/StarVisualization';
import { ExportButton } from './components/ExportButton';
import { ImportButton } from './components/ImportButton';
import type { Level } from './types';

function App() {
  const { isAuthenticated, config, clearAuth } = useAuth();
  const {
    areas,
    levels,
    selectedAreaId,
    playerStats,
    setSelectedAreaId,
    setPlayerStats,
    refreshAll,
  } = useApp();

  const [isAreaFormOpen, setIsAreaFormOpen] = useState(false);
  const [isLevelFormOpen, setIsLevelFormOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();
    }
  }, [isAuthenticated]);

  // Show authentication form if not authenticated
  if (!isAuthenticated) {
    return <AuthenticationForm />;
  }

  const apiService = config ? new FunifierAPIService(config) : null;

  const handleAreaSelect = (areaId: string) => {
    setSelectedAreaId(areaId);
  };

  const handleCreateArea = () => {
    setIsAreaFormOpen(true);
  };

  const handleAreaFormSuccess = () => {
    refreshAll();
  };

  const handleCreateLevel = () => {
    setEditingLevel(null);
    setIsLevelFormOpen(true);
  };

  const handleEditLevel = (level: Level) => {
    setEditingLevel(level);
    setIsLevelFormOpen(true);
  };

  const handleLevelFormSuccess = () => {
    refreshAll();
  };

  const handlePlayerStatsChange = (stats: typeof playerStats) => {
    setPlayerStats(stats);
  };

  const handleImportComplete = () => {
    refreshAll();
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    clearAuth();
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">
              Character Star Stats Studio
            </h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-3">
            {apiService && (
              <>
                <ExportButton apiService={apiService} />
                <ImportButton apiService={apiService} onImportComplete={handleImportComplete} />
              </>
            )}
            <button
              onClick={handleLogout}
              className="p-2 sm:px-4 sm:py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - Management Panel */}
        <aside
          className={`
            bg-white border-r border-gray-200 w-80 flex-shrink-0 overflow-y-auto
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:static inset-y-0 left-0 z-30 lg:z-0
            top-[57px] lg:top-0
          `}
          style={{ height: 'calc(100vh - 57px)' }}
        >
          <div className="divide-y divide-gray-200">
            {/* Areas Section */}
            <AreaList
              selectedAreaId={selectedAreaId}
              onAreaSelect={handleAreaSelect}
              onCreateArea={handleCreateArea}
              onAreasChange={refreshAll}
            />

            {/* Levels Section */}
            <LevelList
              selectedAreaId={selectedAreaId}
              onCreateLevel={handleCreateLevel}
              onEditLevel={handleEditLevel}
              onLevelsChange={refreshAll}
            />

            {/* Player Evaluation Section */}
            <PlayerEvaluationPanel onPlayerStatsChange={handlePlayerStatsChange} />
          </div>
        </aside>

        {/* Main Content - Visualization */}
        <main className="flex-1 overflow-hidden p-2 sm:p-4 lg:p-6 lg:ml-0">
          <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 p-2 sm:p-4">
            {areas.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    No Areas Yet
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Create your first area to start building your Character Star Stats
                  </p>
                  <button
                    onClick={handleCreateArea}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create First Area
                  </button>
                </div>
              </div>
            ) : (
              <StarVisualization
                areas={areas}
                levels={levels}
                playerStats={playerStats || undefined}
                onAreaClick={handleAreaSelect}
              />
            )}
          </div>
        </main>

        {/* Overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>

      {/* Modals - High z-index to appear above everything */}
      <AreaForm
        isOpen={isAreaFormOpen}
        onClose={() => setIsAreaFormOpen(false)}
        onSuccess={handleAreaFormSuccess}
      />

      <LevelForm
        isOpen={isLevelFormOpen}
        onClose={() => {
          setIsLevelFormOpen(false);
          setEditingLevel(null);
        }}
        onSuccess={handleLevelFormSuccess}
        selectedAreaId={selectedAreaId}
        editLevel={editingLevel}
      />

      {/* Logout Confirmation */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to log out? You will need to re-enter your credentials to access the studio again."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
    </div>
  );
}

export default App;
