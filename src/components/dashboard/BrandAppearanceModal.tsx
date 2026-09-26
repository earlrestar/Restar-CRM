import React from 'react';
import {
  X,
  Palette,
  Check,
  Sparkles,
  Sun,
  Moon,
  Zap,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppearanceMode } from '../../types/theme';

interface BrandAppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandAppearanceModal: React.FC<BrandAppearanceModalProps> = ({ isOpen, onClose }) => {
  const { currentBrand, setBrandTheme, appearanceMode, setAppearanceMode, allBrands, showToast } =
    useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-md ${currentBrand.classes.brandMonogramBg}`}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <span>Dashboard Appearance & Brand Themes</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  Philippine Insurance
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Instantly re-skin your CRM with signature color palettes and official identities of Philippine life insurers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Appearance Mode Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>1. Select Appearance Mode</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: 'clean_light' as AppearanceMode,
                  title: 'Clean Light',
                  desc: 'Crisp white cards, soft borders & subtle brand accents',
                  icon: Sun,
                  iconColor: 'text-amber-500',
                  preview: 'bg-slate-50 border-slate-200',
                },
                {
                  id: 'executive_dark' as AppearanceMode,
                  title: 'Executive Dark',
                  desc: 'Deep charcoal & obsidian backdrop with glowing brand highlights',
                  icon: Moon,
                  iconColor: 'text-indigo-400',
                  preview: 'bg-slate-900 border-slate-800 text-white',
                },
                {
                  id: 'vibrant_contrast' as AppearanceMode,
                  title: 'Vibrant Corporate',
                  desc: 'High-contrast cards featuring rich corporate gradients',
                  icon: Zap,
                  iconColor: 'text-emerald-500',
                  preview: 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300',
                },
              ].map((mode) => {
                const Icon = mode.icon;
                const isSelected = appearanceMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setAppearanceMode(mode.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-slate-900 ring-2 ring-slate-900/15 bg-white shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mb-1.5">
                      <Icon className={`w-4 h-4 ${mode.iconColor}`} />
                      <span className="text-xs font-bold text-slate-900">{mode.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{mode.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Insurance Brand Themes Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>2. Select Philippine Insurance Brand Palette</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {allBrands.length} Insurance Providers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3.5">
              {allBrands.map((brand) => {
                const isSelected = currentBrand.id === brand.id;

                return (
                  <div
                    key={brand.id}
                    onClick={() => setBrandTheme(brand.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative group ${
                      isSelected
                        ? 'bg-slate-50/80 border-slate-900 shadow-md ring-2 ring-slate-900/10'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5 flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active Brand</span>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Brand Monogram */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-base shadow-sm shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${brand.gradientFrom}, ${brand.gradientTo})`,
                        }}
                      >
                        {brand.monogram}
                      </div>

                      <div className="flex-1 pr-16">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                            {brand.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium italic mt-0.5">
                          "{brand.tagline}"
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 truncate">
                          {brand.fullName}
                        </p>
                      </div>
                    </div>

                    {/* Color Swatch & Branch info */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Colors:</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: brand.primaryColor }}
                            title={`Primary: ${brand.primaryColor}`}
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: brand.secondaryColor }}
                            title={`Secondary: ${brand.secondaryColor}`}
                          />
                          <span className="text-[10px] font-mono text-slate-500">
                            {brand.primaryColor}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-medium text-slate-400 truncate max-w-[140px]">
                        {brand.defaultBranch.split(',')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold">Active Theme:</span>
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: currentBrand.primaryColor }}
            />
            <span className="font-bold text-slate-900">{currentBrand.name}</span>
            <span className="text-slate-400">• Mode: {appearanceMode.replace('_', ' ')}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              showToast(`Applied ${currentBrand.name} dashboard appearance!`, 'success');
            }}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
