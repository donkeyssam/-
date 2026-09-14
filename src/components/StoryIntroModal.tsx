import React, { useEffect } from 'react';
import { Sparkles, Volume2, ArrowRight, ShieldAlert, HeartHandshake } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface StoryIntroModalProps {
  isOpen: boolean;
  onStartGame: () => void;
}

export const StoryIntroModal: React.FC<StoryIntroModalProps> = ({ isOpen, onStartGame }) => {
  useEffect(() => {
    if (isOpen) {
      soundManager.playSound('victory');
      soundManager.speak(
        '훈민정음 마을에 받침들이 사라져버렸어요. 도움반 친구들이 바른 소리를 내어 사라진 받침들을 되찾아와야 해요!'
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSpeakStory = () => {
    soundManager.speak(
      '훈민정음 마을에 받침들이 사라져버렸어요. 도움반 친구들이 바른 소리를 내어 사라진 받침들을 되찾아와야 해요!'
    );
  };

  const handleStart = () => {
    soundManager.playSound('click');
    onStartGame();
  };

  const floatingLetters = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-amber-50 via-white to-amber-50/70 p-6 sm:p-7 shadow-2xl border-4 border-amber-300 text-center animate-in zoom-in-95 duration-300">
        
        {/* 장식용 떠다니는 흩어진 받침 글자들 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl opacity-20 select-none">
          {floatingLetters.map((letter, idx) => (
            <span
              key={idx}
              className="absolute font-black text-3xl sm:text-4xl text-amber-700 animate-pulse"
              style={{
                top: `${(idx * 14) % 85 + 5}%`,
                left: `${(idx * 26 + 10) % 90}%`,
                animationDelay: `${idx * 0.3}s`,
                transform: `rotate(${((idx * 35) % 60) - 30}deg)`,
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* 상단 엠블럼 */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-400 text-white mb-4 shadow-lg ring-4 ring-amber-200 animate-bounce">
          <span className="text-4xl">📜</span>
          <span className="absolute -top-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-black shadow-md animate-ping">
            !
          </span>
        </div>

        {/* 타이틀 배지 */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black mb-2 shadow-xs">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
          <span>훈민정음 마을의 긴급 미션</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mb-3">
          사라진 받침 소리를 구하자!
        </h2>

        {/* 오프닝 컷 핵심 스토리 박스 (사용자 요청 원문 반영) */}
        <div className="relative w-full bg-amber-100/70 border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 mb-4 text-center shadow-inner">
          <div className="text-4xl mb-2">🏘️ 💨 ✨</div>
          
          <p className="text-base sm:text-lg font-black text-slate-800 leading-relaxed break-keep">
            &ldquo;훈민정음 마을에 <span className="text-rose-600 underline decoration-wavy underline-offset-4">받침들이 사라져버렸어요.</span>
            <br />
            <span className="text-blue-700">도움반 친구들</span>이 <span className="text-emerald-700 font-black">바른 소리</span>를 내어
            사라진 받침들을 되찾아와야 해요.&rdquo;
          </p>

          <button
            type="button"
            onClick={handleSpeakStory}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
            <span>이야기 다시 듣기 🔊</span>
          </button>
        </div>

        {/* 3가지 소리 구출 가이드 미션 요약 */}
        <div className="grid grid-cols-3 gap-2 mb-5 text-center">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-2 flex flex-col items-center">
            <span className="text-xl">👄</span>
            <span className="text-xs font-black text-rose-800 mt-1">입술 소리</span>
            <span className="text-[10px] font-bold text-rose-600">ㅁ, ㅂ</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2 flex flex-col items-center">
            <span className="text-xl">👅</span>
            <span className="text-xs font-black text-amber-800 mt-1">혀끝 소리</span>
            <span className="text-[10px] font-bold text-amber-600">ㄴ, ㄷ, ㄹ</span>
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-xl p-2 flex flex-col items-center">
            <span className="text-xl">🗣️</span>
            <span className="text-xs font-black text-teal-800 mt-1">목구멍 소리</span>
            <span className="text-[10px] font-bold text-teal-600">ㅇ, ㄱ</span>
          </div>
        </div>

        {/* 하단 시작 버튼 */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-base sm:text-lg font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 active:scale-98 cursor-pointer"
        >
          <HeartHandshake className="w-5 h-5 text-amber-300" />
          <span>받침 구출 탐험대 출발! 🚀</span>
          <ArrowRight className="w-5 h-5 text-white/80" />
        </button>

        <p className="text-[11px] font-bold text-slate-400 mt-2.5">
          다음 화면에서 탐험대원(강아지, 고양이, 곰돌이 등)을 선택해요!
        </p>
      </div>
    </div>
  );
};
