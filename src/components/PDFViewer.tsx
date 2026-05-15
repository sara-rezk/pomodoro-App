import React, { useState, useEffect } from 'react';
import { FileText, Upload, Plus } from 'lucide-react';
import { savePDF, getStoredPDF, clearStoredPDF } from '../lib/pdfStorage';

export const PDFViewer: React.FC = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStored = async () => {
      try {
        const stored = await getStoredPDF();
        if (stored) {
          const url = URL.createObjectURL(stored.blob);
          setFileUrl(url);
          setFileName(stored.name);
        }
      } catch (e) {
        console.error("Failed to load stored PDF", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadStored();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      try {
        // Clean up previous URL if it exists
        if (fileUrl) URL.revokeObjectURL(fileUrl);
        
        await savePDF(file, file.name);
        const url = URL.createObjectURL(file);
        setFileUrl(url);
        setFileName(file.name);
      } catch (err) {
        console.error("Failed to save PDF", err);
      }
    }
  };

  const handleClose = async () => {
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    await clearStoredPDF();
    setFileUrl(null);
    setFileName(null);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-indigo"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col w-full">
      <div className="flex flex-col md:flex-row items-center justify-between glass-panel p-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-indigo/10 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-brand-indigo" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Kütüphane Sistemi</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{fileName || 'Belge Yüklenmedi'}</p>
          </div>
        </div>
        <label className="cursor-pointer bg-brand-indigo text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-neon flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Protokol Yükle
          <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      <div className="flex-1 min-h-[500px] glass-panel rounded-[2.5rem] overflow-hidden relative border-2 border-slate-100/50">
        {fileUrl ? (
          <div className="w-full h-full relative">
            <embed
              src={fileUrl}
              type="application/pdf"
              className="w-full h-full"
            />
            <div className="absolute top-4 right-4 flex gap-2">
               <button 
                 onClick={handleClose}
                 className="bg-white/90 backdrop-blur-md text-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-white transition-colors border border-slate-100"
               >
                 Kapat
               </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-6 p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center animate-pulse">
              <Plus className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-2">
              <p className="font-black uppercase tracking-[0.3em] text-slate-500 text-sm">Arşiv Boş</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase max-w-[240px] leading-relaxed">
                Okumak istediğiniz akademik makaleyi veya notu buraya yükleyerek odak modunda inceleyin.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
