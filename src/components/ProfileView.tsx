import React, { useState } from 'react';
import { ClaimRecord, LostItem } from '../types';
import { ChevronDown } from 'lucide-react';

interface ProfileViewProps {
  claims: ClaimRecord[];
  myReportedItems: LostItem[];
  onSelectItem: (item: LostItem) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ claims, myReportedItems, onSelectItem }) => {
  const [tab, setTab] = useState<'claims' | 'reports'>('claims');

  return (
    <div className="flex flex-col gap-6 px-4 pt-5 pb-24">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center font-medium text-zinc-700">วร</div>
        <div>
          <h2 className="text-base font-semibold">วริศรา แก้วมณี</h2>
          <p className="text-sm text-zinc-500">650610888 · วิศวกรรมศาสตร์</p>
        </div>
      </div>

      <div className="grid grid-cols-2 p-1 bg-zinc-200/70 rounded-lg text-sm">
        {([['claims', `คำขอรับของ (${claims.length})`], ['reports', `ที่ฉันแจ้ง (${myReportedItems.length})`]] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`h-9 rounded-md ${tab === id ? 'bg-white font-medium shadow-sm' : 'text-zinc-500'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'claims' ? (
        <ul className="flex flex-col gap-3">
          {claims.length === 0 && <li className="py-12 text-center text-sm text-zinc-500">ยังไม่มีคำขอรับของ</li>}
          {claims.map((c) => (
            <li key={c.id} className="bg-white rounded-2xl border border-zinc-100 p-3 flex gap-3">
              <img src={c.itemImage} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{c.itemTitle}</p>
                <p className="text-xs text-zinc-500 mt-0.5 truncate">{c.pickupLocation}</p>
                <p className="mt-1.5 font-mono text-sm font-semibold">{c.claimCode}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="flex flex-col gap-3">
          {myReportedItems.length === 0 && <li className="py-12 text-center text-sm text-zinc-500">คุณยังไม่ได้แจ้งของที่เจอ</li>}
          {myReportedItems.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onSelectItem(item)}
                className="w-full bg-white rounded-2xl border border-zinc-100 p-3 flex gap-3 text-left active:bg-zinc-50"
              >
                <img src={item.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 truncate">{item.location}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <details className="group bg-white rounded-2xl border border-zinc-100">
        <summary className="flex items-center justify-between p-4 text-sm font-medium cursor-pointer">
          ติดต่อศูนย์ Lost & Found
          <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform" />
        </summary>
        <dl className="px-4 pb-4 flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-zinc-500">หอสมุดกลาง ชั้น 1</dt><dd className="font-mono">053-944531</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-zinc-500">โรงอาหารกลาง ศาลาอ่าน</dt><dd className="font-mono">053-943032</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-zinc-500">LINE</dt><dd className="font-mono">@cmu_lostandfound</dd></div>
        </dl>
      </details>
    </div>
  );
};