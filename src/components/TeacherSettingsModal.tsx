import React from 'react';
import { TeacherSettings, Player, SpeedMode } from '../types';
import { Settings, Volume2, VolumeX, Mic, MicOff, Download, RefreshCw, X } from 'lucide-react';
import { generateStandaloneHtml } from '../utils/standaloneExporter';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TeacherSettings;
  onUpdateSettings: (newSettings: Partial<TeacherSettings>) => void;
  players: Player[];
  onUpdatePlayers: (newPlayers: Player[]) => void;
  onResetGame: () => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  players,
  onUpdatePlayers,
  onResetGame,
}) => {
  if (!isOpen) return null;

  const handleSpeedChange = (speed: SpeedMode) => {
    onUpdateSettings({ speed });
  };

  const handleNameChange = (id: number, name: string) => {
    const updated = players.map(p => p.id === id ? { ...p, name } : p);
    onUpdatePlayers(updated);
  };

  const handleDownloadStandalone = () => {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Settings className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800">교사용 간이 설정</h2>
              <p className="text-xs font-semibold text-slate-500">학생 반응 시간 및 수업 환경 최적화</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            title="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* 주사위 말 이동 속도 설정 (핵심 요구사항) */}
          <div className="rounded-xl bg-blue-50/80 p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-extrabold text-blue-900 flex items-center gap-1.5">
                <span>⏱️ 주사위 말 이동 속도</span>
                <span className="text-xs font-semibold text-blue-600">(학생 반응 속도 고려)</span>
              </label>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-200 text-blue-800">
                {settings.speed === 'slow' && '느림 (650ms/보)'}
                {settings.speed === 'normal' && '보통 (320ms/보)'}
                {settings.speed === 'fast' && '빠름 (140ms/보)'}
              </span>
            </div>
            <p className="text-xs text-blue-700/80 mb-3">
              시각적 추적이나 지도가 더 필요한 학생에게는 [느림]을 추천합니다.
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSpeedChange('slow')}
                className={`py-2.5 px-3 rounded-xl font-bold text-sm flex flex-col items-center gap-1 transition-all ${
                  settings.speed === 'slow'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="text-lg">🐢</span>
                <span>느림</span>
                <span className="text-[10px] opacity-80">충분한 반응 시간</span>
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange('normal')}
                className={`py-2.5 px-3 rounded-xl font-bold text-sm flex flex-col items-center gap-1 transition-all ${
                  settings.speed === 'normal'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="text-lg">🚶</span>
                <span>보통</span>
                <span className="text-[10px] opacity-80">표준 권장 속도</span>
              </button>
              <button
                type="button"
                onClick={() => handleSpeedChange('fast')}
                className={`py-2.5 px-3 rounded-xl font-bold text-sm flex flex-col items-center gap-1 transition-all ${
                  settings.speed === 'fast'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-600 ring-offset-2'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="text-lg">🐇</span>
                <span>빠름</span>
                <span className="text-[10px] opacity-80">빠른 순환 진행</span>
              </button>
            </div>
          </div>

          {/* 청각 피드백 설정 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  {settings.ttsEnabled ? <Mic className="h-4 w-4 text-emerald-600" /> : <MicOff className="h-4 w-4 text-slate-400" />}
                  <span>음성 읽어주기 (TTS)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">단어 및 안내 멘트 소리 출력</p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ ttsEnabled: !settings.ttsEnabled })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.ttsEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 p-3.5 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  {settings.soundEnabled ? <Volume2 className="h-4 w-4 text-blue-600" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
                  <span>효과음 (BGM/효과)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">정답/오답/주사위 차임벨</p>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.soundEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <span className="bg-white w-4 h-4 rounded-full shadow-md" />
              </button>
            </div>
          </div>

          {/* 학생 이름 편집 & 목표 점수 */}
          <div className="rounded-xl border border-slate-200 p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-800">참여 학생 이름 (최대 4명)</span>
              <div className="flex items-center gap-1 text-xs">
                <span className="font-semibold text-slate-500">승리 목표:</span>
                <select
                  value={settings.targetScore}
                  onChange={(e) => onUpdateSettings({ targetScore: Number(e.target.value) })}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-0.5 text-xs font-bold text-slate-700"
                >
                  <option value={3}>3개 구출</option>
                  <option value={4}>4개 구출</option>
                  <option value={5}>5개 구출</option>
                  <option value={6}>6개 구출 (기본)</option>
                  <option value={8}>8개 구출</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {players.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 border border-slate-200">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-xs"
                    style={{ backgroundColor: p.tokenBg }}
                  >
                    {p.avatarIcon || idx + 1}
                  </span>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => handleNameChange(p.id, e.target.value)}
                    className="w-full bg-white px-2 py-1 text-xs font-bold rounded border border-slate-300 text-slate-800"
                    maxLength={6}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 오프라인용 단일 HTML 다운로드 (사용자 프롬프트 지원) */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                <Download className="h-4 w-4 text-amber-700" />
                <span>오프라인용 단일 HTML 다운로드</span>
              </div>
              <p className="text-[11px] text-amber-700/90 mt-0.5">
                외부 인터넷이나 서버 없이 전자칠판/태블릿에서 더블클릭만으로 실행
              </p>
            </div>
            <button
              type="button"
              onClick={handleDownloadStandalone}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-sm transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>파일 저장</span>
            </button>
          </div>
        </div>

        {/* 하단 제어 */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onResetGame}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-2 rounded-xl hover:bg-rose-50 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>게임 처음부터 다시 시작</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-xl shadow-md transition-all"
          >
            설정 적용 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
