import React, { useState } from 'react';
import { LostItem, ClaimRecord } from '../types';
import { X, CheckCircle2, ChevronDown } from 'lucide-react';

interface ClaimModalProps {
  item: LostItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmitClaim: (claim: ClaimRecord) => void;
}

const inputCls = 'w-full h-11 px-3 text-base bg-zinc-100 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900';

export const ClaimModal: React.FC<ClaimModalProps> = ({ item, isOpen, onClose, onSubmitClaim }) => {
  const [claimantName, setClaimantName] = useState('วริศรา แก้วมณี');
  const [studentId, setStudentId] = useState('650610888');
  const [faculty, setFaculty] = useState('คณะวิศวกรรมศาสตร์');
  const [contact, setContact] = useState('089-765-4321');
  const [proofDetails, setProofDetails] = useState('');
  const [submitted, setSubmitted] = useState<ClaimRecord | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const claim: ClaimRecord = {
      id: `claim-${Date.now()}`,
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.imageUrl,
      claimantName,
      studentId,
      faculty,
      proofDetails,
      contact,
      createdAt:
        new Date().toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' น.',
      pickupLocation: item.depositPoint,
      claimCode: `CMU-FD-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'อนุมัติแล้ว'
    };
    setSubmitted(claim);
    onSubmitClaim(claim);
  };

  return (
    <div
      id="claim-verification-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        id="claim-verification-sheet"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[430px] bg-white rounded-t-2xl px-4 pt-4 pb-6 max-h-[90vh] overflow-y-auto flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{submitted ? 'ส่งคำขอแล้ว' : 'ยืนยันว่าเป็นของคุณ'}</h2>
          <button type="button" onClick={onClose} aria-label="ปิด" className="w-10 h-10 -mr-2 flex items-center justify-center text-zinc-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            <div>
              <p className="text-sm text-zinc-500">รหัสรับของ</p>
              <p className="font-mono text-2xl font-semibold tracking-wide mt-1">{submitted.claimCode}</p>
            </div>
            <p className="text-sm text-zinc-600">
              แสดงรหัสนี้พร้อมบัตรนักศึกษาที่<br />
              <span className="font-medium text-zinc-900">{submitted.pickupLocation}</span>
            </p>
            <button type="button" onClick={onClose} className="w-full h-12 bg-zinc-900 text-white text-sm font-medium rounded-xl">
              เสร็จสิ้น
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-zinc-500 truncate">{item.depositPoint}</p>
              </div>
            </div>

            <label className="flex flex-col gap-1.5 text-sm">
              บอกจุดสังเกตที่มีแต่เจ้าของรู้
              <textarea
                rows={3}
                required
                value={proofDetails}
                onChange={(e) => setProofDetails(e.target.value)}
                placeholder="เช่น สติกเกอร์ รอยขีดข่วน ชื่อบลูทูธ หรือของที่อยู่ข้างใน"
                className="w-full p-3 text-base bg-zinc-100 rounded-lg resize-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900"
              />
            </label>

            <details className="group">
              <summary className="flex items-center justify-between text-sm text-zinc-600 cursor-pointer py-1">
                ข้อมูลผู้ขอรับ: {claimantName}
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="grid grid-cols-1 gap-3 pt-3">
                <input aria-label="ชื่อ-นามสกุล" required value={claimantName} onChange={(e) => setClaimantName(e.target.value)} className={inputCls} />
                <input aria-label="รหัสนักศึกษา" required value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputCls} />
                <input aria-label="คณะ" value={faculty} onChange={(e) => setFaculty(e.target.value)} className={inputCls} />
                <input aria-label="เบอร์โทร" required type="tel" value={contact} onChange={(e) => setContact(e.target.value)} className={inputCls} />
              </div>
            </details>

            <p className="text-xs text-zinc-500">การแอบอ้างรับของผู้อื่นมีความผิดตามวินัยนักศึกษา</p>

            <button
              type="submit"
              disabled={!proofDetails.trim()}
              className="w-full h-12 bg-zinc-900 text-white text-sm font-medium rounded-xl disabled:opacity-40"
            >
              ส่งคำขอ
            </button>
          </form>
        )}
      </div>
    </div>
  );
};