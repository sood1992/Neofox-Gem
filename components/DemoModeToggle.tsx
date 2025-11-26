import React from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface DemoModeToggleProps {
  isDemoMode: boolean;
  onToggle: () => void;
}

export const DemoModeToggle: React.FC<DemoModeToggleProps> = ({ isDemoMode, onToggle }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Demo Mode Indicator (when active) */}
      {isDemoMode && (
        <div className="mb-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-lg px-4 py-2 backdrop-blur-sm animate-pulse">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-300">DEMO MODE ACTIVE</span>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`group relative px-6 py-3 rounded-xl font-semibold text-sm shadow-2xl transition-all duration-300 transform hover:scale-105 ${
          isDemoMode
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
            : 'bg-gradient-to-r from-primary to-accent text-white hover:from-primary-hover hover:to-accent'
        }`}
      >
        <div className="flex items-center space-x-2">
          {isDemoMode ? (
            <>
              <EyeOff className="w-5 h-5" />
              <span>Exit Demo</span>
            </>
          ) : (
            <>
              <Eye className="w-5 h-5" />
              <span>Try Demo</span>
            </>
          )}
        </div>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 w-64 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-dark-card border border-dark-border rounded-lg p-3 shadow-xl">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-dark-text mb-1">
                  {isDemoMode ? 'Exit Demo Mode' : 'Try Demo Mode'}
                </p>
                <p className="text-xs text-dark-muted">
                  {isDemoMode
                    ? 'Return to your real workspace with actual data'
                    : 'Explore the platform with realistic sample data. No signup required!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

/* Demo Mode Banner (for top of page) */
export const DemoModeBanner: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-yellow-500/30 px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Eye className="w-5 h-5 text-yellow-400" />
          <div>
            <p className="text-sm font-semibold text-yellow-300">
              🎭 Demo Mode Active
            </p>
            <p className="text-xs text-yellow-400/80">
              You're exploring the platform with sample data. Your real data is safe.
            </p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 rounded-lg text-sm font-medium text-yellow-300 transition-colors"
        >
          Exit Demo
        </button>
      </div>
    </div>
  );
};
