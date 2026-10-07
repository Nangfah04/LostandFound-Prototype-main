import React, { useState, useRef } from 'react';
import { Category, CmuLocation, LostItem } from '../types';
import { CMU_LOCATIONS } from '../data/mockData';
import { Camera, CheckCircle2, ArrowLeft, ChevronDown } from 'lucide-react';

interface ReportFoundViewProps {
  onBack: () => void;
  onSubmitFound: (item: Omit<LostItem, 'id'>) => void;
}

const CATEGORIES_LIST: Category[] = ['กระเป๋า', 'บัตร/เอกสาร', 'อิเล็กทรอนิกส์', 'เสื้อผ้า', 'อื่นๆ'];

const PRESETS = [
  { label: 'หูฟัง AirPods', title: 'หูฟังบลูทูธเคสขาว', url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80' },
  { label: 'บัตร มช.', title: 'บัตรนักศึกษา มช.', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80' },
  { label: 'กระเป๋าเงิน', title: 'กระเป๋าสตางค์หนัง', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80' }
];

const inputCls = 'w-full h-11 px-3 text-base bg-zinc-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900';

const nowLocal = () => {
  const d = new Date();
  const p = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export const ReportFoundView: React.FC<ReportFoundViewProps> = ({ onBack, onSubmitFound }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('อิเล็กทรอนิกส์');
  const [location, setLocation] = useState<CmuLocation>('หอสมุดกลาง มช.');
  const [customLocation, setCustomLocation] = useState('');
  const [specificLocation, setSpecificLocation] = useState('');
  const [foundDateTime, setFoundDateTime] = useState(nowLocal);
  const [description, setDescription] = useState('');
  const [contactType, setContactType] = useState<'phone' | 'line'>('phone');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);

    const formattedDate =
      new Date(foundDateTime).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' น.';
    const finalLocation = location === 'ระบุเอง' && customLocation ? (customLocation as CmuLocation) : location;
    const depositPoint =
      finalLocation === 'หอสมุดกลาง มช.'
        ? 'เคาน์เตอร์บริการ ชั้น 1 หอสมุดกลาง มช.'
        : finalLocation === 'โรงอาหารกลาง (ศาลาอ่าน)'
        ? 'ป้อมเจ้าหน้าที่ รปภ. ประจำโรงอาหารกลาง'
        : 'จุดรับฝากของกลาง มช.';

    const newItem: Omit<LostItem, 'id'> = {
      title: title.trim(),
      category,
      location: finalLocation,
      specificLocation: specificLocation.trim() || 'บริเวณพื้นที่ส่วนกลาง',
      foundDateTime: formattedDate,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      description: description.trim() || 'สิ่งของตกหล่นรอเจ้าของยืนยันรับคืน',
      contact: contact.trim() || 'ติดต่อเคาน์เตอร์บริการ มช.',
      contactType,
      status: 'available',
      aiSimilarityScore: Math.floor(Math.random() * 15) + 85,
      matchedFeatures: [category, finalLocation],
      depositPoint
    };

    setTimeout(() => {
      onSubmitFound(newItem);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 400);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[480px] gap-4 px-6">
        <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        <div>
          <h2 className="text-lg font-semibold">แจ้งของที่เจอแล้ว</h2>
          <p className="text-sm text-zinc-500 mt-1">
            กรุณานำ “{title}” ไปฝากที่<br />เคาน์เตอร์บริการหรือป้อม รปภ.
          </p>
        </div>
        <button type="button" onClick={onBack} className="w-full h-12 bg-zinc-900 text-white text-sm font-medium rounded-xl">
          กลับหน้าแรก
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-28">
      <div className="flex items-center gap-1 px-2 h-14 bg-white border-b border-zinc-100 sticky top-0 z-30">
        <button type="button" onClick={onBack} aria-label="ย้อนกลับ" className="w-10 h-10 flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold">แจ้งของที่เจอ</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 pt-5">
        <div className="flex flex-col gap-2">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
          <button
            id="image-upload-box"
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative w-full h-44 rounded-2xl border border-dashed border-zinc-300 bg-white flex flex-col items-center justify-center gap-2 text-sm text-zinc-500 overflow-hidden"
          >
            {imageUrl ? (
              <>
                <img src={imageUrl} alt="รูปของที่เจอ" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 right-2 px-2.5 py-1 rounded-full bg-white/90 text-xs text-zinc-800">เปลี่ยนรูป</span>
              </>
            ) : (
              <>
                <Camera className="w-6 h-6" />
                ถ่ายรูปหรือเลือกรูป
              </>
            )}
          </button>
          {!imageUrl && (
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              ตัวอย่าง
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => { setImageUrl(p.url); if (!title) setTitle(p.title); }}
                  className="h-8 px-3 rounded-full bg-zinc-100 text-zinc-700"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          ชื่อสิ่งของ
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="เช่น หูฟังเคสสีขาว" className={inputCls} />
        </label>

        <div className="flex flex-col gap-1.5 text-sm">
          หมวดหมู่
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`shrink-0 h-9 px-3.5 rounded-full whitespace-nowrap ${
                  category === cat ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-sm">
          เจอที่ไหน
          <select value={location} onChange={(e) => setLocation(e.target.value as CmuLocation)} className={inputCls}>
            {CMU_LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </label>

        {location === 'ระบุเอง' && (
          <input
            aria-label="ระบุสถานที่"
            value={customLocation}
            onChange={(e) => setCustomLocation(e.target.value)}
            placeholder="ระบุชื่อคณะหรือตึก"
            className={inputCls}
          />
        )}

        <details className="group">
          <summary className="flex items-center justify-between text-sm text-zinc-600 cursor-pointer py-1">
            รายละเอียดเพิ่มเติม (ไม่บังคับ)
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="flex flex-col gap-4 pt-3">
            <label className="flex flex-col gap-1.5 text-sm">
              ตำแหน่งที่เจอ
              <input value={specificLocation} onChange={(e) => setSpecificLocation(e.target.value)} placeholder="เช่น ชั้น 2 โต๊ะริมหน้าต่าง" className={inputCls} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              วันเวลาที่เจอ
              <input type="datetime-local" value={foundDateTime} onChange={(e) => setFoundDateTime(e.target.value)} className={inputCls} />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              ลักษณะเด่น
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="สี จุดสังเกต รอยตำหนิ"
                className="w-full p-3 text-base bg-zinc-100 rounded-lg resize-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900"
              />
            </label>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex items-center justify-between">
                ช่องทางติดต่อ
                <div className="flex gap-1 text-xs">
                  {([['phone', 'เบอร์โทร'], ['line', 'LINE']] as const).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setContactType(id)}
                      className={`h-8 px-3 rounded-full ${contactType === id ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-600'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={contactType === 'phone' ? '081-xxx-xxxx' : 'LINE ID'}
                className={inputCls}
              />
            </div>
          </div>
        </details>

        <p className="text-xs text-zinc-500">หลังแจ้ง กรุณานำของไปฝากที่เคาน์เตอร์บริการ หอสมุดกลาง หรือป้อม รปภ. ศาลาอ่าน</p>

        <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-3 bg-white border-t border-zinc-100 z-40">
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className="w-full h-12 bg-zinc-900 text-white text-sm font-medium rounded-xl disabled:opacity-40"
          >
            {isSubmitting ? 'กำลังบันทึก...' : 'แจ้งของที่เจอ'}
          </button>
        </div>
      </form>
    </div>
  );
};