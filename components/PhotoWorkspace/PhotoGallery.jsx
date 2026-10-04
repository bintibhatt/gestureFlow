'use client';

import React from 'react';
import { Images, Trash2, CheckCircle2 } from 'lucide-react';

const PhotoGallery = React.memo(function PhotoGallery({
  photos = [],
  selectedIndex = 0,
  onSelectPhoto,
  onRequestDelete,
}) {
  if (photos.length === 0) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl shadow-md flex flex-col items-center justify-center space-y-2 text-center">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-500 mb-1">
          <Images className="w-5 h-5 text-zinc-400" />
        </div>
        <p className="text-xs text-zinc-400 font-medium">No photos saved in gallery yet.</p>
        <p className="text-[11px] text-zinc-500">Show 👍 Thumbs Up to capture your first photo.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-950 border border-zinc-800 p-3.5 sm:p-4 rounded-xl flex flex-col space-y-2.5 shadow-md">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center space-x-2">
          <Images className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider">PHOTO GALLERY</h3>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-md">
          {selectedIndex + 1} / {photos.length} {photos.length === 1 ? 'PHOTO' : 'PHOTOS'}
        </span>
      </div>

      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-2.5 max-h-[160px] overflow-y-auto custom-scrollbar p-0.5">
        {photos.map((photo, idx) => {
          const isSelected = idx === selectedIndex;
          const imgSrc = photo.currentDataUrl || photo.originalDataUrl || photo.dataUrl;

          return (
            <div
              key={photo.id}
              onClick={() => onSelectPhoto && onSelectPhoto(idx, photo)}
              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border transition-all group ${
                isSelected
                  ? 'border-white ring-2 ring-white/20 opacity-100'
                  : 'border-zinc-800 hover:border-zinc-700 opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={imgSrc}
                alt={photo.name}
                className="w-full h-full object-cover"
              />

              {isSelected && (
                <div className="absolute top-1 right-1 bg-white rounded p-0.5 text-black shadow-sm font-bold">
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRequestDelete) onRequestDelete(photo);
                }}
                title="Delete Photo"
                className="absolute bottom-1 right-1 p-1 bg-zinc-800 hover:bg-rose-600 text-white rounded opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition shadow-sm"
              >
                <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default PhotoGallery;


