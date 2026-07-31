import { useState, useEffect } from 'react';
import { X, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axios';

interface DocumentViewerModalProps {
  url: string;
  onClose: () => void;
}

export default function DocumentViewerModal({ url, onClose }: DocumentViewerModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    
    const fetchDocument = async () => {
      try {
        setLoading(true);
        // Since url is like '/uploads/file.pdf', we remove '/api' from baseURL if we want to hit root
        // But the easiest way is to use a direct absolute URL if it's static
        // Or we just strip /api from the default baseURL
        const baseURL = api.defaults.baseURL?.replace('/api', '') || 'https://hospital-management-system-production-ba1e.up.railway.app';
        const fullUrl = `${baseURL}${url}`;
        
        const response = await api.get(fullUrl, {
          responseType: 'blob'
        });
        
        objectUrl = URL.createObjectURL(response.data);
        setBlobUrl(objectUrl);
      } catch (err) {
        console.error("Failed to load document", err);
        setError("Failed to load the document securely.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocument();
    
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url]);

  // Fallback URL for opening in a new tab if needed
  const fallbackUrl = `${api.defaults.baseURL?.replace('/api', '') || 'https://hospital-management-system-production-ba1e.up.railway.app'}${url}`;
  
  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div>
            <h3 className="font-bold text-lg">Document Viewer</h3>
            <p className="text-slate-400 text-xs mt-0.5">{url.split('/').pop()}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={fallbackUrl} target="_blank" rel="noreferrer" 
               className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition flex items-center gap-2 text-sm font-medium">
              <ExternalLink size={16} /> Open in New Tab
            </a>
            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 bg-slate-100 p-4 flex items-center justify-center relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10">
              <Loader2 className="animate-spin text-slate-400 mb-2" size={32} />
              <p className="text-slate-500 font-medium text-sm">Loading document securely...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-10">
              <AlertCircle className="text-red-400 mb-2" size={48} />
              <p className="text-slate-600 font-bold mb-1">Could not display document</p>
              <p className="text-slate-500 text-sm">{error}</p>
              <a href={fallbackUrl} target="_blank" rel="noreferrer" 
                 className="mt-4 bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700">
                Try Opening in New Tab
              </a>
            </div>
          )}
          
          {blobUrl && !error && (
            <iframe 
              src={blobUrl} 
              className="w-full h-full rounded-xl border border-slate-300 bg-white"
              title="Document Viewer"
            />
          )}
        </div>
      </div>
    </div>
  );
}
