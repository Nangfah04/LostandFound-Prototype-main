import React from 'react';
import { User } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onOpenProfile: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onOpenProfile, onGoHome }) => (
  <header
    id="app-header"
    className="sticky top-0 z-40 bg-white border-b border-zinc-100 px-4 h-14 flex items-center justify-between"
  >
    <button id="btn-header-home" type="button" onClick={onGoHome} className="text-left">
      <span className="text-lg font-semibold tracking-tight">FindIt</span>
      <span className="ml-2 text-xs text-zinc-500">มช.</span>
    </button>
    <button
      id="btn-header-profile"
      type="button"
      onClick={onOpenProfile}
      aria-label="โปรไฟล์"
      className={`w-10 h-10 -mr-2 rounded-full flex items-center justify-center ${
        currentTab === 'profile' ? 'text-zinc-900' : 'text-zinc-500'
      }`}
    >
      <User className="w-5 h-5" />
    </button>
  </header>
);