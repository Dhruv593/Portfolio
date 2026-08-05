import React, { useState, useRef, useEffect } from 'react';
import {
  Image as ImageIcon,
  Move,
  ZoomIn,
  RotateCcw,
  Maximize2,
  Minimize2,
  Grid,
  Check,
  Eye,
} from 'lucide-react';
import { normalizeImageUrl } from '../../utils/imageUtils';

interface ImageAdjusterProps {
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  position?: string;
  onPositionChange: (pos: string) => void;
  fit?: 'cover' | 'contain' | 'fill';
  onFitChange: (fit: 'cover' | 'contain' | 'fill') => void;
  scale?: number;
  onScaleChange: (scale: number) => void;
  aspectRatio?: '16:9' | '4:3' | '1:1';
  sectionName?: string;
}

export const ImageAdjuster: React.FC<ImageAdjusterProps> = ({
  imageUrl,
  onImageUrlChange,
  position = '50% 50%',
  onPositionChange,
  fit = 'cover',
  onFitChange,
  scale = 1,
  onScaleChange,
  aspectRatio = '16:9',
  sectionName = 'Card Viewport',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Parse "X% Y%" string to numeric numbers [posX, posY]
  const parsePos = (posStr: string) => {
    const parts = (posStr || '50% 50%').split(' ');
    const x = parseFloat(parts[0]) || 50;
    const y = parseFloat(parts[1]) || 50;
    return { x, y };
  };

  const { x: posX, y: posY } = parsePos(position);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updatePositionFromPointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updatePositionFromPointer(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const updatePositionFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = Math.max(rect.left, Math.min(e.clientX, rect.right));
    const clientY = Math.max(rect.top, Math.min(e.clientY, rect.bottom));

    const newX = Math.round(((clientX - rect.left) / rect.width) * 100);
    const newY = Math.round(((clientY - rect.top) / rect.height) * 100);

    onPositionChange(`${newX}% ${newY}%`);
  };

  // Quick Preset Alignments
  const presets = [
    { label: 'Top Left', x: 0, y: 0 },
    { label: 'Top Center', x: 50, y: 0 },
    { label: 'Top Right', x: 100, y: 0 },
    { label: 'Mid Left', x: 0, y: 50 },
    { label: 'Center', x: 50, y: 50 },
    { label: 'Mid Right', x: 100, y: 50 },
    { label: 'Bottom Left', x: 0, y: 100 },
    { label: 'Bottom Center', x: 50, y: 100 },
    { label: 'Bottom Right', x: 100, y: 100 },
  ];

  const normalizedUrl = normalizeImageUrl(imageUrl);

  const aspectClass =
    aspectRatio === '1:1'
      ? 'aspect-square max-w-xs mx-auto'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : 'aspect-video';

  return (
    <div className="bg-slate-50/90 border border-slate-200/90 p-4 sm:p-5 rounded-2xl space-y-4">
      {/* Label and URL Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#151c27] uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#0058be]" />
            Image Link / URL
          </label>
          <span className="text-[11px] font-semibold text-slate-400">
            Supports Google Drive & Direct Web Images
          </span>
        </div>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
          onBlur={(e) => onImageUrlChange(normalizeImageUrl(e.target.value))}
          placeholder="Paste image link here..."
          className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:border-[#0058be] focus:ring-2 focus:ring-blue-500/10 transition-all"
        />
      </div>

      {/* Preview & Positioning Area */}
      {normalizedUrl ? (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#0058be]" />
              {sectionName} Framing Preview
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Pos: {posX}% {posY}% | Zoom: {scale.toFixed(1)}x
            </span>
          </div>

          {/* Bounding Box Card Viewport */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden border-2 border-[#0058be] bg-slate-900 select-none cursor-crosshair group shadow-inner`}
          >
            {/* The Image */}
            <img
              src={normalizedUrl}
              alt="Preview positioning"
              className="w-full h-full pointer-events-none transition-transform duration-75"
              style={{
                objectFit: fit,
                objectPosition: `${posX}% ${posY}%`,
                transform: `scale(${scale})`,
              }}
            />

            {/* Visual Box Frame Overlay - "This part is visible" */}
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-white/80 rounded-xl m-2 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)] flex items-center justify-center">
              {/* Rule of thirds grid lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Central Focal Point Indicator */}
              <div
                className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#0058be] shadow-lg flex items-center justify-center transition-all duration-75"
                style={{ left: `${posX}%`, top: `${posY}%` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Hover Badge */}
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1">
                <Move className="w-3 h-3 text-blue-400" />
                <span>Click & drag inside box to adjust view</span>
              </div>
            </div>
          </div>

          {/* Sizing & Position Control Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-slate-200/90 text-xs">
            {/* Left: Fit Mode & Scale */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Display Fit Mode</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl font-bold text-[11px]">
                  <button
                    type="button"
                    onClick={() => onFitChange('cover')}
                    className={`py-1 rounded-lg transition-all cursor-pointer ${
                      fit === 'cover'
                        ? 'bg-[#0058be] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Cover (Crop)
                  </button>
                  <button
                    type="button"
                    onClick={() => onFitChange('contain')}
                    className={`py-1 rounded-lg transition-all cursor-pointer ${
                      fit === 'contain'
                        ? 'bg-[#0058be] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Contain
                  </button>
                  <button
                    type="button"
                    onClick={() => onFitChange('fill')}
                    className={`py-1 rounded-lg transition-all cursor-pointer ${
                      fit === 'fill'
                        ? 'bg-[#0058be] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Fill
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <ZoomIn className="w-3.5 h-3.5 text-[#0058be]" /> Image Zoom / Scale
                  </label>
                  <span className="font-mono font-bold text-slate-600">{scale.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={2.5}
                  step={0.05}
                  value={scale}
                  onChange={(e) => onScaleChange(parseFloat(e.target.value))}
                  className="w-full accent-[#0058be] cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Quick Align Grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Grid className="w-3.5 h-3.5 text-[#0058be]" /> Quick Focal Point
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onPositionChange('50% 50%');
                    onScaleChange(1);
                    onFitChange('cover');
                  }}
                  className="text-[10px] font-bold text-slate-500 hover:text-[#0058be] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
                {presets.map((p) => {
                  const isActive = posX === p.x && posY === p.y;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => onPositionChange(`${p.x}% ${p.y}%`)}
                      className={`py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0058be] text-white shadow-2xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200/70'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400 font-medium">
          Paste an image URL above to unlock interactive cropping & framing controls.
        </div>
      )}
    </div>
  );
};
