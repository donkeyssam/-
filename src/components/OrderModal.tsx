import React, { useState } from 'react';
import { Player, AVATAR_OPTIONS, AvatarOption } from '../types';
import { Shuffle, Play, Sparkles, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface OrderModalProps {
  isOpen: boolean;
  players: Player[];
  onShuffle: () => void;
  onConfirm: () => void;
  onUpdateAvatar: (playerId: number, avatarIcon: string, avatarLabel: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  players,
  onShuffle,
  onConfirm,
  onUpdateAvatar,
}) => {
  const [selectedPlayerIdForAvatar, setSelectedPlayerIdForAvatar] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleSelectAvatar = (playerId: number, option: AvatarOption) => {
    soundManager.playSound('click');
    onUpdateAvatar(playerId, option.icon, option.label);
    const player = players.find((p) => p.id === playerId);
    if (player) {
      soundManager.speak(`${player.name} 학생은 ${option.label} 대원을 골랐어요!`);
    }
  };

  const activeEditingPlayer = players.find((p) => p.id === selectedPlayerIdForAvatar);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border-4 border-slate-200 text-center animate-in zoom-in-95 duration-200">
        
        {/* 헤더 */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-2xl">🐾</span>
          <h2 className="text-2xl font-black text-slate-800">탐험대원 &amp; 출발 순서 정하기</h2>
        </div>
        <p className="text-xs font-bold text-slate-500 mb-4">
          학생 이름 옆의 캐릭터를 눌러 좋아하는 동물이나 대원으로 바꿔보세요!
        </p>

        {/* 4명 플레이어 목록 (순서 + 캐릭터 토큰 + 변경 버튼) */}
        <div className="space-y-2.5 mb-5">
          {players.map((p, idx) => {
            const isCustomizing = selectedPlayerIdForAvatar === p.id;
            return (
              <div
                key={p.id}
                className={`rounded-2xl border-2 transition-all p-3 ${
                  isCustomizing
                    ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-300 shadow-md'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-800 text-xs font-black">
                      {idx + 1}등
                    </span>
                    <span className="text-base font-extrabold text-slate-800">{p.name} 학생</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 현재 선택된 캐릭터 버튼 */}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedPlayerIdForAvatar(isCustomizing ? null : p.id)
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 bg-white hover:bg-slate-50 shadow-xs cursor-pointer transition-all active:scale-95"
                      style={{ borderColor: p.tokenBg }}
                      title="캐릭터 변경하기"
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-base shadow-xs"
                        style={{ backgroundColor: p.tokenBg }}
                      >
                        {p.avatarIcon}
                      </span>
                      <span className="text-xs font-black text-slate-700">{p.avatarLabel}</span>
                      <span className="text-[10px] text-blue-600 font-bold ml-0.5 underline">
                        {isCustomizing ? '닫기' : '변경'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 해당 플레이어의 아바타 선택 그리드 (열렸을 때) */}
                {isCustomizing && (
                  <div className="mt-3 pt-3 border-t border-amber-200 animate-in fade-in-50 duration-150">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-amber-900 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>{p.name} 학생의 캐릭터를 골라주세요:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedPlayerIdForAvatar(null)}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        선택 완료
                      </button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {AVATAR_OPTIONS.map((opt) => {
                        const isSelected = p.avatarIcon === opt.icon;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectAvatar(p.id, opt)}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all cursor-pointer active:scale-90 ${
                              isSelected
                                ? 'bg-amber-200 border-amber-500 shadow-sm scale-105'
                                : 'bg-white border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                            }`}
                          >
                            <span className="text-2xl">{opt.icon}</span>
                            <span className="text-[10px] font-extrabold text-slate-700 mt-1 truncate max-w-full">
                              {opt.label}
                            </span>
                            {isSelected && (
                              <Check className="w-3 h-3 text-amber-800 stroke-[3] mt-0.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onShuffle}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-98"
          >
            <Shuffle className="w-4 h-4 text-slate-600" />
            <span>순서 섞기</span>
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>탐험 시작하기!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
