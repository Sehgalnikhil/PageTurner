import React, { useState, useRef, useContext } from 'react';
import {
  PiXBold,
  PiDownloadSimpleBold,
  PiPrinterBold,
  PiSparkleBold,
  PiPaintBrushBroadBold,
  PiCheckBold,
  PiTagBold,
} from 'react-icons/pi';
import { AuthContext } from '../../context/AuthContext';

const MOTIFS = [
  {
    id: 'victorian',
    name: 'Victorian Botanical',
    subtitle: 'Acanthus leaf scrollwork & flora',
  },
  {
    id: 'celestial',
    name: 'Celestial Medieval',
    subtitle: 'Moon, constellation & open codex',
  },
  {
    id: 'art-deco',
    name: 'Art Deco Gilt',
    subtitle: '1920s geometric sunburst & arches',
  },
];

const INK_COLORS = [
  { id: 'burgundy', name: 'Archival Burgundy', hex: '#7B1826' },
  { id: 'sepia', name: 'Victorian Sepia', hex: '#4A3728' },
  { id: 'prussian', name: 'Prussian Blue', hex: '#1B2E3D' },
  { id: 'forest', name: 'Antique Forest', hex: '#1E3A2B' },
];

const MOTTO_PRESETS = [
  'Ex Libris',
  'From the Private Library of',
  'To Read is to Inhabit Another Soul',
  'Words Once Read Remain Forever',
];

const BookplateModal = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const [ownerName, setOwnerName] = useState(user?.username || 'A Discerning Reader');
  const [motif, setMotif] = useState('victorian');
  const [inkColor, setInkColor] = useState(INK_COLORS[0]);
  const [motto, setMotto] = useState(MOTTO_PRESETS[0]);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef(null);

  if (!isOpen) return null;

  // Print bookplate sheet
  const handlePrint = () => {
    window.print();
  };

  // Download SVG as PNG
  const handleDownload = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, 1200, 1600);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `Ex_Libris_${ownerName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    img.src = url;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-stone-300 overflow-hidden my-6 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Control Panel */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200 bg-white">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-burgundy/10 text-burgundy font-mono text-[10px] font-bold uppercase tracking-wider">
                <PiTagBold />
                <span>Ex Libris Studio</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                <PiXBold className="text-lg" />
              </button>
            </div>

            <h3 className="font-serif text-2xl font-bold text-stone-900 tracking-tight leading-snug">
              Custom Bookplate Generator
            </h3>
            <p className="text-xs text-stone-500 font-serif italic mt-1 mb-6">
              Brand your personal collection with bespoke woodblock-engraved library plates.
            </p>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Reader Name */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Reader Name / Library Owner
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  maxLength={32}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
                />
              </div>

              {/* Motto / Inscription Preset */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Motto / Header Inscription
                </label>
                <select
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-serif text-xs focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy"
                >
                  {MOTTO_PRESETS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Motif Selection */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Border Motif Design
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {MOTIFS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setMotif(item.id)}
                      className={`px-3.5 py-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                        motif === item.id
                          ? 'border-burgundy bg-burgundy/5 text-stone-900 ring-1 ring-burgundy/20'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div>
                        <span className="font-serif text-xs font-bold block">{item.name}</span>
                        <span className="text-[10px] text-stone-500 font-serif italic">{item.subtitle}</span>
                      </div>
                      {motif === item.id && <PiCheckBold className="text-burgundy text-xs" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ink Color */}
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 mb-1.5">
                  Archival Ink Palette
                </label>
                <div className="flex items-center gap-2">
                  {INK_COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setInkColor(color)}
                      title={color.name}
                      className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-mono flex items-center justify-center gap-1.5 transition-all ${
                        inkColor.id === color.id
                          ? 'border-stone-800 ring-2 ring-stone-900/10 font-bold'
                          : 'border-stone-200 hover:border-stone-300 opacity-80'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color.hex }} />
                      <span className="truncate">{color.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 border-t border-stone-200 flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-burgundy hover:bg-[#63121E] text-white font-serif font-semibold text-xs shadow-md transition-all active:scale-95"
            >
              <PiDownloadSimpleBold className="text-sm" />
              <span>{copied ? 'Downloaded!' : 'Export PNG Sticker'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-serif font-semibold text-xs transition-all active:scale-95"
              title="Print standard 3x4 sheet"
            >
              <PiPrinterBold className="text-sm" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Right Live Preview Canvas */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 bg-[#EFE9DF] flex flex-col items-center justify-center relative overflow-hidden">
          <span className="text-[10px] font-mono uppercase tracking-widest text-stone-500 font-bold mb-4">
            Live Archival Plate Preview
          </span>

          {/* Scaled Printable Sheet */}
          <div
            id="printable-bookplate-sheet"
            className="w-[260px] sm:w-[290px] h-[370px] sm:h-[410px] bg-[#FAF5EC] rounded-xl shadow-2xl p-6 border border-[#D5C2AA] relative flex flex-col justify-between text-center select-none"
            style={{ color: inkColor.hex }}
          >
            {/* SVG Rendered Bookplate */}
            <svg
              ref={svgRef}
              viewBox="0 0 300 420"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="300" height="420" fill="#FAF5EC" />

              {/* Decorative Outer Border */}
              <rect
                x="14"
                y="14"
                width="272"
                height="392"
                fill="none"
                stroke={inkColor.hex}
                strokeWidth="2.5"
                strokeDasharray={motif === 'art-deco' ? '0' : 'none'}
              />
              <rect
                x="20"
                y="20"
                width="260"
                height="380"
                fill="none"
                stroke={inkColor.hex}
                strokeWidth="1"
                opacity="0.6"
              />

              {/* Motif-Specific Ornaments */}
              {motif === 'victorian' && (
                <>
                  {/* Floral Corner Ornaments */}
                  <circle cx="28" cy="28" r="4" fill={inkColor.hex} />
                  <circle cx="272" cy="28" r="4" fill={inkColor.hex} />
                  <circle cx="28" cy="392" r="4" fill={inkColor.hex} />
                  <circle cx="272" cy="392" r="4" fill={inkColor.hex} />
                  {/* Victorian Top Crest Ribbon */}
                  <path
                    d="M 60 48 Q 150 30 240 48 Q 150 42 60 48 Z"
                    fill={inkColor.hex}
                    opacity="0.8"
                  />
                  {/* Central Open Book Engraving */}
                  <g transform="translate(110, 110)">
                    <path
                      d="M 5 35 Q 20 20 40 25 Q 40 55 5 65 Z"
                      fill="none"
                      stroke={inkColor.hex}
                      strokeWidth="2"
                    />
                    <path
                      d="M 75 35 Q 60 20 40 25 Q 40 55 75 65 Z"
                      fill="none"
                      stroke={inkColor.hex}
                      strokeWidth="2"
                    />
                    <line x1="40" y1="25" x2="40" y2="55" stroke={inkColor.hex} strokeWidth="2" />
                  </g>
                </>
              )}

              {motif === 'celestial' && (
                <>
                  {/* Crescent Moon & Stars */}
                  <path
                    d="M 150 45 A 15 15 0 0 0 162 70 A 18 18 0 1 1 150 45 Z"
                    fill={inkColor.hex}
                  />
                  <polygon points="120,55 123,62 130,63 125,68 126,75 120,71 114,75 115,68 110,63 117,62" fill={inkColor.hex} />
                  <polygon points="180,55 183,62 190,63 185,68 186,75 180,71 174,75 175,68 170,63 177,62" fill={inkColor.hex} />
                  <circle cx="150" cy="150" r="30" fill="none" stroke={inkColor.hex} strokeWidth="1.5" strokeDasharray="3 3" />
                </>
              )}

              {motif === 'art-deco' && (
                <>
                  {/* Sunburst & Chevron Arches */}
                  <path d="M 150 30 L 150 70 M 130 35 L 145 68 M 170 35 L 155 68 M 110 45 L 140 70 M 190 45 L 160 70" stroke={inkColor.hex} strokeWidth="1.5" />
                  <line x1="40" y1="75" x2="260" y2="75" stroke={inkColor.hex} strokeWidth="2" />
                  <line x1="60" y1="80" x2="240" y2="80" stroke={inkColor.hex} strokeWidth="1" />
                </>
              )}

              {/* Motto Header */}
              <text
                x="150"
                y="190"
                textAnchor="middle"
                fontFamily="Playfair Display, Georgia, serif"
                fontSize="13"
                letterSpacing="3"
                fill={inkColor.hex}
                fontStyle="italic"
              >
                {motto.toUpperCase()}
              </text>

              {/* Reader's Name in Bold Elegant Serif */}
              <text
                x="150"
                y="235"
                textAnchor="middle"
                fontFamily="Playfair Display, Georgia, serif"
                fontSize="20"
                fontWeight="bold"
                letterSpacing="1"
                fill={inkColor.hex}
              >
                {ownerName}
              </text>

              {/* Divider filigree */}
              <line x1="90" y1="255" x2="210" y2="255" stroke={inkColor.hex} strokeWidth="1" />
              <polygon points="150,252 153,255 150,258 147,255" fill={inkColor.hex} />

              {/* Bottom Inscription & Monogram */}
              <text
                x="150"
                y="310"
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                letterSpacing="3"
                fill={inkColor.hex}
                opacity="0.8"
              >
                PAGETURNER ARCHIVAL PRESS
              </text>

              <text
                x="150"
                y="330"
                textAnchor="middle"
                fontFamily="Georgia, serif"
                fontSize="10"
                fontStyle="italic"
                fill={inkColor.hex}
                opacity="0.7"
              >
                &ldquo;A room without books is like a body without a soul.&rdquo;
              </text>

              <text
                x="150"
                y="370"
                textAnchor="middle"
                fontFamily="JetBrains Mono, monospace"
                fontSize="8"
                letterSpacing="4"
                fill={inkColor.hex}
                opacity="0.5"
              >
                N° 2026 &bull; PRIVATE LIBRARY
              </text>
            </svg>
          </div>

          <p className="text-[11px] font-mono text-stone-500 mt-4 text-center">
            Standard 3&times;4 inch label size &bull; Archival 300 DPI Export
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookplateModal;
