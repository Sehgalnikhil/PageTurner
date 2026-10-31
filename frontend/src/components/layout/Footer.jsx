import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PiBooksBold, PiFileArrowDownBold, PiBookmarkSimpleBold, PiSparkleBold, PiHeartBold } from 'react-icons/pi';
import { systemService } from '../../services/api';
import { ReadingListContext } from '../../context/ReadingListContext';

const Footer = () => {
  const [healthStatus, setHealthStatus] = useState('checking...');
  const { setIsDrawerOpen } = useContext(ReadingListContext);

  useEffect(() => {
    systemService.getHealth()
      .then((res) => {
        setHealthStatus(res.data?.status === 'healthy' ? 'Catalog Engine Live' : 'Degraded');
      })
      .catch(() => setHealthStatus('Catalog Offline'));
  }, []);

  return (
    <footer className="bg-[#F0E9DE] text-[#81766D] border-t border-[#E8DED1] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Colophon */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3 group/logo cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-[#8D263B] text-[#FFFDFA] flex items-center justify-center shadow-subtle group-hover/logo:rotate-[-6deg] group-hover/logo:scale-115 transition-transform duration-300">
                <PiBooksBold className="text-lg" />
              </div>
              <span className="font-serif text-xl font-medium text-[#302A27] tracking-tight group-hover/logo:text-[#8D263B] transition-colors">
                PageTurner
              </span>
            </div>
            <p className="text-xs text-[#81766D] leading-relaxed max-w-sm mb-4">
              An art-directed digital literary boutique and discovery sanctuary. Designed for curious readers, thoughtful collectors, and seekers of timeless narratives.
            </p>
            <div className="flex items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#879783]/15 text-[#6B7A67] border border-[#879783]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#879783] animate-pulse"></span>
                {healthStatus}
              </span>
              <span className="text-[#81766D]/70 font-mono text-[11px]">&bull; MongoDB &bull; Node.js</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-serif text-sm font-medium text-[#302A27] uppercase tracking-wider mb-3.5">
              Sanctuary
            </h4>
            <ul className="space-y-2 text-xs font-normal">
              <li>
                <Link to="/" className="text-[#81766D] hover:text-[#8D263B] transition-colors">
                  Visual Discovery Masonry
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-[#81766D] hover:text-[#8D263B] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <PiBookmarkSimpleBold className="text-[#8D263B]" />
                  <span>Personal Reading Shelf</span>
                </button>
              </li>
              <li>
                <a
                  href="#curated-collections"
                  className="text-[#81766D] hover:text-[#8D263B] transition-colors"
                >
                  Curated Moodboards
                </a>
              </li>
              <li>
                <a 
                  href="http://localhost:5555/books/export/csv" 
                  download 
                  className="text-[#81766D] hover:text-[#8D263B] transition-colors flex items-center gap-1.5"
                >
                  <PiFileArrowDownBold className="text-[#81766D]" />
                  <span>Export CSV Archive</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Atmospheres */}
          <div>
            <h4 className="font-serif text-sm font-medium text-[#302A27] uppercase tracking-wider mb-3.5">
              Atmospheres
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Dark Academia',
                'Mind-Bending Fiction',
                'Comforting Stories',
                'Late-Night Reads',
                'Perspective Shifts',
                'Personal Growth'
              ].map((mood) => (
                <span 
                  key={mood} 
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#FFFDFA] text-[#4A423E] border border-[#E8DED1] cute-pill-hover cursor-pointer"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="pt-6 border-t border-[#E8DED1] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#81766D]">
          <p className="flex items-center gap-1">
            &copy; {new Date().getFullYear()} PageTurner &bull; Crafted with devotion by <strong className="text-[#302A27] font-medium ml-1">Nikhil Sehgal</strong>
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-[#81766D]/80">
            <span>Stories to cherish &bull; Ideas to keep</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
