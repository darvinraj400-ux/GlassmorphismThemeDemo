import React from 'react';
import { useApp } from '../../lib/store';
import { GlassPanel } from '../ui';
import { showToast } from '../ui';
import { Palette, RotateCcw, Sliders, Eye, Sparkles } from 'lucide-react';
import { defaultAppearance } from '../../data/sampleData';

export function Settings() {
  const { state, dispatch } = useApp();
  const { appearance } = state;

  const handleReset = () => {
    dispatch({ type: 'RESET_APPEARANCE' });
    showToast('Appearance reset to defaults', 'info');
  };

  const handleResetData = () => {
    dispatch({ type: 'RESET_DATA' });
    showToast('Demo data has been reset', 'info');
  };

  const accentColors = [
    { label: 'Violet', value: '#7765F7' },
    { label: 'Cyan', value: '#65DDF2' },
    { label: 'Mint', value: '#87E8D0' },
    { label: 'Rose', value: '#f472b6' },
    { label: 'Amber', value: '#fbbf24' },
  ];

  const atmospheres = [
    { label: 'Default', value: 'default' as const },
    { label: 'Violet', value: 'violet' as const },
    { label: 'Cyan', value: 'cyan' as const },
    { label: 'Warm', value: 'warm' as const },
  ];

  return (
    <div className="animate-fade-in-up max-w-3xl">
      <h2 className="text-lg font-semibold text-white mb-5">Settings</h2>

      {/* Interactive Glass Lab */}
      <GlassPanel level={2} className="p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-[var(--electric-violet)]/10">
            <Sparkles size={20} className="text-[var(--electric-violet)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Interactive Glass Lab</h3>
            <p className="text-[11px] text-[var(--muted-blue-grey)]">Customize the appearance of glass surfaces</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Blur Intensity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-[var(--muted-blue-grey)] flex items-center gap-2">
                <Eye size={12} /> Blur Intensity
              </label>
              <span className="text-xs text-white font-mono">{appearance.blurIntensity}px</span>
            </div>
            <input
              type="range"
              min="4"
              max="32"
              value={appearance.blurIntensity}
              onChange={e => dispatch({ type: 'UPDATE_APPEARANCE', payload: { blurIntensity: Number(e.target.value) } })}
              className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--electric-violet)] [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-[var(--muted-blue-grey)]">Subtle</span>
              <span className="text-[9px] text-[var(--muted-blue-grey)]">Strong</span>
            </div>
          </div>

          {/* Surface Opacity */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-[var(--muted-blue-grey)] flex items-center gap-2">
                <Sliders size={12} /> Surface Opacity
              </label>
              <span className="text-xs text-white font-mono">{Math.round(appearance.surfaceOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="3"
              max="25"
              value={Math.round(appearance.surfaceOpacity * 100)}
              onChange={e => dispatch({ type: 'UPDATE_APPEARANCE', payload: { surfaceOpacity: Number(e.target.value) / 100 } })}
              className="w-full h-1.5 rounded-full appearance-none bg-white/10 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--electric-violet)] [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[9px] text-[var(--muted-blue-grey)]">Transparent</span>
              <span className="text-[9px] text-[var(--muted-blue-grey)]">Opaque</span>
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="text-xs font-medium text-[var(--muted-blue-grey)] flex items-center gap-2 mb-3">
              <Palette size={12} /> Accent Color
            </label>
            <div className="flex gap-3">
              {accentColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => dispatch({ type: 'UPDATE_APPEARANCE', payload: { accentColor: color.value } })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    appearance.accentColor === color.value ? 'border-white scale-110' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={`Set accent color to ${color.label}`}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Reset */}
          <div className="pt-4 border-t border-white/5">
            <button onClick={handleReset} className="btn-glass text-xs">
              <RotateCcw size={12} /> Reset Appearance
            </button>
          </div>
        </div>
      </GlassPanel>

      {/* Preview */}
      <GlassPanel level={2} className="p-6 mb-5">
        <h3 className="text-sm font-semibold text-white mb-4">Preview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="glass-ambient p-4 rounded-xl">
            <p className="text-[10px] text-[var(--muted-blue-grey)] mb-1">Level 1</p>
            <p className="text-xs text-white">Ambient Glass</p>
          </div>
          <div className="glass-primary p-4 rounded-xl">
            <p className="text-[10px] text-[var(--muted-blue-grey)] mb-1">Level 2</p>
            <p className="text-xs text-white">Primary Glass</p>
          </div>
          <div className="glass-floating p-4 rounded-xl">
            <p className="text-[10px] text-[var(--muted-blue-grey)] mb-1">Level 3</p>
            <p className="text-xs text-white">Floating Glass</p>
          </div>
        </div>
      </GlassPanel>

      {/* Data Management */}
      <GlassPanel level={2} className="p-6">
        <h3 className="text-sm font-semibold text-white mb-3">Data Management</h3>
        <p className="text-xs text-[var(--muted-blue-grey)] mb-4">
          This workspace uses local demonstration data. Reset to restore all sample projects, tasks, and activity.
        </p>
        <button onClick={handleResetData} className="btn-glass btn-danger text-xs">
          <RotateCcw size={12} /> Reset All Demo Data
        </button>
      </GlassPanel>

      {/* About */}
      <div className="mt-6 text-center">
        <p className="text-[10px] text-[var(--muted-blue-grey)]">
          GLASS UI Dashboard · Demonstration Workspace · All data is local
        </p>
        <p className="text-[10px] text-[var(--muted-blue-grey)] mt-1">
          Your work, in a clearer light.
        </p>
      </div>
    </div>
  );
}
