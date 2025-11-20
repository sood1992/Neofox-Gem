
import React, { useRef } from 'react';
import { StorageService } from '../services/storageService';

export const Settings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          StorageService.importData(e.target.files[0]);
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-dark-card rounded-xl border border-dark-border p-6">
            <h2 className="text-lg font-bold text-dark-text mb-4">Data Management</h2>
            <p className="text-dark-muted text-sm mb-6">
                Manage your local application data. You can export a backup or import previously saved data.
            </p>
            
            <div className="flex gap-4">
                <button 
                    onClick={StorageService.exportData}
                    className="px-4 py-2 bg-primary/10 text-primary rounded hover:bg-primary/20 font-medium text-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export Backup
                </button>
                
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-dark-bg border border-dark-border text-dark-text rounded hover:border-primary hover:text-primary transition-colors font-medium text-sm flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Import Backup
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".json"
                />
            </div>
        </div>

        <div className="bg-dark-card rounded-xl border border-dark-border p-6 opacity-75">
             <h2 className="text-lg font-bold text-dark-text mb-4">Database Connection (Live Mode)</h2>
             <p className="text-dark-muted text-sm mb-4">
                To connect this app to your live MySQL database (cPanel), upload the provided <code>api.php</code> file to your server's root directory.
             </p>
             <div className="bg-warning/10 border border-warning/20 p-4 rounded-lg text-warning text-sm">
                 <strong>Note:</strong> Currently running in "Local/Imported Data Mode". To switch to Live Mode, update the `StorageService` to use `fetch()` calls to your `api.php` endpoint.
             </div>
        </div>
    </div>
  );
};
