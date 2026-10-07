import React from 'react';
import { Home, PlusCircle, User } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'home' | 'report' | 'profile' | 'search';
  onSelectTab: (tab: 'home' | 'report' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as const, label: 'หน้าแรก', Icon: Home, active: currentTab === 'home' || currentTab === 'search' },
    { id: 'report' as const, label: 'แจ้งของ', Icon: PlusCircle, active: currentTab === 'report' },
    { id: 'profile' as const, label: 'โปรไฟล์', Icon: User, active: currentTab === 'profile' }
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto bg-white border-t border-zinc-100 flex"
    >
      {tabs.map(({ id, label, Icon, active }) => (
        <button
          key={id}
          id={`nav-tab-${id}`}
          type="button"
          onClick={() => onSelectTab(id)}
          aria-current={active ? 'page' : undefined}
          className={`flex-1 h-14 flex flex-col items-center justify-center gap-0.5 text-xs ${
            active ? 'text-zinc-900 font-medium' : 'text-zinc-500'
          }`}
        >
          <Icon className="w-5 h-5" strokeWidth={active ? 2.25 : 1.75} />
          {label}
        </button>
      ))}
    </nav>
  );
};