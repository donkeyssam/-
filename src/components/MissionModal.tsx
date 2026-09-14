import React, { useState, useEffect, useRef } from 'react';
import { WordMission, GameMode, Player } from '../types';
import { SvgIllustration } from '../data/vocabulary';
import { soundManager, composeSyllable } from '../utils/audio';
import { Volume2, Lightbulb, Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: WordMission | null;
  mode: GameMode; // 'A' or 'B'
  onSuccess: () => void;
  players?: Player[];
  activePlayerIndex?: number;
}

const REPRESENTATIVE_FINALS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ'];

export const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  onClose,
  mission,
  mode,
  onSuccess,
  players = [
    { id: 0, name: '선아', avatarIcon: '🐶', avatarLabel: '강아지', pos: 0, score: 0, color: 'text-red-600', tokenBg: '#e53e3e' },
    { id: 1, name: '주언', avatarIcon: '🐱', avatarLabel: '고양이', pos: 0, score: 0, color: 'text-blue-600', tokenBg: '#3182ce' },
    { id: 2, name: '초아', avatarIcon: '🐻', avatarLabel: '곰돌이', pos: 0, score: 0, color: 'text-emerald-600', tokenBg: '#38a169' },
    { id: 3, name: '여진', avatarIcon: '🐰', avatarLabel: '토끼', pos: 0, score: 0, color: 'text-amber-600', tokenBg: '#d69e2e' },
  ],
  activePlayerIndex = 0,
}) => {
  const [stage, setStage] = useState<'solving' | 'chanting'>('solving');
  const [selectedFinal, setSelectedFinal] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [choices, setChoices] = useState<string[]>([]);
  
  // 합창 단계 상태
  const [activeChantSyllable, setActiveChantSyllable] = useState<number | 'all' | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [clapCount, setClapCount] = useState<number>(0);
  const hasTriggeredSuccess = useRef<boolean>(false);
  const chantTimerRef = useRef<NodeJS.Timeout[]>([]);

  // 힌트 가시성 상태 (사용자 요청: 바로 보이지 않고 버튼 클릭 시 확인)
  const [showHintText, setShowHintText] = useState<boolean>(false);

  // 단어 음절 분해
  const syllables = mission ? mission.word.split('') : [];

  const clearChantTimers = () => {
    chantTimerRef.current.forEach(t => clearTimeout(t));
    chantTimerRef.current = [];
  };

  useEffect(() => {
    if (isOpen && mission) {
      setStage('solving');
      setSelectedFinal(null);
      setIsSuccess(false);
      setFeedback(null);
      setShowHintText(false);
      setActiveChantSyllable(null);
      setCountdown(null);
      setClapCount(0);
      hasTriggeredSuccess.current = false;
      clearChantTimers();

      // 선택지 구성
      if (mode === 'A') {
        setChoices([...REPRESENTATIVE_FINALS]);
      } else {
        const distractors = REPRESENTATIVE_FINALS.filter((f) => f !== mission.final);
        const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
        const shuffled = [mission.final, randomDistractor].sort(() => Math.random() - 0.5);
        setChoices(shuffled);
      }

      soundManager.speak(`비어 있는 받침을 찾아 ${mission.word} 낱말을 완성해 보세요.`);
    }

    return () => {
      clearChantTimers();
    };
  }, [isOpen, mission, mode]);

  if (!isOpen || !mission) return null;

  // "다 함께 외쳐요!" 합창 시퀀스 실행 (요청사항: '다 함께 외쳐요!' 안내 후 3초 뒤에 단어 발음 시작)
  const runChantSequence = (wordList: string[], fullWord: string) => {
    clearChantTimers();
    setActiveChantSyllable(null);
    setCountdown(3);

    // 1. "다 함께 외쳐요!" 인트로 안내 발화
    soundManager.speak('다 함께 외쳐요!');

    // 3초 카운트다운 (선생님과 학생들이 손뼉 칠 준비를 할 수 있도록 충분한 여유 부여)
    const tCount2 = setTimeout(() => {
      setCountdown(2);
    }, 1000);
    chantTimerRef.current.push(tCount2);

    const tCount1 = setTimeout(() => {
      setCountdown(1);
    }, 2000);
    chantTimerRef.current.push(tCount1);

    // 3초(3000ms) 정각에 카운트다운 종료 및 음절별 손뼉 외치기 시작
    let delay = 3000;
    const interval = 1000; // 음절당 1초의 넉넉한 템포

    wordList.forEach((syl, idx) => {
      const t = setTimeout(() => {
        setCountdown(null);
        setActiveChantSyllable(idx);
        setClapCount(prev => prev + 1);
        soundManager.playSound('clap');
        soundManager.speak(`${syl}!`);
      }, delay);
      chantTimerRef.current.push(t);
      delay += interval;
    });

    // 전체 다 함께 외치기
    const finalTimer = setTimeout(() => {
      setActiveChantSyllable('all');
      setClapCount(prev => prev + 2);
      soundManager.playSound('clap');
      setTimeout(() => soundManager.playSound('clap'), 120);
      soundManager.playSound('victory');
      soundManager.speak(`다 함께! ${fullWord}! 참 잘했어요!`);
    }, delay + 250);
    chantTimerRef.current.push(finalTimer);
  };

  const handleSelectChoice = (ch: string) => {
    if (isSuccess || hasTriggeredSuccess.current) return;

    if (ch === mission.final) {
      // 정답 맞춤
      setSelectedFinal(ch);
      setIsSuccess(true);
      setFeedback({ text: '받침 구출 성공! 이제 다 함께 외쳐요!', isError: false });
      soundManager.playSound('correct');

      // 0.8초 후 "다 함께 외쳐요!" 합창 무대로 전환!
      const t = setTimeout(() => {
        setStage('chanting');
        runChantSequence(mission.word.split(''), mission.word);
      }, 900);
      chantTimerRef.current.push(t);
    } else {
      // 오답인 경우
      soundManager.playSound('wrong');
      const wrongCombination = composeSyllable(mission.targetOnset, ch);
      const feedbackMsg = `${wrongCombination}? 다시 생각해 볼까요?`;
      setFeedback({ text: feedbackMsg, isError: true });
      soundManager.speak(`${wrongCombination}? 어라! 다른 받침을 골라보세요.`);
    }
  };

  // 최종 구출 완료 (단 1회만 카운트)
  const handleCompleteMission = () => {
    if (hasTriggeredSuccess.current) return;
    hasTriggeredSuccess.current = true;
    clearChantTimers();
    onSuccess();
    onClose();
  };

  const activePlayer = players[activePlayerIndex] || players[0];

  // 조음 위치별 카테고리 정보
  const categoryInfo = {
    lip: {
      title: '입술 소리 칸 (ㅁ, ㅂ)',
      icon: '👄',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    tongue: {
      title: '혀끝 소리 칸 (ㄴ, ㄷ, ㄹ)',
      icon: '👅',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    throat: {
      title: '목구멍 소리 칸 (ㅇ, ㄱ)',
      icon: '🗣️',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200',
    },
  }[mission.category];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 select-none">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border-4 border-amber-300 flex flex-col items-center animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* ========================================================= */}
        {/* 모드 1: 받침 찾기 단계 (solving) */}
        {/* ========================================================= */}
        {stage === 'solving' && (
          <div className="w-full flex flex-col items-center">
            {/* 상단 헤더: 카테고리 정보 & 힌트 듣기/보기 버튼 그룹 */}
            <div className="w-full flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-3 gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{categoryInfo.icon}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${categoryInfo.badgeBg}`}>
                  {categoryInfo.title}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  도전자: <strong className={activePlayer.color}>{activePlayer.name}</strong>
                </span>
              </div>

              {/* 힌트 듣기 / 힌트 보기 버튼 그룹 (요청사항: 힌트가 바로 나오지 않고 버튼으로 제공) */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => soundManager.speak(`${mission.word} 힌트! ${mission.hintText}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 border border-blue-200 text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  title="조음 힌트 소리 듣기"
                >
                  <Volume2 className="h-4 w-4 text-blue-600" />
                  <span>힌트 듣기</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowHintText(prev => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95 ${
                    showHintText
                      ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                  }`}
                  title="조음 힌트 글자 보기"
                >
                  <Lightbulb className={`h-4 w-4 ${showHintText ? 'text-amber-600 fill-amber-500' : 'text-slate-500'}`} />
                  <span>{showHintText ? '힌트 숨기기' : '힌트 보기'}</span>
                </button>
              </div>
            </div>

            {/* 조음 가이드 팁: '힌트 보기' 버튼을 눌렀을 때만 열림 */}
            {showHintText && (
              <div className="w-full bg-amber-50/90 border-2 border-amber-200 rounded-xl px-4 py-2.5 text-center text-xs sm:text-sm font-extrabold text-amber-900 mb-3 flex items-center justify-center gap-2 animate-in fade-in-50 slide-in-from-top-2 duration-200 shadow-xs">
                <span className="text-base">💡</span>
                <span>{mission.hintText}</span>
              </div>
            )}

            {/* 미션 본문 (이미지 + 낱말 조합 블록) */}
            <div className="flex items-center justify-center gap-6 my-2 w-full">
              {/* 일러스트 박스 */}
              <div className="w-28 h-28 shrink-0 rounded-2xl bg-slate-100 border-2 border-slate-300 p-2 flex items-center justify-center shadow-inner">
                <SvgIllustration iconName={mission.iconName} className="w-22 h-22" />
              </div>

              {/* 낱말 합성 구역 */}
              <div className="flex items-center gap-2 text-5xl font-black text-slate-800">
                {mission.prefix && <span className="text-slate-700">{mission.prefix}</span>}

                {/* 목표 받침 블록 */}
                <div
                  className={`relative flex flex-col items-center justify-center w-24 h-28 rounded-2xl transition-all duration-300 ${
                    isSuccess
                      ? 'border-4 border-emerald-500 bg-emerald-50 shadow-lg scale-105'
                      : mode === 'B'
                      ? 'border-4 border-dashed prompt-dashed-blink'
                      : 'border-3 border-dashed border-slate-300 bg-slate-50'
                  }`}
                >
                  <span className="leading-none mt-1 text-slate-800">{mission.targetOnset}</span>
                  
                  <div
                    className={`min-h-10 text-3xl font-extrabold flex items-center justify-center transition-all ${
                      isSuccess
                        ? 'text-emerald-600 scale-110'
                        : mode === 'B'
                        ? 'text-orange-500 animate-pulse font-black'
                        : 'text-blue-500'
                    }`}
                  >
                    {selectedFinal || '?'}
                  </div>

                  {mode === 'B' && !isSuccess && (
                    <span className="absolute -bottom-2.5 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black shadow-xs flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>받침 찾기</span>
                    </span>
                  )}
                </div>

                {mission.suffix && <span className="text-slate-700">{mission.suffix}</span>}
              </div>
            </div>

            {/* 결과 피드백 메시지 */}
            <div className="h-8 my-1 flex items-center justify-center text-center">
              {feedback && (
                <div
                  className={`text-base font-extrabold flex items-center gap-1.5 animate-in fade-in duration-150 ${
                    feedback.isError ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {!feedback.isError && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                  <span>{feedback.text}</span>
                </div>
              )}
            </div>

            {/* 받침 선택 버튼들 */}
            <div className="w-full mt-2">
              <div className="text-xs font-extrabold text-slate-500 text-center mb-2.5">
                {mode === 'B'
                  ? '✨ 알맞은 받침을 터치하여 낱말을 완성해 보세요'
                  : '👇 알맞은 받침을 골라보세요'}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 min-h-16">
                {choices.map((finalChar) => {
                  const isTargetPrompt = mode === 'B' && finalChar === mission.final;
                  return (
                    <button
                      key={finalChar}
                      type="button"
                      onClick={() => handleSelectChoice(finalChar)}
                      disabled={isSuccess}
                      className={`w-14 h-14 rounded-2xl text-2xl font-black flex items-center justify-center transition-all cursor-pointer select-none active:scale-95 ${
                        isTargetPrompt
                          ? 'prompt-choice-glow text-blue-700 font-extrabold'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-800 border-2 border-slate-300 hover:border-blue-400 shadow-sm'
                      }`}
                    >
                      {finalChar}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 모드 2: 📢 "다 함께 외쳐요!" 4명 전원 손뼉 합창 무대 (chanting) */}
        {/* ========================================================= */}
        {stage === 'chanting' && (
          <div className="w-full flex flex-col items-center animate-in zoom-in-90 duration-300">
            
            {/* 화려한 상단 배너 */}
            <div className="w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white rounded-2xl p-3 shadow-md text-center flex flex-col items-center justify-center relative overflow-hidden mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl animate-bounce">📢</span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-sm">
                  다 함께 외쳐요!
                </h2>
                <span className="text-3xl animate-bounce">👏</span>
              </div>
              <p className="text-xs sm:text-sm font-black text-amber-100 mt-1 flex items-center gap-1.5">
                <span>손뼉을 짝! 짝! 치며 다 함께 큰 소리로 외쳐봐요!</span>
              </p>
            </div>

            {/* 완성된 단어 음절별 리듬 하이라이트 카드 */}
            <div className="w-full bg-amber-50/80 border-2 border-amber-200 rounded-3xl p-5 my-1 flex flex-col items-center justify-center shadow-inner">
              
              {/* 이미지 + 음절 블록들 */}
              <div className="flex items-center justify-center gap-5 sm:gap-7 flex-wrap">
                <div className="w-20 h-20 rounded-2xl bg-white border-2 border-amber-300 p-1 flex items-center justify-center shadow-sm">
                  <SvgIllustration iconName={mission.iconName} className="w-16 h-16" />
                </div>

                {/* 음절별 박자 카드 */}
                <div className="flex items-center gap-3">
                  {syllables.map((syl, idx) => {
                    const isCurrent = activeChantSyllable === idx;
                    const isAll = activeChantSyllable === 'all';

                    return (
                      <div
                        key={idx}
                        className={`relative flex flex-col items-center justify-center w-20 h-24 sm:w-24 sm:h-28 rounded-2xl transition-all duration-200 select-none ${
                          isCurrent
                            ? 'bg-amber-400 text-white shadow-xl scale-115 border-4 border-amber-500 animate-bounce'
                            : isAll
                            ? 'bg-emerald-500 text-white shadow-lg scale-105 border-4 border-emerald-300'
                            : 'bg-white text-slate-800 border-3 border-amber-200 shadow-sm'
                        }`}
                      >
                        {/* 박수 짝! 뱃지 */}
                        {isCurrent && (
                          <span className="absolute -top-3.5 px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-black shadow-md animate-pulse">
                            👏 짝!
                          </span>
                        )}

                        <span className="text-4xl sm:text-5xl font-black">
                          {syl}
                        </span>

                        <span className="text-[11px] font-extrabold mt-1 opacity-80">
                          {idx + 1}박
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 전체 합창 메시지 알림 및 3초 카운트다운 */}
              <div className="mt-3 text-center min-h-8 flex items-center justify-center">
                {countdown !== null ? (
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-200 border-2 border-amber-400 text-amber-950 font-black text-sm shadow-sm animate-pulse">
                    <span className="text-base">👏</span>
                    <span>손뼉 칠 준비!</span>
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white font-black text-base shadow-xs">
                      {countdown}
                    </span>
                    <span>초 뒤에 시작해요!</span>
                  </div>
                ) : activeChantSyllable === 'all' ? (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-sm animate-pulse">
                    <span>🎉</span>
                    <span>다 함께 큰 소리로: &ldquo;{mission.word}!&rdquo;</span>
                    <span>🎉</span>
                  </div>
                ) : (
                  <div className="text-xs font-extrabold text-amber-800">
                    박자에 맞춰 글자를 힘차게 읽어요!
                  </div>
                )}
              </div>
            </div>

            {/* 4명의 학생 합창단 (손뼉 치며 큰 소리로 외치는 학생들) */}
            <div className="w-full mt-2 bg-slate-50 border-2 border-slate-200 rounded-2xl p-3">
              <div className="text-xs font-black text-slate-500 text-center mb-2 flex items-center justify-center gap-1.5">
                <span>👥</span>
                <span>우리 반 친구들 모두 다 함께 손뼉을 쳐요!</span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {players.map((p, idx) => {
                  const isTurnPlayer = idx === activePlayerIndex;
                  return (
                    <div
                      key={p.id}
                      className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all duration-150 ${
                        isTurnPlayer
                          ? 'bg-amber-100 border-amber-400 shadow-sm'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      {/* 손뼉 애니메이션 아이콘 & 학생 캐릭터 아바타 */}
                      <div className="relative flex items-center justify-center">
                        <span className="text-2xl animate-bounce">
                          {p.avatarIcon || '👏'}
                        </span>
                        <span className="absolute -bottom-1 -right-1 text-sm select-none">
                          👏
                        </span>
                        {/* 퐁퐁 솟아나는 음표/별 */}
                        <span className="absolute -top-2 -right-2 text-xs animate-ping">
                          {idx % 2 === 0 ? '🎵' : '⭐'}
                        </span>
                      </div>

                      {/* 학생 이름 & 배지 */}
                      <span className={`text-xs font-black mt-1 ${p.color}`}>
                        {p.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {isTurnPlayer ? '🌟 정답!' : '합창 중!'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 하단 제어 버튼: 다시 외치기 & 받침 1개 구출 완료 */}
            <div className="w-full flex items-center justify-between gap-3 mt-4 pt-2 border-t-2 border-slate-100">
              <button
                type="button"
                onClick={() => runChantSequence(syllables, mission.word)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs sm:text-sm border border-slate-300 shadow-xs cursor-pointer transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span>다시 외치기 🔊</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteMission}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm sm:text-base shadow-lg cursor-pointer transition-all active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>받침 1개 구출 완료!</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
