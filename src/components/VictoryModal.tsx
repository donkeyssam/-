import React, { useEffect, useRef } from 'react';
import { Player } from '../types';
import { Trophy, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  winner: Player | null;
  targetScore: number;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  winner,
  targetScore,
  onRestart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    soundManager.playSound('victory');
    if (winner) {
      soundManager.speak(`축하합니다! ${winner.name} 학생이 받침 ${targetScore}개를 모두 구출하여 승리했습니다!`);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#e53e3e', '#3182ce', '#38a169', '#ecc94b', '#9f7aea', '#ed8936'];
    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      gravity: number;
      opacity: number;
    };

    const particles: Particle[] = [];
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 9 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.22,
        opacity: 1,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.opacity -= 0.005;

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          aliveCount++;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (aliveCount > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, winner, targetScore]);

  if (!isOpen || !winner) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-60 w-full h-full"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
        <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border-4 border-amber-300 text-center animate-in zoom-in-95 duration-200">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-100 text-amber-600 mb-4 shadow-lg animate-bounce relative">
            <span className="text-5xl">{winner.avatarIcon || '🏆'}</span>
            <span className="absolute -top-3 -right-2 text-2xl">👑</span>
          </div>

          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black mb-2">
            🏆 받침 구출 챔피언
          </span>

          <h2 className="text-3xl font-black text-slate-800 mb-2">
            축하합니다!
          </h2>

          <p className="text-xl font-extrabold text-blue-600 mb-1 flex items-center justify-center gap-1.5">
            <span>{winner.name} 학생</span>
            <span className="text-sm font-bold text-slate-500">({winner.avatarLabel})</span>
          </p>

          <p className="text-sm font-bold text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-200">
            받침 {targetScore}개를 멋지게 모두 구출했습니다!
          </p>

          <button
            type="button"
            onClick={onRestart}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-base font-black flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>게임 다시 하기</span>
          </button>
        </div>
      </div>
    </>
  );
};
