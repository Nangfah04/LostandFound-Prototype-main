import React, { useState } from 'react';
import { LostItem, ClaimRecord } from '../types';
import { ClaimModal } from './ClaimModal';
import { ArrowLeft, Share2, ChevronDown } from 'lucide-react';

interface DetailViewProps {
  item: LostItem;
  onBack: () => void;
  onClaimItem: (claim: ClaimRecord) => void;
}

const Row: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex gap-4 py-3 text-sm">
    <dt className="w-24 shrink-0 text-zinc-500">{label}</dt>
    <dd className="flex-1 text-right">{children}</dd>
  </div>
);

export const DetailView: React.FC<DetailViewProps> = ({ item, onBack, onClaimItem }) => {
  const [isClaimOpen, setIsClaimOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `[FindIt CMU] พบสิ่งของตกหล่น: ${item.title} ณ ${item.location} (${item.foundDateTime})`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex flex-col pb-28 bg-white min-h-full">
      <div className="relative aspect-[4/3] bg-zinc-100">
        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={onBack}
          aria-label="ย้อนกลับ"
          className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={handleShare}
          aria-label="คัดลอกข้อความแชร์"
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center"
        >
          <Share2 className="w-4 h-4" />
        </button>
        {copied && (
          <div role="status" className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs px-3 py-1.5 rounded-full">
            คัดลอกแล้ว
          </div>
        )}
      </div>

      <div className="px-4 pt-5 flex flex-col gap-4">
        <div>
          <p className="text-sm text-zinc-500">{item.category}</p>
          <h1 className="text-xl font-semibold tracking-tight mt-0.5">{item.title}</h1>
        </div>

        <dl className="divide-y divide-zinc-100 border-y border-zinc-100">
          <Row label="พบที่">
            {item.location}
            {item.specificLocation && <span className="block text-xs text-zinc-500">{item.specificLocation}</span>}
          </Row>
          <Row label="เวลา">{item.foundDateTime}</Row>
          <Row label="รับของที่"><span className="font-medium">{item.depositPoint}</span></Row>
        </dl>

        <p className="text-sm leading-relaxed text-zinc-700">{item.description}</p>

        <details className="group border border-zinc-100 rounded-xl">
          <summary className="flex items-center justify-between p-3 text-sm text-zinc-600 cursor-pointer">
            ข้อมูลเพิ่มเติม
            <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="px-3 pb-3 flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">ผู้แจ้ง</span>
              <span>{item.contactType === 'phone' ? 'โทร ' : 'LINE '}{item.contact}</span>
            </div>
            {item.aiSimilarityScore && (
              <div className="flex justify-between">
                <span className="text-zinc-500">ความคล้ายจาก AI</span>
                <span>{item.aiSimilarityScore}%</span>
              </div>
            )}
            {item.matchedFeatures && item.matchedFeatures.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {item.matchedFeatures.map((f, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-zinc-100 text-zinc-600">{f}</span>
                ))}
              </div>
            )}
          </div>
        </details>

        <p className="text-xs text-zinc-500 leading-relaxed">
          ผู้รับต้องแสดงบัตรนักศึกษาหรือหลักฐานยืนยันที่จุดรับของ
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto p-3 bg-white border-t border-zinc-100 z-40">
        <button
          id="btn-claim-this-item"
          type="button"
          onClick={() => setIsClaimOpen(true)}
          className="w-full h-12 bg-zinc-900 text-white text-sm font-medium rounded-xl active:bg-zinc-700"
        >
          นี่ของฉัน
        </button>
      </div>

      <ClaimModal
        item={item}
        isOpen={isClaimOpen}
        onClose={() => setIsClaimOpen(false)}
        onSubmitClaim={onClaimItem}
      />
    </div>
  );
};