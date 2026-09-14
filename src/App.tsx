import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameMode, Player, TrackTile, WordMission, TeacherSettings, SpeedMode } from './types';
import { VOCABULARY_LIST } from './data/vocabulary';
import { soundManager } from './utils/audio';
import { GameBoard } from './components/GameBoard';
import { MissionModal } from './components/MissionModal';
import { OrderModal } from './components/OrderModal';
import { StoryIntroModal } from './components/StoryIntroModal';
import { EventModal } from './components/EventModal';
import { VictoryModal } from './components/VictoryModal';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { Settings, Sparkles, BookOpen, Download } from 'lucide-react';
import { generateStandaloneHtml } from './utils/standaloneExporter';

const TRACK_TILES: TrackTile[] = [
  { index: 0, type: 'start', label: '출발', badge: '출발지점' },
  { index: 1, type: 'lip', label: '입술 소리(ㅁ,ㅂ)', badge: '입술소리' },
  { index: 2, type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)', badge: '혀끝소리' },
  { index: 3, type: 'event', label: '세종대왕 격려', badge: '이벤트', eventType: 'forward1', desc: '세종대왕의 격려! 앞으로 1칸 더 나아갑니다.' },
  { index: 4, type: 'throat', label: '목구멍 소리(ㅇ,ㄱ)', badge: '목구멍소리' },
  { index: 5, type: 'lip', label: '입술 소리(ㅁ,ㅂ)', badge: '입술소리' },
  { index: 6, type: 'event', label: '친구와 박수', badge: '이벤트', eventType: 'clap', desc: '친구와 함께 손뼉을 짝짝 치며 격려해요!' },
  { index: 7, type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)', badge: '혀끝소리' },
  { index: 8, type: 'throat', label: '목구멍 소리(ㅇ,ㄱ)', badge: '목구멍소리' },
  // 우측 세로
  { index: 9, type: 'lip', label: '입술 소리(ㅁ,ㅂ)', badge: '입술소리' },
  { index: 10, type: 'event', label: '바람이 쌩!', badge: '이벤트', eventType: 'back1', desc: '시원한 바람이 쌩! 뒤로 1칸 이동합니다.' },
  { index: 11, type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)', badge: '혀끝소리' },
  // 하단 가로
  { index: 12, type: 'throat', label: '목구멍 소리(ㅇ,ㄱ)', badge: '목구멍소리' },
  { index: 13, type: 'lip', label: '입술 소리(ㅁ,ㅂ)', badge: '입술소리' },
  { index: 14, type: 'event', label: '세종대왕 격려', badge: '이벤트', eventType: 'forward1', desc: '세종대왕의 격려! 앞으로 1칸 더 나아갑니다.' },
  { index: 15, type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)', badge: '혀끝소리' },
  { index: 16, type: 'throat', label: '목구멍 소리(ㅇ,ㄱ)', badge: '목구멍소리' },
  { index: 17, type: 'lip', label: '입술 소리(ㅁ,ㅂ)', badge: '입술소리' },
  { index: 18, type: 'event', label: '친구와 박수', badge: '이벤트', eventType: 'clap', desc: '친구와 함께 손뼉을 짝짝 치며 격려해요!' },
  { index: 19, type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)', badge: '혀끝소리' },
  { index: 20, type: 'throat', label: '목구멍 소리(ㅇ,ㄱ)', badge: '목구멍소리' },
  // 좌측 세로
  { index: 21, type: 'event', label: '바람이 쌩!', badge: '이벤트', eventType: 'back1', desc: '시원한 바람이 쌩! 뒤로 1칸 이동합니다.' },
  { index: 22, type: 'lip', label: '입술 소리(ㅁ,ㅂ)', badge: '입술소리' },
  { index: 23, type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)', badge: '혀끝소리' },
];

const INITIAL_PLAYERS: Player[] = [
  { id: 0, name: '선아', avatarIcon: '🐶', avatarLabel: '강아지', pos: 0, score: 0, color: 'text-red-600', tokenBg: '#e53e3e' },
  { id: 1, name: '주언', avatarIcon: '🐱', avatarLabel: '고양이', pos: 0, score: 0, color: 'text-blue-600', tokenBg: '#3182ce' },
  { id: 2, name: '초아', avatarIcon: '🐻', avatarLabel: '곰돌이', pos: 0, score: 0, color: 'text-emerald-600', tokenBg: '#38a169' },
  { id: 3, name: '여진', avatarIcon: '🐰', avatarLabel: '토끼', pos: 0, score: 0, color: 'text-amber-600', tokenBg: '#d69e2e' },
];

export default function App() {
  // 모드 상태: 'A' [가] 일반 모드, 'B' [나] 촉구 모드
  const [gameMode, setGameMode] = useState<GameMode>('A');

  // 교사용 설정 상태
  const [settings, setSettings] = useState<TeacherSettings>({
    speed: 'normal', // 'slow'(650ms), 'normal'(320ms), 'fast'(140ms)
    ttsEnabled: true,
    soundEnabled: true,
    targetScore: 6, // 6개 받침 구출로 변경
  });

  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);

  // 주사위 상태
  const [diceValue, setDiceValue] = useState<number | string>('?');
  const [isRolling, setIsRolling] = useState<boolean>(false);

  // 모달 상태: 게임 시작 시 오프닝 컷(스토리 모달) 먼저 오픈
  const [isStoryIntroOpen, setIsStoryIntroOpen] = useState<boolean>(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [currentMission, setCurrentMission] = useState<WordMission | null>(null);
  const [isMissionModalOpen, setIsMissionModalOpen] = useState<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<{ title: string; desc: string; type: string } | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);

  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMissionAwardingRef = useRef<boolean>(false);

  // 설정 변경 반영
  const handleUpdateSettings = (newSettings: Partial<TeacherSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.soundEnabled !== undefined) {
        soundManager.setSoundEnabled(newSettings.soundEnabled);
      }
      if (newSettings.ttsEnabled !== undefined) {
        soundManager.setTtsEnabled(newSettings.ttsEnabled);
      }
      return updated;
    });
  };

  // 속도 ms 계산
  const getSpeedMs = (speed: SpeedMode): number => {
    switch (speed) {
      case 'slow':
        return 650;
      case 'fast':
        return 140;
      case 'normal':
      default:
        return 320;
    }
  };

  // 오프닝 스토리 완료 후 탐험대원 및 순서 설정으로 진입
  const handleStartFromStory = () => {
    setIsStoryIntroOpen(false);
    setIsOrderModalOpen(true);
    soundManager.speak('친구들의 동물 캐릭터를 고르고 출발 순서를 정해주세요!');
  };

  // 학생별 캐릭터 아바타 변경
  const handleUpdatePlayerAvatar = (playerId: number, avatarIcon: string, avatarLabel: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.id === playerId ? { ...p, avatarIcon, avatarLabel } : p))
    );
  };

  // 순서 섞기
  const handleShuffleOrder = () => {
    soundManager.playSound('click');
    setPlayers((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  // 순서 확인 및 게임 시작
  const handleConfirmOrder = () => {
    soundManager.playSound('correct');
    setIsOrderModalOpen(false);
    const firstPlayer = players[0];
    soundManager.speak(`${firstPlayer.name} 학생의 차례입니다. 주사위를 눌러주세요.`);
  };

  // 턴 넘기기
  const passTurn = useCallback(() => {
    setActivePlayerIndex((prev) => {
      const nextIndex = (prev + 1) % players.length;
      const nextPlayer = players[nextIndex];
      soundManager.speak(`${nextPlayer.name} 차례입니다.`);
      return nextIndex;
    });
    setIsRolling(false);
  }, [players]);

  // 승리 조건 체크
  const checkVictory = useCallback(() => {
    const currentActive = players[activePlayerIndex];
    if (currentActive.score >= settings.targetScore) {
      setWinner(currentActive);
    } else {
      passTurn();
    }
  }, [players, activePlayerIndex, settings.targetScore, passTurn]);

  // 칸 도착 처리
  const handleTileArrival = useCallback((tileIndex: number) => {
    const tile = TRACK_TILES[tileIndex];

    if (tile.type === 'event') {
      setCurrentEvent({
        title: tile.label,
        desc: tile.desc || '이벤트가 발생했습니다!',
        type: tile.eventType || 'clap',
      });
      soundManager.speak(tile.desc || '이벤트가 발생했습니다.');
    } else if (tile.type === 'start') {
      passTurn();
    } else {
      // 조음 위치별 미션 열기
      const pool = VOCABULARY_LIST.filter((v) => v.category === tile.type);
      if (pool.length > 0) {
        const randomMission = pool[Math.floor(Math.random() * pool.length)];
        setCurrentMission(randomMission);
        setIsMissionModalOpen(true);
      } else {
        passTurn();
      }
    }
  }, [passTurn]);

  // 주사위 이동
  const movePlayerSteps = useCallback((steps: number) => {
    let stepCount = 0;
    const speedMs = getSpeedMs(settings.speed);

    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
    }

    moveIntervalRef.current = setInterval(() => {
      setPlayers((prev) => {
        const updated = [...prev];
        const p = { ...updated[activePlayerIndex] };
        p.pos = (p.pos + 1) % TRACK_TILES.length;
        updated[activePlayerIndex] = p;
        return updated;
      });

      soundManager.playSound('step');
      stepCount++;

      if (stepCount >= steps) {
        if (moveIntervalRef.current) {
          clearInterval(moveIntervalRef.current);
          moveIntervalRef.current = null;
        }

        setTimeout(() => {
          setPlayers((curr) => {
            const finalPos = curr[activePlayerIndex].pos;
            handleTileArrival(finalPos);
            return curr;
          });
        }, Math.max(350, speedMs * 0.8));
      }
    }, speedMs);
  }, [settings.speed, activePlayerIndex, handleTileArrival]);

  // 주사위 굴리기 핸들러 (1~6 눈금)
  const handleDiceRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    soundManager.playSound('roll');

    let rollCount = 0;
    const rollAnim = setInterval(() => {
      const rand = Math.floor(Math.random() * 6) + 1;
      setDiceValue(rand);
      rollCount++;

      if (rollCount > 10) {
        clearInterval(rollAnim);
        const finalSteps = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalSteps);
        setIsRolling(false);
        movePlayerSteps(finalSteps);
      }
    }, 60);
  };

  // 이벤트 확인 후 이동/진행
  const handleConfirmEvent = () => {
    if (!currentEvent) return;
    const evType = currentEvent.type;
    setCurrentEvent(null);

    if (evType === 'forward1') {
      setPlayers((prev) => {
        const updated = [...prev];
        const p = { ...updated[activePlayerIndex] };
        p.pos = (p.pos + 1) % TRACK_TILES.length;
        updated[activePlayerIndex] = p;
        return updated;
      });
      setTimeout(() => {
        setPlayers((curr) => {
          handleTileArrival(curr[activePlayerIndex].pos);
          return curr;
        });
      }, 400);
    } else if (evType === 'back1') {
      setPlayers((prev) => {
        const updated = [...prev];
        const p = { ...updated[activePlayerIndex] };
        p.pos = (p.pos - 1 + TRACK_TILES.length) % TRACK_TILES.length;
        updated[activePlayerIndex] = p;
        return updated;
      });
      setTimeout(() => {
        passTurn();
      }, 300);
    } else {
      passTurn();
    }
  };

  // 미션 성공 처리 (절대 중복 추가되지 않고 단 1개만 구출되도록 엄격한 불변 객체 생성 및 가드 적용)
  const handleMissionSuccess = () => {
    if (isMissionAwardingRef.current) return;
    isMissionAwardingRef.current = true;

    setPlayers((prev) =>
      prev.map((p, idx) =>
        idx === activePlayerIndex ? { ...p, score: p.score + 1 } : p
      )
    );

    setTimeout(() => {
      isMissionAwardingRef.current = false;
      checkVictory();
    }, 350);
  };

  // 게임 전체 재시작
  const handleRestartGame = () => {
    setWinner(null);
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        pos: 0,
        score: 0,
      }))
    );
    setActivePlayerIndex(0);
    setDiceValue('?');
    setIsRolling(false);
    setIsOrderModalOpen(true);
  };

  // 단독 실행용 받침게임.html 파일 다운로드
  const handleDownloadGameHtml = () => {
    const htmlContent = generateStandaloneHtml();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '받침게임.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen bg-[#f7fafc] select-none overflow-hidden font-sans">
      {/* 상단 내비게이션 바 */}
      <header className="h-14 bg-white border-b-2 border-slate-200 flex items-center justify-between px-5 shrink-0 z-20 shadow-xs">
        {/* 타이틀 */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs text-lg">
            🎮
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
              <span>받침 소리를 구하자!</span>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                특수교육 조음 보조공학
              </span>
            </h1>
          </div>
        </div>

        {/* 상단 컨트롤 그룹 (모드 선택기 + 교사용 간이 설정 버튼) */}
        <div className="flex items-center gap-3">
          {/* [가] 일반 모드 / [나] 촉구 모드 선택기 */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => setGameMode('A')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                gameMode === 'A'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              [가] 일반 모드
            </button>
            <button
              type="button"
              onClick={() => setGameMode('B')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                gameMode === 'B'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>[나] 촉구 모드</span>
            </button>
          </div>

          {/* 간이 속도 퀵 토글 (선생님이 수업 중 1터치로 즉시 전환 가능) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <button
              type="button"
              onClick={() => handleUpdateSettings({ speed: 'slow' })}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                settings.speed === 'slow'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
              title="학생 반응 시간을 배려한 느린 이동 (650ms)"
            >
              <span>🐢</span>
              <span>느림</span>
            </button>
            <button
              type="button"
              onClick={() => handleUpdateSettings({ speed: 'normal' })}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                settings.speed === 'normal'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
              title="기본 표준 이동 속도 (320ms)"
            >
              <span>🚶</span>
              <span>보통</span>
            </button>
            <button
              type="button"
              onClick={() => handleUpdateSettings({ speed: 'fast' })}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                settings.speed === 'fast'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
              title="빠른 진행 (140ms)"
            >
              <span>🐇</span>
              <span>빠름</span>
            </button>
          </div>

          {/* 스토리 다시 보기 버튼 */}
          <button
            type="button"
            onClick={() => setIsStoryIntroOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black shadow-xs transition-all cursor-pointer"
            title="마을 스토리 및 미션 오프닝 보기"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>📖 스토리</span>
          </button>

          {/* 교사용 간이 설정 상세 모달 버튼 */}
          <button
            type="button"
            onClick={() => setIsTeacherModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-black shadow-xs transition-all cursor-pointer"
            title="교사용 간이 설정"
          >
            <Settings className="w-4 h-4 text-blue-600" />
            <span>교사용 설정</span>
          </button>

          {/* 받침게임.html 다운로드 링크 */}
          <a
            href="/받침게임.html"
            download="받침게임.html"
            onClick={(e) => {
              handleDownloadGameHtml();
              e.preventDefault();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-black shadow-xs transition-all cursor-pointer no-underline"
            title="내 브라우저에서 바로 내려받는 단독 실행용 받침게임.html"
          >
            <Download className="w-3.5 h-3.5 text-white" />
            <span>받침게임.html 다운로드</span>
          </a>
        </div>
      </header>

      {/* 메인 16:9 반응형 인터랙티브 게임판 */}
      <main className="flex-1 p-2.5 flex items-center justify-center overflow-hidden">
        <GameBoard
          tiles={TRACK_TILES}
          players={players}
          activePlayerIndex={activePlayerIndex}
          diceValue={diceValue}
          isRolling={isRolling}
          onDiceRoll={handleDiceRoll}
          targetScore={settings.targetScore}
        />
      </main>

      {/* 모달들 */}
      <StoryIntroModal
        isOpen={isStoryIntroOpen}
        onStartGame={handleStartFromStory}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        players={players}
        onShuffle={handleShuffleOrder}
        onConfirm={handleConfirmOrder}
        onUpdateAvatar={handleUpdatePlayerAvatar}
      />

      <MissionModal
        isOpen={isMissionModalOpen}
        onClose={() => setIsMissionModalOpen(false)}
        mission={currentMission}
        mode={gameMode}
        onSuccess={handleMissionSuccess}
        players={players}
        activePlayerIndex={activePlayerIndex}
      />

      <EventModal
        isOpen={Boolean(currentEvent)}
        title={currentEvent?.title || ''}
        description={currentEvent?.desc || ''}
        onConfirm={handleConfirmEvent}
      />

      <VictoryModal
        isOpen={Boolean(winner)}
        winner={winner}
        targetScore={settings.targetScore}
        onRestart={handleRestartGame}
      />

      <TeacherSettingsModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        players={players}
        onUpdatePlayers={setPlayers}
        onResetGame={handleRestartGame}
      />
    </div>
  );
}
