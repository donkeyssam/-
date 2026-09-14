import React from 'react';
import { TrackTile, Player } from '../types';

interface GameBoardProps {
  tiles: TrackTile[];
  players: Player[];
  activePlayerIndex: number;
  diceValue: number | string;
  isRolling: boolean;
  onDiceRoll: () => void;
  targetScore: number;
}

// 3x3 점(Pip) 배치 인덱스 매핑 (0~8)
const DICE_PIPS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

const DicePipView: React.FC<{ value: number | string }> = ({ value }) => {
  if (value === '?' || typeof value !== 'number') {
    return (
      <span className="text-4xl font-black text-slate-400 select-none">
        ?
      </span>
    );
  }

  const num = Math.min(6, Math.max(1, Math.floor(value)));
  const activePips = DICE_PIPS[num] || [4];
  const isOne = num === 1;

  return (
    <div className="w-full h-full p-2.5 grid grid-cols-3 grid-rows-3 items-center justify-items-center pointer-events-none">
      {Array.from({ length: 9 }).map((_, idx) => {
        const isActive = activePips.includes(idx);
        if (!isActive) {
          return <div key={idx} className="w-3.5 h-3.5 opacity-0" />;
        }
        return (
          <div
            key={idx}
            className={`rounded-full transition-all duration-100 ${
              isOne
                ? 'w-5 h-5 bg-rose-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ring-1 ring-rose-700/50'
                : 'w-3.5 h-3.5 bg-slate-800 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.4)]'
            }`}
          />
        );
      })}
    </div>
  );
};

export const GameBoard: React.FC<GameBoardProps> = ({
  tiles,
  players,
  activePlayerIndex,
  diceValue,
  isRolling,
  onDiceRoll,
  targetScore,
}) => {
  const activePlayer = players[activePlayerIndex];

  // 9x5 격자 좌표 매핑
  const getGridStyle = (index: number): React.CSSProperties => {
    let row = 1;
    let col = 1;
    if (index >= 0 && index <= 8) {
      row = 1;
      col = index + 1;
    } else if (index >= 9 && index <= 11) {
      row = index - 7;
      col = 9;
    } else if (index >= 12 && index <= 20) {
      row = 5;
      col = 9 - (index - 12);
    } else {
      row = 5 - (index - 20);
      col = 1;
    }
    return { gridRow: row, gridColumn: col };
  };

  const getTileTheme = (type: TrackTile['type']) => {
    switch (type) {
      case 'start':
        return {
          bg: 'bg-blue-50 border-blue-300 hover:bg-blue-100/70',
          badge: 'bg-blue-200 text-blue-800',
          text: 'text-blue-900',
        };
      case 'lip':
        return {
          bg: 'bg-rose-50 border-rose-300 hover:bg-rose-100/70',
          badge: 'bg-rose-200 text-rose-800',
          text: 'text-rose-900',
        };
      case 'tongue':
        return {
          bg: 'bg-amber-50 border-amber-300 hover:bg-amber-100/70',
          badge: 'bg-amber-200 text-amber-900',
          text: 'text-amber-950',
        };
      case 'throat':
        return {
          bg: 'bg-teal-50 border-teal-300 hover:bg-teal-100/70',
          badge: 'bg-teal-200 text-teal-800',
          text: 'text-teal-950',
        };
      case 'event':
        return {
          bg: 'bg-purple-50 border-purple-300 hover:bg-purple-100/70',
          badge: 'bg-purple-200 text-purple-800',
          text: 'text-purple-900',
        };
    }
  };

  return (
    <div className="w-full h-full max-w-[1360px] max-h-[760px] aspect-16/9 grid grid-cols-9 grid-rows-5 gap-1.5 p-2 bg-slate-300 border-4 border-slate-400 rounded-3xl shadow-xl relative select-none">
      {/* 24개 순환 외곽 타일들 */}
      {tiles.map((tile, i) => {
        const theme = getTileTheme(tile.type);
        const playersOnTile = players.filter((p) => p.pos === i);

        return (
          <div
            key={i}
            style={getGridStyle(i)}
            className={`relative rounded-2xl p-1.5 flex flex-col justify-between items-center text-center border-2 transition-all shadow-xs ${theme.bg}`}
          >
            {/* 칸 인덱스 */}
            <span className="absolute top-1 left-1.5 text-[10px] font-black text-slate-400">
              {i}
            </span>

            {/* 조음 위치 및 이벤트 배지 */}
            <span
              className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${theme.badge} leading-none mt-0.5`}
            >
              {tile.badge}
            </span>

            {/* 칸 명칭 라벨 */}
            <div className={`text-xs font-black leading-tight break-keep px-0.5 ${theme.text}`}>
              {tile.label}
            </div>

            {/* 말(Token) 배치 영역: 학생이 직접 고른 귀여운 동물/대원 아이콘 표시 */}
            <div className="flex items-center justify-center gap-1 min-h-[26px] w-full flex-wrap">
              {playersOnTile.map((p) => (
                <div
                  key={p.id}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-sm font-black shadow-md border-2 border-white transition-all transform hover:scale-125 select-none"
                  style={{ backgroundColor: p.tokenBg }}
                  title={`${p.name} (${p.avatarLabel})`}
                >
                  <span className="leading-none">{p.avatarIcon || p.name[0]}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* 중앙 스테이지 (rows 2~4, cols 2~8) */}
      <div className="col-start-2 col-end-9 row-start-2 row-end-5 bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 p-4 flex flex-col justify-between items-center shadow-inner relative">
        
        {/* 상단 플레이어 상태 카드 바 */}
        <div className="flex items-center justify-center gap-2.5 w-full flex-wrap">
          {players.map((p, idx) => {
            const isActive = idx === activePlayerIndex;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-50 border-blue-500 shadow-md scale-105 ring-2 ring-blue-400/30'
                    : 'bg-white border-slate-200 opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-full border-2 border-white shadow-xs shrink-0 flex items-center justify-center text-base"
                  style={{ backgroundColor: p.tokenBg }}
                  title={`${p.avatarLabel} ${p.name}`}
                >
                  {p.avatarIcon}
                </div>
                <div className="flex flex-col text-left leading-tight">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                    <span>{p.name}</span>
                    <span className="text-[10px] text-slate-500 font-bold">({p.avatarLabel})</span>
                    {isActive && <span className="text-[10px] text-blue-600 font-extrabold animate-pulse">● 차례</span>}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    구출: <strong className="text-blue-600 font-black">{p.score}</strong>/{targetScore}개
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 중앙 주사위 굴리기 영역 (점 표시 주사위) */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onDiceRoll}
            disabled={isRolling}
            className={`w-22 h-22 rounded-3xl bg-white border-4 border-slate-700 shadow-xl flex items-center justify-center p-1.5 transition-all cursor-pointer active:scale-95 hover:-translate-y-1 hover:shadow-2xl relative ${
              isRolling ? 'dice-rolling cursor-not-allowed' : ''
            }`}
            title="주사위 굴리기"
            aria-label={typeof diceValue === 'number' ? `주사위 ${diceValue}점` : '주사위'}
          >
            <DicePipView value={diceValue} />
          </button>

          <div className="text-center">
            <div className="text-base font-black text-slate-800 animate-pulse">
              {activePlayer
                ? isRolling
                  ? '주사위가 굴러갑니다...'
                  : typeof diceValue === 'number'
                  ? `${activePlayer.name} 학생: [${diceValue}점] 이동합니다!`
                  : `${activePlayer.name} 차례! 주사위를 터치하세요`
                : '주사위를 터치하세요!'}
            </div>
            <div className="text-[11px] font-bold text-slate-500 mt-0.5 flex items-center justify-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-extrabold">
                주사위 눈: 1~6점 (점)
              </span>
              <span>•</span>
              <span>받침 {targetScore}개 구출 시 승리</span>
            </div>
          </div>
        </div>

        {/* 하단 훈민정음 격려 슬로건 */}
        <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
          <span>👑 세종대왕과 함께하는 한글 바른 소리 탐험</span>
          <span>•</span>
          <span>말소리를 듣고 알맞은 받침을 구출해요!</span>
        </div>

      </div>
    </div>
  );
};
