import React from 'react';
import {
  PiCameraBold,
  PiMoonFill,
  PiPenNibBold,
  PiColumnsBold,
  PiSparkleBold,
  PiBookOpenBold,
  PiFlameBold,
  PiClockBold,
  PiIdentificationCardBold,
} from 'react-icons/pi';

const PersonalReadingIdentityCard = ({
  user,
  userAvatar,
  readerName,
  passportXP = 1240,
  claimedDailyXP = false,
  onClaimDailyXP,
  onOpenPassportDossier,
  onChangeAvatar,
}) => {
  const xpMax = 1500;
  const xpPercent = Math.min(100, Math.round((passportXP / xpMax) * 100));

  return (
    <div className="rounded-2xl bg-[#FFFCF6] border border-[#E9DDCC] p-5 shadow-[0_2px_12px_rgba(50,34,29,0.04)] relative overflow-hidden text-left">
      {/* Decorative Stamp Header Accent */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E9DDCC]/70">
        <div className="flex items-center gap-1.5 text-xs">
          <PiIdentificationCardBold className="text-base text-[#812638]" />
          <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#32221D]">
            Reader Identity
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#B18A51] font-semibold tracking-wider">
          PT-48127
        </span>
      </div>

      {/* Avatar & Reader Identity */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#E9DDCC] shadow-inner bg-[#2C231E] group/pfp flex-shrink-0">
          <img
            src={userAvatar}
            alt={readerName}
            className="w-full h-full object-cover group-hover/pfp:scale-105 transition-transform"
          />
          <button
            type="button"
            onClick={onChangeAvatar}
            title="Update Profile Picture"
            className="absolute inset-0 bg-black/60 opacity-0 group-hover/pfp:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] cursor-pointer"
          >
            <PiCameraBold className="text-sm text-[#F7D8A4]" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-serif font-bold text-base text-[#32221D] leading-tight truncate">
            {readerName}
          </h4>
          <span className="text-[11px] font-mono text-[#827363] block truncate">
            @{user?.username?.toLowerCase().replace(/\s+/g, '_') || 'sanctuary_reader'}
          </span>
          <button
            type="button"
            onClick={onChangeAvatar}
            className="text-[10px] font-mono text-[#812638] hover:underline mt-0.5 inline-flex items-center gap-1 cursor-pointer"
          >
            <PiCameraBold className="text-[11px]" />
            <span>Edit Avatar</span>
          </button>
        </div>
      </div>

      {/* Earned Badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F7F2E9] text-[#32221D] text-[10px] font-sans font-medium border border-[#E9DDCC]">
          <PiMoonFill className="text-[#812638] text-[10px]" />
          <span>Night Owl</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F7F2E9] text-[#32221D] text-[10px] font-sans font-medium border border-[#E9DDCC]">
          <PiPenNibBold className="text-[#812638] text-[10px]" />
          <span>Scribe</span>
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F7F2E9] text-[#32221D] text-[10px] font-sans font-medium border border-[#E9DDCC]">
          <PiColumnsBold className="text-[#B18A51] text-[10px]" />
          <span>Classics</span>
        </span>
      </div>

      {/* Literary Level & XP Station */}
      <div className="p-3 rounded-xl bg-[#F7F2E9]/70 border border-[#E9DDCC] mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-serif font-bold text-xs text-[#32221D]">
            Lv. 4 &bull; The Attentive Reader
          </span>
          <span className="font-mono text-[10.5px] font-bold text-[#812638]">
            {xpPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-[#E9DDCC] overflow-hidden my-1.5">
          <div
            className="h-full bg-gradient-to-r from-[#812638] to-[#B18A51] rounded-full transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#827363]">
          <span>{passportXP} / {xpMax} XP</span>
          <span>Next: Master Reader</span>
        </div>

        {/* Daily XP Claim Button */}
        <button
          type="button"
          onClick={onClaimDailyXP}
          disabled={claimedDailyXP}
          className={`w-full mt-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            claimedDailyXP
              ? 'bg-[#E9DDCC]/60 text-[#827363] cursor-not-allowed'
              : 'bg-[#812638] hover:bg-[#6A1F2E] text-white shadow-2xs'
          }`}
        >
          <PiSparkleBold className="text-xs text-[#F7D8A4]" />
          <span>{claimedDailyXP ? 'Daily XP Claimed ✓' : 'Claim Daily Sanctuary XP (+50 XP)'}</span>
        </button>
      </div>

      {/* Reading Goals & Stats (Fable-inspired) */}
      <div className="space-y-2.5 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#827363] flex items-center gap-1.5">
            <PiBookOpenBold className="text-xs text-[#812638]" />
            <span>2026 Reading Goal</span>
          </span>
          <span className="font-mono font-semibold text-[#32221D]">
            24 of 30 books (80%)
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[#827363] flex items-center gap-1.5">
            <PiFlameBold className="text-xs text-[#D97706]" />
            <span>Reading Streak</span>
          </span>
          <span className="font-mono font-semibold text-[#D97706]">
            14 days active
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-[#827363] flex items-center gap-1.5">
            <PiClockBold className="text-xs text-[#2D5A3C]" />
            <span>Time in Sanctuary</span>
          </span>
          <span className="font-mono font-semibold text-[#2D5A3C]">
            1,485 min
          </span>
        </div>
      </div>

      {/* Open Full Passport Dossier */}
      <button
        type="button"
        onClick={onOpenPassportDossier}
        className="w-full py-2 rounded-xl border border-[#E9DDCC] hover:border-[#812638]/50 bg-[#FFFCF6] hover:bg-[#F7F2E9] text-[#32221D] hover:text-[#812638] text-xs font-serif font-medium transition-colors cursor-pointer text-center"
      >
        View Full Reader Passport &rarr;
      </button>
    </div>
  );
};

export default PersonalReadingIdentityCard;
