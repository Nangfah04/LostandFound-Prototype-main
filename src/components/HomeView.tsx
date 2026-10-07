import React, { useState } from 'react';
import { LostItem } from '../types';
import { Plus, Search, MapPin, ChevronRight } from 'lucide-react';

interface HomeViewProps {
  items: LostItem[];
  onSelectReport: () => void;
  onSelectSearch: () => void;
  onSelectItem: (item: LostItem) => void;
}

const FILTERS = ['ทั้งหมด', 'หอสมุดกลาง มช.', 'โรงอาหารกลาง (ศาลาอ่าน)'];

export const HomeView: React.FC<HomeViewProps> = ({ items, onSelectReport, onSelectSearch, onSelectItem }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('ทั้งหมด');

  const filteredItems = items.filter(
    (item) => selectedLocation === 'ทั้งหมด' || item.location === selectedLocation
  );

  return (
    <div className="flex flex-col gap-6 px-4 pt-5 pb-24">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">ของหายหรือเจอของ?</h1>
        <p className="text-sm text-zinc-500">ถ่ายรูปแล้วให้ AI ช่วยจับคู่ให้</p>
      </div>

      <div id="quick-action-buttons" className="flex flex-col gap-2">
        <button
          id="btn-action-report-found"
          type="button"
          onClick={onSelectReport}
          className="h-12 rounded-xl bg-zinc-900 text-white text-sm font-medium flex items-center justify-center gap-2 active:bg-zinc-700"
        >
          <Plus className="w-4 h-4" /> แจ้งของที่เจอ
        </button>
        <button
          id="btn-action-search-lost"
          type="button"
          onClick={onSelectSearch}
          className="h-12 rounded-xl bg-white border border-zinc-200 text-sm font-medium flex items-center justify-center gap-2 active:bg-zinc-50"
        >
          <Search className="w-4 h-4" /> ค้นหาของหาย
        </button>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-semibold">ล่าสุด</h2>
          <button type="button" onClick={onSelectSearch} className="text-sm text-zinc-500 py-1">
            ดูทั้งหมด
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {FILTERS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setSelectedLocation(loc)}
              className={`shrink-0 h-9 px-3.5 rounded-full text-sm whitespace-nowrap ${
                selectedLocation === loc ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        <ul id="latest-items-list" className="flex flex-col divide-y divide-zinc-100 bg-white rounded-2xl border border-zinc-100">
          {filteredItems.length === 0 && (
            <li className="p-8 text-center text-sm text-zinc-500">ยังไม่มีรายการในจุดนี้</li>
          )}
          {filteredItems.map((item) => (
            <li key={item.id}>
              <button
                id={`item-card-${item.id}`}
                type="button"
                onClick={() => onSelectItem(item)}
                className="w-full flex items-center gap-3 p-3 text-left active:bg-zinc-50"
              >
                <img
                  src={item.imageUrl}
                  alt=""
                  loading="lazy"
                  className="w-16 h-16 rounded-lg object-cover bg-zinc-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{item.title}</h3>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-zinc-400 truncate">{item.foundDateTime}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-300 shrink-0" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};