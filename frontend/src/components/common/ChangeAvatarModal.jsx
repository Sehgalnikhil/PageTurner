import React, { useState, useContext } from 'react';
import {
  PiXBold,
  PiCameraBold,
  PiUploadSimpleBold,
  PiLinkBold,
  PiCheckBold,
  PiSparkleBold,
  PiUserBold,
} from 'react-icons/pi';
import { AuthContext } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';
import { playWaxSealCrack, playPaperUnwrap, playRevealChime } from '../../utils/soundEffects';

export const CURATED_AVATARS = [
  {
    id: 'attentive-scholar',
    name: 'The Attentive Scholar',
    role: 'Classical Reader',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'eleanor-curator',
    name: 'Eleanor Vance',
    role: 'Gothic Curator',
    url: '/images/eleanor-avatar.jpg',
  },
  {
    id: 'arthur-scribe',
    name: 'Arthur Pendelton',
    role: 'Archival Scribe',
    url: '/images/arthur-avatar.jpg',
  },
  {
    id: 'nocturnal-philosopher',
    name: 'The Nocturnal Philosopher',
    role: 'Late-Night Thinker',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'poetic-mystic',
    name: 'The Poetic Mystic',
    role: 'Romantic Lyricist',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'oxford-classicist',
    name: 'The Oxford Classicist',
    role: 'Ancient Texts Fellow',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'candlelight-reader',
    name: 'The Candlelight Reader',
    role: 'Nocturne Chronicler',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'sanctuary-keeper',
    name: 'The Sanctuary Keeper',
    role: 'Rare Tomes Guardian',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  },
];

const ChangeAvatarModal = ({ isOpen, onClose }) => {
  const { user, updateAvatar } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const currentAvatar =
    user?.avatar ||
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80';

  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [customUrl, setCustomUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  // Compress and resize uploaded image for fast upload and permanent persistence
  const compressImage = (file, maxWidth = 320, maxHeight = 320, quality = 0.88) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Handle local image file upload from reader's machine
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Please select an image file (PNG, JPG, WebP)', { variant: 'error' });
      return;
    }

    setIsUploading(true);
    playPaperUnwrap();

    try {
      const compressedDataUrl = await compressImage(file, 320, 320, 0.88);
      setSelectedAvatar(compressedDataUrl);
      setCustomUrl('');
      enqueueSnackbar('Custom portrait loaded for preview 📷', { variant: 'info' });
    } catch {
      enqueueSnackbar('Could not process image file', { variant: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  // Apply URL directly
  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    playPaperUnwrap();
    setSelectedAvatar(customUrl.trim());
    enqueueSnackbar('Web image loaded for preview 🌐', { variant: 'info' });
  };

  // Save selected avatar live
  const handleSaveAvatar = async () => {
    playWaxSealCrack();
    await updateAvatar(selectedAvatar);
    playRevealChime();
    enqueueSnackbar('Your Reader Portrait has been updated in the Salon Registry! 🕯️', {
      variant: 'success',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#FAF5EB] rounded-3xl border-2 border-[#D8C7B0] shadow-[0_25px_70px_rgba(20,15,10,0.6)] overflow-hidden text-[#2F2620] my-auto select-none flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="relative bg-gradient-to-r from-[#4A0E18] via-[#7B1826] to-[#4A0E18] px-6 py-4 text-white flex items-center justify-between border-b-2 border-[#C59B63]/40 shadow-inner flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8D263B] to-[#3B0810] border border-[#E9C38B]/80 flex items-center justify-center text-[#F7D8A4] text-sm shadow-xs">
              <PiCameraBold className="text-sm" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-tight text-[#FFFDF8] leading-none">
                Inscribe Your Reader Portrait
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#E9C38B]/80 mt-1">
                LITERARY SANCTUARY PROFILE PICTURE &bull; LIVE REGISTRY
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF5EB] hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/15 hover:rotate-90"
          >
            <PiXBold className="text-xs" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-left">
          {/* Active Portrait Live Preview Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFFDF9] border border-[#DECDB8] shadow-xs">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E2D4C0] to-[#C9B59C] p-1 border-2 border-[#C59B63] shadow-md flex-shrink-0">
              <div className="w-full h-full rounded-xl overflow-hidden bg-[#2D241E]">
                <img
                  src={selectedAvatar}
                  alt="Portrait Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#7D2235] border border-[#FAF5EB] flex items-center justify-center text-[#F7D8A4] text-[9px] shadow-2xs font-serif">
                ❦
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#7D2235] font-bold block">
                Live Preview
              </span>
              <h4 className="font-serif font-bold text-base text-[#2F2620] truncate mt-0.5">
                {user?.username || 'Curator'}
              </h4>
              <p className="text-xs text-[#7A6A5E] mt-0.5 leading-relaxed">
                This portrait will be visibly inscribed on your Reader Passport, Salon discourse notes, and Parlour gatherings in real time.
              </p>
            </div>
          </div>

          {/* Curated Dark Academia Literary Portraits */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-serif font-bold text-xs sm:text-sm text-[#2F2620] flex items-center gap-1.5">
                <PiSparkleBold className="text-sm text-[#7D2235]" />
                <span>Select from Curated Literary Portraits</span>
              </span>
              <span className="font-mono text-[10px] text-[#8C7A68]">8 Classical Profiles</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
              {CURATED_AVATARS.map((item) => {
                const isSelected = selectedAvatar === item.url;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      playPaperUnwrap();
                      setSelectedAvatar(item.url);
                    }}
                    className={`relative p-2 rounded-2xl transition-all flex flex-col items-center text-center cursor-pointer border ${
                      isSelected
                        ? 'bg-[#EFE5D5] border-[#7D2235] shadow-xs ring-2 ring-[#7D2235]/30 scale-[1.02]'
                        : 'bg-[#FFFDF9] border-[#DECDB8] hover:border-[#7D2235]/40 hover:bg-[#FAF4EA]'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-xs border border-[#C59B63]/60 bg-[#2D241E] mb-1.5">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-serif font-semibold text-[11px] text-[#2F2620] truncate w-full leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[9px] font-mono text-[#7A6A5E] truncate w-full mt-0.5">
                      {item.role}
                    </span>

                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#7D2235] text-white flex items-center justify-center text-[9px] shadow-xs">
                        <PiCheckBold />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Upload or Direct Image URL */}
          <div className="pt-2 border-t border-[#DFCBB5] space-y-3">
            <span className="font-mono text-[10px] uppercase font-bold text-[#7A6A5E] block">
              Or Inscribe Your Own Portrait:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Upload from Machine */}
              <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-[#CBB499] bg-[#FFFDF9] hover:bg-[#F3E9DA] hover:border-[#7D2235] text-[#2F2620] text-xs font-semibold cursor-pointer transition-colors text-center shadow-xs">
                <PiUploadSimpleBold className="text-base text-[#7D2235]" />
                <span>Upload from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Paste URL */}
              <form onSubmit={handleApplyUrl} className="flex items-center gap-1.5">
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl text-xs bg-[#FFFDF9] border border-[#DECDB8] focus:outline-none focus:border-[#7D2235] text-[#2F2620]"
                />
                <button
                  type="submit"
                  disabled={!customUrl.trim()}
                  className="px-3 py-2 rounded-xl bg-[#7D2235] hover:bg-[#92283F] text-white text-xs font-semibold disabled:opacity-40 cursor-pointer shadow-xs"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-3.5 bg-[#EFE8DA] border-t border-[#D8C7B0] flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#7A6A5E] hover:text-[#2F2620] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveAvatar}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7D2235] hover:bg-[#92283F] text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <PiCheckBold className="text-sm text-[#F7D8A4]" />
            <span>Save &amp; Inscribe Portrait</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeAvatarModal;

