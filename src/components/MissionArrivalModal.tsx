import React from 'react';
import { Player, TrackTile } from '../types';
import { Sparkles, ArrowRight, Volume2, HelpCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface MissionArrivalModalProps {
  isOpen: boolean;
  player: Player;
  tile: TrackTile | null;
  onStartMission: () => void;
}

export const MissionArrivalModal: React.FC<MissionArrivalModalProps> = ({
  isOpen,
  player,
  tile,
  onStartMission,
}) => {
  if (!isOpen || !tile) return null;

  const getTileCategoryInfo = (type: string) => {
    switch (type) {
      case 'lip':
        return {
          icon: '👄',
          title: '입술 소리 칸',
          sub: '두 입술이 꼭 닿았다 떨어지는 소리 (ㅁ, ㅂ)',
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          buttonColor: 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30',
        };
      case 'tongue':
        return {
          icon: '👅',
          title: '혀끝 소리 칸',
          sub: '혀끝이 윗잇몸에 닿았다 떨어지는 소리 (ㄴ, ㄷ, ㄹ)',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          buttonColor: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30',
        };
      case 'throat':
      default:
        return {
          icon: '🗣️',
          title: '목구멍 소리 칸',
          sub: '목구멍과 혀 뒤쪽에서 울려 나오는 소리 (ㅇ, ㄱ)',
          bgColor: 'bg-sky-50',
          borderColor: 'border-sky-200',
          badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
          buttonColor: 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30',
        };
    }
  };

  const category = getTileCategoryInfo(tile.type);

  const handleSpeakNotice = () => {
    soundManager.speak(`${player.name} 학생, ${tile.label} 칸에 도착했어요! 문제를 확인해 볼까요?`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border-4 border-slate-200 text-center animate-in zoom-in-95 duration-200">
        
        {/* 학생 아바타 및 이름 태그 */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 mb-3 shadow-xs">
          <span className="text-xl">{player.avatarIcon}</span>
          <span className="text-sm font-black text-slate-800">{player.name} 학생 차례</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            도착!
          </span>
        </div>

        {/* 조음 위치 아이콘 */}
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${category.bgColor} border-2 ${category.borderColor} text-4xl mb-3 shadow-inner`}>
          {category.icon}
        </div>

        {/* 칸 타이틀 */}
        <h2 className="text-2xl font-black text-slate-800 mb-1">
          {category.title}
        </h2>
        <p className="text-xs font-bold text-slate-500 mb-4">
          {category.sub}
        </p>

        {/* 안내 카드 */}
        <div className={`p-4 rounded-2xl ${category.bgColor} border ${category.borderColor} text-center mb-6`}>
          <p className="text-base font-extrabold text-slate-800 leading-relaxed">
            어떤 받침 소리가 숨어 있을까요? 🤔
          </p>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            준비가 되면 아래 버튼을 눌러 문제를 확인해 보세요!
          </p>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col gap-2.5">
          {/* 주요 전환 버튼: 문제를 확인해볼까요? */}
          <button
            type="button"
            onClick={onStartMission}
            className={`w-full py-4 px-6 rounded-2xl ${category.buttonColor} text-white text-lg font-black flex items-center justify-center gap-3 shadow-lg active:scale-98 transition-all cursor-pointer`}
          >
            <span>문제를 확인해 볼까요?</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* 음성 다시 듣기 */}
          <button
            type="button"
            onClick={handleSpeakNotice}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-slate-500" />
            <span>음성 안내 다시 듣기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
