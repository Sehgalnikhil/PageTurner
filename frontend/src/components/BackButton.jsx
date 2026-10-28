import React from 'react';
import { Link } from 'react-router-dom';
import { PiArrowLeftBold } from 'react-icons/pi';

const BackButton = ({ destination = '/', label = 'Back to Discovery' }) => {
  return (
    <Link
      to={destination}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full btn-paper text-xs shadow-2xs group"
    >
      <PiArrowLeftBold className="text-stone-400 group-hover:-translate-x-0.5 group-hover:text-burgundy transition-transform text-xs" />
      <span>{label}</span>
    </Link>
  );
};

export default BackButton;
