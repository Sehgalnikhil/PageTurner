import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { PiBooksBold, PiFileArrowDownBold, PiBookmarkSimpleBold, PiSparkleBold } from 'react-icons/pi';
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
      .catch(() => setHealthStatus('Offline'));
  }, []);

  return (
    <footer className="bg-[#F5F0E6] text-stone-700 border-t border-[#E8E2D8] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-burgundy text-white flex items-center justify-center">
                <PiBooksBold className="text-lg" />
              </div>
              <span className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                PageTurner
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm mb-4">
              A Pinterest-inspired literary reading journal and book discovery platform. Designed for curious minds, avid readers, and collectors of timeless stories.
            </p>
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100/80 text-emerald-900 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                {healthStatus}
              </span>
              <span className="text-stone-400 font-mono text-[11px]">&bull; MongoDB &bull; Node.js</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/" className="text-stone-600 hover:text-burgundy transition-colors">
                  Discover Masonry
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-stone-600 hover:text-burgundy transition-colors flex items-center gap-1.5"
                >
                  <PiBookmarkSimpleBold className="text-burgundy" />
                  <span>My Saved Shelf</span>
                </button>
              </li>
              <li>
                <a
                  href="#curated-collections"
                  className="text-stone-600 hover:text-burgundy transition-colors"
                >
                  Curated Collections
                </a>
              </li>
              <li>
                <a 
                  href="http://localhost:5555/books/export/csv" 
                  download 
                  className="text-stone-600 hover:text-burgundy transition-colors flex items-center gap-1.5"
                >
                  <PiFileArrowDownBold className="text-stone-500" />
                  <span>Export CSV Archive</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Curations */}
          <div>
            <h4 className="font-serif text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">Atmospheres</h4>
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
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-white text-stone-700 border border-stone-200"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} PageTurner &bull; Crafted by <strong className="text-stone-800 font-semibold">Nikhil Sehgal</strong>
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-stone-400">
            <span>Stories to keep &bull; Ideas to collect</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
