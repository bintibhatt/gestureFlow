'use client';

import React from 'react';
import { Images, Trash2, CheckCircle2 } from 'lucide-react';

export default function PhotoGallery({
  photos = [],
  selectedIndex = 0,
  onSelectPhoto,
  onRequestDelete,
}) {
  if (photos.length === 0) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-xl flex flex-col items-center justify-center space-y-2 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-600 mb-1">
          <Images className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-400 font-medium">No photos saved in gallery yet.</p>
        <p className="text-[11px] text-slate-500">Show 👍 Thumbs Up to capture your first photo.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Images className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">PHOTO GALLERY</h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
          {selectedIndex + 1} / {photos.length} {photos.length === 1 ? 'PHOTO' : 'PHOTOS'}
        </span>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-[160px] overflow-y-auto custom-scrollbar p-1">
        {photos.map((photo, idx) => {
          const isSelected = idx === selectedIndex;
          const imgSrc = photo.currentDataUrl || photo.originalDataUrl || photo.dataUrl;

          return (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto && onSelectPhoto(idx, photo)}
              className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all group ${
                isSelected
                  ? 'border-cyan-400 ring-2 ring-cyan-500/30 scale-95 shadow-lg'
                  : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={imgSrc}
                alt={photo.name}
                className="w-full h-full object-cover"
              />

              {isSelected && (
                <div className="absolute top-1.5 right-1.5 bg-cyan-500 rounded-full p-0.5 text-slate-950 shadow-md">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRequestDelete) onRequestDelete(photo);
                }}
                title="Delete Photo"
                className="absolute bottom-1.5 right-1.5 p-1.5 bg-rose-600/90 hover:bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition shadow-lg"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
