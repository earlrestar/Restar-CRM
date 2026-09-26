import React, { useState } from 'react';
import {
  Palette,
  Sliders,
  Sun,
  Moon,
  Zap,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BrandAppearanceModal } from './BrandAppearanceModal';
import { AppearanceMode } from '../../types/theme';

export const DashboardBrandBar: React.FC = () => {
  const { currentBrand, setBrandTheme, appearanceMode, setAppearanceMode, allBrands } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Current Active Brand Badge */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm shrink-0 transition-transform active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${currentBrand.gradientFrom}, ${currentBrand.gradientTo})`,
              }}
            >
              {currentBrand.monogram}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 tracking-tight">
                  {currentBrand.name} Theme Active
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: currentBrand.primaryColor }}
                />
                <span className="text-[10px] font-mono text-slate-400">
                  {currentBrand.primaryColor}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium italic">
                "{currentBrand.tagline}" • {currentBrand.defaultBranch}
              </p>
            </div>
          </div>

          {/* Controls: Mode Switcher & Customize Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Appearance Mode Quick Toggle */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => setAppearanceMode('clean_light')}
                className={`p-1.5 rounded-lg flex items-center gap-1 font-bold transition-all ${
                  appearanceMode === 'clean_light'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Clean Light Mode"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline text-[11px]">Light</span>
              </button>

              <button
                onClick={() => setAppearanceMode('executive_dark')}
                className={`p-1.5 rounded-lg flex items-center gap-1 font-bold transition-all ${
                  appearanceMode === 'executive_dark'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Executive Dark Mode"
              >
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline text-[11px]">Dark</span>
              </button>

              <button
                onClick={() => setAppearanceMode('vibrant_contrast')}
                className={`p-1.5 rounded-lg flex items-center gap-1 font-bold transition-all ${
                  appearanceMode === 'vibrant_contrast'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Vibrant Corporate Mode"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                <span className="hidden md:inline text-[11px]">Vibrant</span>
              </button>
            </div>

            {/* Customize / All Brands Modal Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Customize Colors</span>
            </button>
          </div>
        </div>

        {/* Quick Brand Switcher Horizontal Ribbon */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              Quick Brand Switch:
            </span>

            {allBrands.map((brand) => {
              const isSelected = currentBrand.id === brand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => setBrandTheme(brand.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/20'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: brand.primaryColor }}
                  />
                  <span>{brand.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appearance Modal */}
      <BrandAppearanceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
