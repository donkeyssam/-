import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  title,
  description,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border-4 border-purple-200 text-center animate-in zoom-in-95 duration-200">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 mb-3 shadow-inner">
          <Sparkles className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-purple-900 mb-2">{title}</h2>
        <p className="text-base font-extrabold text-slate-700 mb-6 leading-relaxed bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
          {description}
        </p>

        <button
          type="button"
          onClick={onConfirm}
          className="w-full py-3 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-base font-black flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 transition-all cursor-pointer"
        >
          <span>확인하고 계속하기</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
