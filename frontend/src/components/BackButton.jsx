import React from 'react';
import { Link } from 'react-router-dom';
import { PiArrowLeftBold } from 'react-icons/pi';

const BackButton = ({ destination = '/', label = 'Back to Collection' }) => {
  return (
    <Link
      to={destination}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all shadow-card hover:shadow-sm group active:scale-[0.98]"
    >
      <PiArrowLeftBold className="text-slate-500 group-hover:-translate-x-0.5 transition-transform text-xs" />
      <span>{label}</span>
    </Link>
  );
};

export default BackButton;
