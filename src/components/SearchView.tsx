import React, { useState, useMemo, useRef } from 'react';
import { LostItem } from '../types';
import { CATEGORIES } from '../data/mockData';
import { Search, Camera, X, MapPin } from 'lucide-react';

interface SearchViewProps {
  items: LostItem[];
  onSelectItem: (item: LostItem) => void;
  onGoBack: () => void;
}

const SAMPLES = [
  { label: 'AirPods', keyword: 'หูฟัง', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80' },
  { label: 'iPad', keyword: 'ไอแพด', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80' },
  { label: 'บัตร มช.', keyword: 'บัตร', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80' }
];

export const SearchView: React.FC<SearchViewProps> = ({ items, onSelectItem }) => {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ทั้งหมด');
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const applyImage = (url: string) => {
    setAnalyzing(true);
    setImage(url);
    setTimeout(() => setAnalyzing(false), 500);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => applyImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const hasQuery = mode === 'text' ? !!query.trim() : !!image;

  const results = useMemo(() => {
    let list = items.map((item) => {
      let score = item.aiSimilarityScore || 70;
      if (mode === 'text' && query.trim()) {
        const q = query.toLowerCase().trim();
        if (item.title.toLowerCase().includes(q)) score = Math.max(score, 94);
        else if (item.description.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)) score = Math.max(score, 88);
        else if (item.location.toLowerCase().includes(q)) score = Math.max(score, 78);
        else score = Math.floor(score * 0.5);
      }
      if (mode === 'image' && image) {
        if (item.category === 'อิเล็กทรอนิกส์' || item.title.includes('AirPods') || item.title.includes('ไอแพด')) score = 96;
        else if (item.category === 'บัตร/เอกสาร') score = 84;
      }
      return { ...item, currentScore: score };
    });
    if (category !== 'ทั้งหมด') list = list.filter((i) => i.category === category);
    if (mode === 'text' && query.trim()) list = list.filter((i) => i.currentScore >= 60);
    return list.sort((a, b) => b.currentScore - a.currentScore);
  }, [items, mode, query, category, image]);

  return (
    <div className="flex flex-col pb-24">
      <div className="sticky top-0 z-30 bg-white border-b border-zinc-100 px-4 pt-3 pb-3 flex flex-col gap-3">
        <div className="grid grid-cols-2 p-1 bg-zinc-100 rounded-lg text-sm">
          {([['text', 'พิมพ์ค้นหา', Search], ['image', 'ใช้รูปภาพ', Camera]] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`h-9 rounded-md flex items-center justify-center gap-1.5 ${
                mode === id ? 'bg-white font-medium shadow-sm' : 'text-zinc-500'
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {mode === 'text' ? (
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="เช่น หูฟัง, บัตรนักศึกษา, กระเป๋า"
              className="w-full h-11 pl-9 pr-10 text-base bg-zinc-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="ล้างคำค้นหา" className="absolute right-0 top-0 w-11 h-11 flex items-center justify-center text-zinc-400">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {image ? (
              <div className="flex items-center gap-3">
                <img src={image} alt="รูปที่ใช้ค้นหา" className="w-12 h-12 rounded-lg object-cover" />
                <p className="flex-1 text-sm text-zinc-600">{analyzing ? 'กำลังวิเคราะห์...' : 'จัดอันดับตามความคล้ายแล้ว'}</p>
                <button type="button" onClick={() => setImage(null)} className="h-9 px-2 text-sm text-zinc-500">ล้าง</button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="h-11 rounded-lg border border-dashed border-zinc-300 text-sm text-zinc-600 flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4" /> เลือกรูปของที่หาย
                </button>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  ลองตัวอย่าง
                  {SAMPLES.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => { applyImage(s.url); setQuery(s.keyword); }}
                      className="h-8 px-3 rounded-full bg-zinc-100 text-zinc-700"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 h-8 px-3 rounded-full text-sm whitespace-nowrap ${
                category === cat ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        <p className="text-sm text-zinc-500">
          {results.length} รายการ{hasQuery && ' · เรียงตามความคล้าย'}
        </p>

        {results.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-500">
            ไม่พบรายการที่ตรงกัน<br />ลองใช้คำอื่นหรือเปลี่ยนหมวดหมู่
          </div>
        ) : (
          <div id="search-results-grid" className="grid grid-cols-2 gap-3">
            {results.map((item) => (
              <button
                key={item.id}
                id={`search-card-${item.id}`}
                type="button"
                onClick={() => onSelectItem(item)}
                className="text-left flex flex-col gap-2 active:opacity-70"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-100">
                  <img src={item.imageUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                  {hasQuery && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-xs font-medium">
                      {item.currentScore}%
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium truncate">{item.title}</h3>
                  <p className="flex items-center gap-1 text-xs text-zinc-500 truncate">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};