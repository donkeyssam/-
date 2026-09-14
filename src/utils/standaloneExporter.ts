// Standalone Single HTML generator for Classroom Tablets & Smartboards (Offline ready)
import { RAW_SVG_MAP } from '../data/vocabulary';

export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>받침 소리를 구하자!</title>
<style>
  :root {
    --primary-color: #2b6cb0;
    --accent-color: #e53e3e;
    --bg-color: #f7fafc;
    --board-bg: #edf2f7;
    --tile-bg: #ffffff;
    --p1-color: #e53e3e;
    --p2-color: #3182ce;
    --p3-color: #38a169;
    --p4-color: #d69e2e;
  }

  * {
    box-sizing: border-box;
    user-select: none;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
    background-color: var(--bg-color);
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* 상단 내비게이션 바 */
  header {
    height: 58px;
    background: #ffffff;
    border-bottom: 2px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 20;
  }

  .title-group h1 {
    font-size: 1.25rem;
    color: #2d3748;
    font-weight: 900;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .controls-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .mode-selector {
    display: flex;
    align-items: center;
    background: #edf2f7;
    border-radius: 20px;
    padding: 3px;
  }

  .mode-btn {
    border: none;
    background: transparent;
    padding: 6px 14px;
    font-size: 0.85rem;
    font-weight: 800;
    color: #4a5568;
    cursor: pointer;
    border-radius: 16px;
    transition: all 0.2s;
  }

  .mode-btn.active {
    background: #3182ce;
    color: #ffffff;
    box-shadow: 0 2px 6px rgba(49,130,206,0.3);
  }

  /* 교사용 설정 버튼 및 컨트롤 */
  .teacher-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #ebf8ff;
    border: 1.5px solid #bee3f8;
    color: #2b6cb0;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.2s;
  }
  .teacher-btn:hover {
    background: #bee3f8;
  }

  /* 메인 컨테이너 */
  main {
    flex: 1;
    position: relative;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* 9x5 직사각형 게임판 */
  .board-container {
    width: 100%;
    max-width: 1360px;
    height: 100%;
    max-height: 760px;
    aspect-ratio: 16 / 9;
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 6px;
    background-color: #cbd5e0;
    border-radius: 20px;
    border: 4px solid #a0aec0;
    position: relative;
    padding: 6px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  }

  /* 칸 스타일 */
  .tile {
    background: var(--tile-bg);
    border-radius: 12px;
    padding: 6px 4px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    position: relative;
    border: 2px solid transparent;
    box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  }

  .tile-index {
    position: absolute;
    top: 3px;
    left: 6px;
    font-size: 0.7rem;
    font-weight: 800;
    color: #a0aec0;
  }

  .tile-type-badge {
    font-size: 0.65rem;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 6px;
    margin-top: 1px;
  }

  .tile-label {
    font-size: 0.8rem;
    font-weight: 800;
    word-break: keep-all;
    line-height: 1.2;
    color: #2d3748;
  }

  /* 칸 종류별 테마 */
  .tile.start { background: #ebf8ff; border-color: #63b3ed; }
  .tile.lip { background: #fff5f5; border-color: #feb2b2; }
  .tile.lip .tile-type-badge { background: #fed7d7; color: #c53030; }
  .tile.tongue { background: #feebc8; border-color: #fbd38d; }
  .tile.tongue .tile-type-badge { background: #fbd38d; color: #c05621; }
  .tile.throat { background: #e6fffa; border-color: #81e6d9; }
  .tile.throat .tile-type-badge { background: #b2f5ea; color: #234e52; }
  .tile.event { background: #faf5ff; border-color: #d6bcfa; }
  .tile.event .tile-type-badge { background: #e9d8fd; color: #6b46c1; }

  /* 말 배치 영역 */
  .tile-players {
    display: flex;
    gap: 3px;
    align-items: center;
    justify-content: center;
    min-height: 22px;
    flex-wrap: wrap;
  }

  .token {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    color: #ffffff;
    font-size: 0.7rem;
    font-weight: 900;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    border: 2px solid #ffffff;
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .token.p0 { background: var(--p1-color); }
  .token.p1 { background: var(--p2-color); }
  .token.p2 { background: var(--p3-color); }
  .token.p3 { background: var(--p4-color); }

  /* 중앙 스테이지 */
  .center-stage {
    grid-column: 2 / 9;
    grid-row: 2 / 5;
    background: #f8fafc;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    position: relative;
    border: 2px dashed #cbd5e0;
  }

  /* 플레이어 상태 바 */
  .player-status-bar {
    display: flex;
    gap: 12px;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .player-card {
    background: #ffffff;
    border: 3px solid #e2e8f0;
    border-radius: 16px;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
  }

  .player-card.active {
    border-color: #3182ce;
    transform: scale(1.08);
    box-shadow: 0 0 0 4px rgba(49, 130, 206, 0.35), 0 8px 20px rgba(49, 130, 206, 0.25);
    background: #ebf8ff;
    z-index: 5;
  }

  .turn-indicator-badge {
    position: absolute;
    top: -14px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #3182ce, #2b6cb0);
    color: #ffffff;
    font-size: 0.72rem;
    font-weight: 900;
    padding: 2px 10px;
    border-radius: 999px;
    white-space: nowrap;
    box-shadow: 0 2px 6px rgba(0,0,0,0.25);
    animation: bounceBadge 1.2s infinite ease-in-out;
  }

  @keyframes bounceBadge {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-4px); }
  }

  .player-info {
    display: flex;
    flex-direction: column;
  }

  .player-name {
    font-size: 0.95rem;
    font-weight: 800;
    color: #2d3748;
  }

  .player-score {
    font-size: 0.75rem;
    color: #718096;
    font-weight: 800;
  }

  /* 주사위 인터랙션 구역 */
  .dice-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .dice {
    width: 96px;
    height: 96px;
    min-width: 96px;
    min-height: 96px;
    background: #ffffff;
    border: 4px solid #2d3748;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 16px rgba(0,0,0,0.12);
    transition: transform 0.15s, box-shadow 0.15s;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
    touch-action: manipulation;
  }

  /* 주사위 굴릴 차례일 때 학생의 시선을 유도하는 부드러운 펄스 링 */
  .dice:not(.disabled) {
    animation: diceTurnPrompt 2s infinite ease-in-out;
  }

  @keyframes diceTurnPrompt {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(49, 130, 206, 0.5), 0 8px 16px rgba(0,0,0,0.12);
    }
    50% {
      box-shadow: 0 0 0 10px rgba(49, 130, 206, 0), 0 12px 24px rgba(49, 130, 206, 0.35);
    }
  }

  .dice.disabled {
    pointer-events: none;
    opacity: 0.55;
    cursor: not-allowed;
    transform: scale(0.96);
    animation: none;
  }

  .dice-pips-grid {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    align-items: center;
    justify-items: center;
  }

  .pip-dot {
    width: 13px;
    height: 13px;
    background: #2d3748;
    border-radius: 50%;
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.4);
  }

  .pip-dot.pip-red {
    width: 18px;
    height: 18px;
    background: #e53e3e;
    box-shadow: inset 0 2px 3px rgba(0,0,0,0.3);
  }

  .pip-dot.empty {
    visibility: hidden;
  }

  .dice:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.15);
  }

  .dice:active {
    transform: translateY(2px);
  }

  .dice.rolling {
    animation: diceRoll 0.5s infinite linear;
  }

  @keyframes diceRoll {
    0% { transform: rotate(0deg) scale(0.92); }
    50% { transform: rotate(180deg) scale(1.08); }
    100% { transform: rotate(360deg) scale(0.92); }
  }

  .action-guide-text {
    font-size: 1.15rem;
    font-weight: 800;
    color: #2d3748;
  }

  /* 모달 레이어 공통 */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.65);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .modal-card {
    background: #ffffff;
    border-radius: 24px;
    padding: 20px 24px;
    width: 90%;
    max-width: 600px;
    max-height: 92vh;
    overflow-y: auto;
    box-shadow: 0 20px 40px rgba(0,0,0,0.25);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    box-sizing: border-box;
  }

  @keyframes popIn {
    from { transform: scale(0.85); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  /* 순서 정하기 화면 */
  .order-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    margin: 18px 0;
  }

  .order-item {
    background: #edf2f7;
    padding: 10px 18px;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 800;
    font-size: 0.95rem;
  }

  /* 미션 팝업 스타일 */
  .mission-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #edf2f7;
    padding-bottom: 12px;
    margin-bottom: 12px;
  }

  .mission-category {
    font-size: 1rem;
    font-weight: 900;
    color: #3182ce;
  }

  .hint-btn-group {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-hint-tool {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 800;
    border: 1px solid #cbd5e0;
    background: #f7fafc;
    color: #4a5568;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-hint-tool:hover {
    background: #edf2f7;
  }

  .btn-hint-tool.active {
    background: #fefcbf;
    border-color: #ecc94b;
    color: #744210;
  }

  .articulation-hint-card {
    width: 100%;
    background: #fffaf0;
    border: 2px solid #feebc8;
    border-radius: 12px;
    padding: 8px 14px;
    font-size: 0.85rem;
    font-weight: 800;
    color: #9c4221;
    text-align: center;
    margin-bottom: 8px;
    display: none;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .mission-body {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin: 10px 0;
    width: 100%;
  }

  .mission-image-box {
    width: 100px;
    height: 100px;
    background: #edf2f7;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #cbd5e0;
    padding: 6px;
  }

  .mission-image-box svg {
    width: 76px;
    height: 76px;
  }

  .mission-word-box {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 3.2rem;
    font-weight: 900;
    color: #2d3748;
  }

  /* 목표 받침 블록 기본 */
  .target-block {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 86px;
    height: 100px;
    border: 3px dashed #cbd5e0;
    border-radius: 16px;
    background: #f8fafc;
    position: relative;
    transition: all 0.3s;
  }

  .target-block .onset-vowel {
    line-height: 1;
    margin-top: 4px;
  }

  .target-block .final-slot {
    font-size: 2rem;
    color: #3182ce;
    min-height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
  }

  .target-block.merged {
    border: 4px solid #3182ce !important;
    background: #ebf8ff !important;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(49, 130, 206, 0.25);
  }

  /* ✨ [나] 촉구 모드: 눈부심(Flicker) 없는 온화한 골드 앰버 브리딩 펄스 */
  .target-block.prompt-dashed-blink {
    animation: softAmberBreathe 1.8s ease-in-out infinite alternate;
  }

  @keyframes softAmberBreathe {
    0% {
      border-color: #d69e2e;
      background-color: #fffaf0;
      box-shadow: 0 0 0 3px rgba(214, 158, 46, 0.25);
      transform: scale(1);
    }
    100% {
      border-color: #ed8936;
      background-color: #feebc8;
      box-shadow: 0 0 0 6px rgba(237, 137, 54, 0.4), 0 4px 12px rgba(237, 137, 54, 0.25);
      transform: scale(1.04);
    }
  }

  /* 받침 선택지 영역 (최소 48px 초과하는 68px 타깃 크기 및 14px 간격으로 오터치 방지) */
  .options-container {
    display: flex;
    gap: 14px;
    margin-top: 14px;
    flex-wrap: wrap;
    justify-content: center;
    min-height: 72px;
  }

  .choice-btn {
    width: 68px;
    height: 68px;
    min-width: 68px;
    min-height: 68px;
    border-radius: 18px;
    background: #f8fafc;
    border: 3px solid #cbd5e0;
    font-size: 2.1rem;
    font-weight: 900;
    color: #2d3748;
    cursor: pointer;
    transition: transform 0.15s, background-color 0.15s, border-color 0.15s, box-shadow 0.15s;
    box-shadow: 0 4px 8px rgba(0,0,0,0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    touch-action: manipulation;
  }

  .choice-btn:hover {
    transform: translateY(-2px);
    border-color: #3182ce;
  }

  .choice-btn:active {
    transform: scale(0.92);
    background-color: #e2e8f0;
  }

  /* 촉구 모드 정답 선택지: 자극적이지 않고 명확한 안내 골드 글로우 */
  .choice-btn.prompt-glow {
    animation: gentleChoiceGlow 1.6s alternate infinite ease-in-out;
    border-color: #d69e2e !important;
    background-color: #fffaf0 !important;
    color: #b7791f !important;
    position: relative;
  }

  @keyframes gentleChoiceGlow {
    0% {
      box-shadow: 0 0 0 2px rgba(214, 158, 46, 0.3), 0 4px 6px rgba(0,0,0,0.05);
      transform: scale(1);
    }
    100% {
      box-shadow: 0 0 0 6px rgba(214, 158, 46, 0.5), 0 6px 14px rgba(214, 158, 46, 0.3);
      transform: scale(1.06);
    }
  }

  /* 오답 시 부드러운 흔들림 (시각적 오류 안내) */
  .wobble-soft {
    animation: wobbleSoft 0.45s ease-in-out;
  }
  @keyframes wobbleSoft {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }

  .feedback-text {
    height: 32px;
    font-size: 1.15rem;
    font-weight: 800;
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-action {
    background: #3182ce;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 800;
    padding: 12px 32px;
    border-radius: 14px;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.2s;
  }

  .btn-action:hover {
    background: #2b6cb0;
  }

  /* 다 함께 외쳐요! 합창 무대 스타일 */
  .chant-banner {
    width: 100%;
    background: linear-gradient(135deg, #f6ad55, #ed8936, #f56565);
    color: #ffffff;
    border-radius: 16px;
    padding: 10px 14px;
    text-align: center;
    margin-bottom: 12px;
    box-shadow: 0 4px 10px rgba(237,137,54,0.3);
  }
  .chant-banner h2 {
    font-size: 1.6rem;
    font-weight: 900;
    margin: 0;
  }
  .chant-syllables-box {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin: 12px 0;
  }
  .chant-syllable-card {
    position: relative;
    width: 80px;
    height: 95px;
    background: #ffffff;
    border: 3px solid #fbd38d;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 2.4rem;
    font-weight: 900;
    color: #2d3748;
    box-shadow: 0 3px 6px rgba(0,0,0,0.08);
    transition: all 0.2s;
  }
  .chant-syllable-card.active {
    background: #ecc94b;
    color: #ffffff;
    border-color: #d69e2e;
    transform: scale(1.15) translateY(-4px);
    box-shadow: 0 8px 18px rgba(214,158,46,0.5);
  }
  .chant-syllable-card.all-active {
    background: #38a169;
    color: #ffffff;
    border-color: #2f855a;
    transform: scale(1.05);
  }
  .chant-clap-badge {
    position: absolute;
    top: -12px;
    background: #e53e3e;
    color: #ffffff;
    font-size: 0.75rem;
    font-weight: 900;
    padding: 2px 8px;
    border-radius: 999px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }
  .chant-players-box {
    width: 100%;
    background: #f7fafc;
    border: 2px solid #e2e8f0;
    border-radius: 16px;
    padding: 10px;
    margin: 8px 0;
  }
  .chant-player-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #ffffff;
    border: 2px solid #edf2f7;
    border-radius: 12px;
    padding: 6px;
  }
  .chant-player-item.turn-player {
    background: #fefcbf;
    border-color: #ecc94b;
  }
  .clapping-hands {
    font-size: 1.5rem;
    animation: clapBounce 0.4s infinite alternate ease-in-out;
  }
  @keyframes clapBounce {
    0% { transform: scale(1) translateY(0); }
    100% { transform: scale(1.25) translateY(-4px); }
  }

  /* 교사용 설정 모달 */
  .setting-row {
    width: 100%;
    margin-bottom: 16px;
    text-align: left;
  }

  .setting-row label {
    font-size: 0.9rem;
    font-weight: 800;
    color: #2d3748;
    display: block;
    margin-bottom: 8px;
  }

  .speed-selector-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .speed-opt-btn {
    border: 2px solid #e2e8f0;
    background: #f7fafc;
    padding: 10px 8px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 800;
    color: #4a5568;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    transition: all 0.2s;
  }

  .speed-opt-btn.active {
    border-color: #3182ce;
    background: #ebf8ff;
    color: #2b6cb0;
    box-shadow: 0 2px 6px rgba(49,130,206,0.2);
  }

  .event-desc {
    font-size: 1.3rem;
    font-weight: 800;
    color: #2d3748;
    margin: 20px 0;
  }

  #confetti-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 1000;
  }
</style>
</head>
<body>

<header>
  <div class="title-group">
    <h1><span>🎮</span> 받침 소리를 구하자!</h1>
  </div>
  <div class="controls-group">
    <div class="mode-selector">
      <button class="mode-btn active" id="btn-mode-a" onclick="setMode('A')">[가] 일반 모드</button>
      <button class="mode-btn" id="btn-mode-b" onclick="setMode('B')">[나] 촉구 모드</button>
    </div>
    <!-- 오프닝 스토리 버튼 -->
    <button class="teacher-btn" onclick="openStoryModal()" style="background:#fffaf0; border-color:#f6ad55; color:#744210;">
      <span>📖 스토리</span>
    </button>
    <!-- 선생님 간이 설정 버튼 -->
    <button class="teacher-btn" onclick="openTeacherModal()">
      <span>⚙️ 교사용 설정</span>
      <span id="header-speed-badge" style="background:#3182ce; color:#fff; font-size:0.7rem; padding:2px 6px; border-radius:10px;">보통</span>
    </button>
  </div>
</header>

<main>
  <div class="board-container" id="board"></div>
</main>

<!-- 📜 훈민정음 마을 스토리 오프닝 컷 모달 -->
<div class="modal-overlay" id="story-intro-modal" style="display: flex;">
  <div class="modal-card" style="max-width: 540px; border: 4px solid #ecc94b; background: #ffffff;">
    <div style="font-size: 3rem; margin-bottom: 6px;">📜 💨 ✨</div>
    <span style="display:inline-block; padding:3px 12px; background:#feebc8; color:#744210; font-size:0.75rem; font-weight:900; border-radius:999px; margin-bottom:8px;">
      훈민정음 마을의 긴급 미션
    </span>
    <h2 style="font-size: 1.5rem; font-weight: 900; color: #2d3748; margin-bottom: 12px;">
      사라진 받침 소리를 구하자!
    </h2>
    <div style="background:#fffaf0; border:2px dashed #ecc94b; border-radius:16px; padding:16px; margin-bottom:14px; font-size:1.05rem; font-weight:800; color:#2d3748; line-height:1.6;">
      &ldquo;훈민정음 마을에 <strong style="color:#e53e3e; text-decoration: underline;">받침들이 사라져버렸어요.</strong><br/>
      <strong style="color:#3182ce;">도움반 친구들</strong>이 <strong style="color:#38a169;">바른 소리</strong>를 내어 사라진 받침들을 되찾아와야 해요.&rdquo;
    </div>
    <div style="display:flex; justify-content:center; gap:8px; margin-bottom:16px;">
      <button class="btn-hint-tool" onclick="speakStoryPrologue()">
        <span>🔊</span> 이야기 듣기
      </button>
    </div>
    <button class="btn-action" style="background: linear-gradient(135deg, #3182ce, #4c51bf); font-size: 1.05rem; padding: 12px 20px;" onclick="closeStoryAndOpenOrder()">
      받침 구출 탐험대 출발! 🚀
    </button>
  </div>
</div>

<!-- 교사용 설정 모달 -->
<div class="modal-overlay" id="teacher-modal" style="display: none;">
  <div class="modal-card">
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #edf2f7; padding-bottom: 10px; margin-bottom: 16px;">
      <h2 style="font-size: 1.3rem; font-weight: 900; color: #2d3748;">⚙️ 교사용 간이 설정</h2>
      <button onclick="closeTeacherModal()" style="border:none; background:none; font-size:1.5rem; color:#a0aec0; cursor:pointer;">&times;</button>
    </div>

    <!-- 주사위 이동 속도 (학생 반응 시간 고려) -->
    <div class="setting-row">
      <label>⏱️ 주사위 이동 속도 (학생 반응 시간 조절)</label>
      <div class="speed-selector-group">
        <button class="speed-opt-btn" id="speed-slow" onclick="setMoveSpeed('slow')">
          <span style="font-size: 1.3rem;">🐢</span>
          <span>느림</span>
          <span style="font-size: 0.7rem; color: #718096;">반응 배려 (650ms)</span>
        </button>
        <button class="speed-opt-btn active" id="speed-normal" onclick="setMoveSpeed('normal')">
          <span style="font-size: 1.3rem;">🚶</span>
          <span>보통</span>
          <span style="font-size: 0.7rem; color: #718096;">표준 권장 (320ms)</span>
        </button>
        <button class="speed-opt-btn" id="speed-fast" onclick="setMoveSpeed('fast')">
          <span style="font-size: 1.3rem;">🐇</span>
          <span>빠름</span>
          <span style="font-size: 0.7rem; color: #718096;">빠른 진행 (140ms)</span>
        </button>
      </div>
    </div>

    <div class="setting-row" style="display:flex; justify-content:space-between; align-items:center; background:#f7fafc; padding:10px 14px; border-radius:12px; border:1px solid #e2e8f0;">
      <div>
        <div style="font-size:0.9rem; font-weight:800; color:#2d3748;">🔊 음성 및 효과음</div>
        <div style="font-size:0.75rem; color:#718096;">Web Speech 안내 낭독</div>
      </div>
      <button id="btn-toggle-sound" onclick="toggleSound()" class="teacher-btn">소리 켜짐</button>
    </div>

    <div style="margin-top: 10px; width: 100%; display: flex; gap: 10px;">
      <button class="btn-action" style="flex:1;" onclick="closeTeacherModal()">확인 및 닫기</button>
    </div>
  </div>
</div>

<!-- 순서 및 동물 캐릭터 뽑기 모달 -->
<div class="modal-overlay" id="order-modal" style="display: none;">
  <div class="modal-card" style="max-width: 580px;">
    <h2 style="font-size: 1.4rem; font-weight: 900; margin-bottom: 4px; color: #2d3748;">🐾 캐릭터 선택 & 순서 뽑기</h2>
    <p style="color: #718096; font-size: 0.85rem; font-weight:700; margin-bottom: 12px;">원하는 동물 캐릭터를 터치하여 고른 후 순서를 결정해요!</p>
    <div class="order-list" id="order-list-view" style="max-height: 380px; overflow-y: auto; padding: 4px;"></div>
    <div style="display:flex; gap:10px; width:100%; margin-top: 12px;">
      <button class="btn-action" style="background:#718096; flex:1;" onclick="shuffleOrder()">다시 섞기 🎲</button>
      <button class="btn-action" style="background:#38a169; flex:2;" onclick="confirmOrderAndStart()">선택 완료 & 출발! 🚀</button>
    </div>
  </div>
</div>

<!-- 받침 구출 미션 팝업 -->
<div class="modal-overlay" id="mission-modal" style="display: none;">
  <div class="modal-card">
    <div class="mission-header">
      <span class="mission-category" id="mission-type-title">입술 소리 칸</span>
      <div class="hint-btn-group">
        <button class="btn-hint-tool" id="btn-hint-listen" onclick="listenMissionHint()" title="힌트 듣기">
          <span>🔊</span> 힌트 듣기
        </button>
        <button class="btn-hint-tool" id="btn-hint-view" onclick="toggleMissionHintView()" title="힌트 보기">
          <span>💡</span> <span id="hint-view-text">힌트 보기</span>
        </button>
      </div>
    </div>
    <div class="articulation-hint-card" id="articulation-hint-card">
      <span id="hint-icon">👄</span>
      <span id="hint-desc">두 입술을 꼭 닫으며 소리 내요</span>
    </div>
    <div class="mission-body">
      <div class="mission-image-box" id="mission-img-box"></div>
      <div class="mission-word-box">
        <span id="prefix-text"></span>
        <div class="target-block" id="target-block">
          <span class="onset-vowel" id="target-char">바</span>
          <span class="final-slot" id="final-slot">?</span>
        </div>
        <span id="suffix-text"></span>
      </div>
    </div>
    <div class="feedback-text" id="feedback-text"></div>
    <div class="options-container" id="choices-box"></div>
  </div>
</div>

<!-- 📢 다 함께 외쳐요! 합창 무대 모달 -->
<div class="modal-overlay" id="chant-modal" style="display: none;">
  <div class="modal-card" style="max-width: 580px; border: 4px solid #f6ad55;">
    <div class="chant-banner">
      <div style="display:flex; align-items:center; justify-content:center; gap:8px;">
        <span style="font-size:1.8rem;">📢</span>
        <h2>다 함께 외쳐요!</h2>
        <span style="font-size:1.8rem;">👏</span>
      </div>
      <p style="font-size:0.85rem; font-weight:800; margin-top:4px; opacity:0.95;">
        손뼉을 짝! 짝! 치며 다 함께 큰 소리로 외쳐봐요!
      </p>
    </div>

    <!-- 완성된 낱말 음절 박스 -->
    <div style="width:100%; background:#fffaf0; border:2px solid #feebc8; border-radius:20px; padding:12px; margin:4px 0;">
      <div id="chant-syllables-container" class="chant-syllables-box"></div>
      <div id="chant-status-msg" style="text-align:center; font-size:0.95rem; font-weight:800; color:#c05621; min-height:24px;">
        박자에 맞춰 글자를 힘차게 읽어요!
      </div>
    </div>

    <!-- 4명의 학생 합창단 -->
    <div class="chant-players-box">
      <div style="font-size:0.75rem; font-weight:800; color:#718096; margin-bottom:6px;">
        👥 우리 반 친구들 모두 다 함께 손뼉을 쳐요!
      </div>
      <div id="chant-players-grid" style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;"></div>
    </div>

    <div style="display:flex; gap:10px; width:100%; margin-top:10px;">
      <button class="btn-action" style="background:#edf2f7; color:#4a5568; flex:1; font-size:0.9rem;" onclick="replayChant()">
        다시 외치기 🔊
      </button>
      <button class="btn-action" style="background:#38a169; flex:2; font-size:1rem;" onclick="finishChant()">
        받침 1개 구출 완료! 🌟
      </button>
    </div>
  </div>
</div>

<!-- 이벤트 카드 모달 -->
<div class="modal-overlay" id="event-modal" style="display: none;">
  <div class="modal-card">
    <h2 style="font-size: 1.4rem; font-weight: 900; color: #6b46c1; margin-bottom: 8px;">✨ 이벤트 발생!</h2>
    <div class="event-desc" id="event-desc-text"></div>
    <button class="btn-action" style="background:#6b46c1;" onclick="closeEventModal()">확인</button>
  </div>
</div>

<!-- 최종 승리 모달 -->
<div class="modal-overlay" id="victory-modal" style="display: none;">
  <div class="modal-card">
    <h2 style="font-size: 2.2rem; font-weight: 900; color: #e53e3e; margin-bottom: 10px;">🏆 축하합니다!</h2>
    <p class="event-desc" id="victory-text">선아 학생이 받침 6개를 모두 구출했습니다!</p>
    <button class="btn-action" onclick="restartGame()">게임 다시 하기</button>
  </div>
</div>

<canvas id="confetti-canvas"></canvas>

<script>
  /* Web Audio Synthesizer (태블릿 iOS Safari & 안드로이드 자동재생 정책 대응) */
  let audioCtx = null;
  let soundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // 첫 사용자 터치/클릭 시 오디오 및 음성 엔진 안전 언락
  function unlockAudioEngine() {
    try {
      const ctx = getAudioContext();
      if (ctx) {
        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
      }
    } catch (e) {}

    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
        const silentUtterance = new SpeechSynthesisUtterance('');
        window.speechSynthesis.speak(silentUtterance);
      } catch (e) {}
    }
  }
  document.addEventListener('pointerdown', unlockAudioEngine, { once: true });
  document.addEventListener('touchstart', unlockAudioEngine, { once: true });

  function playSound(type) {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'roll') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'step') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, now);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'correct') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'sine';
        o.frequency.setValueAtTime(freq, now + idx * 0.08);
        g.gain.setValueAtTime(0.2, now + idx * 0.08);
        g.gain.linearRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);
        o.start(now + idx * 0.08);
        o.stop(now + idx * 0.08 + 0.25);
      });
    } else if (type === 'wrong') {
      // 🎶 특수교육 접근성: 거친 톱니파 부저 대신, 호기심과 재도전을 북돋우는 온화한 실로폰/마림바 2음
      const gentleNotes = [349.23, 329.63]; // F4 -> E4
      gentleNotes.forEach((freq, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = 'triangle';
        o.frequency.setValueAtTime(freq, now + idx * 0.1);
        g.gain.setValueAtTime(0.16, now + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.18);
        o.start(now + idx * 0.1);
        o.stop(now + idx * 0.1 + 0.18);
      });
    } else if (type === 'clap') {
      const bufferSize = Math.floor(ctx.sampleRate * 0.12);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.setValueAtTime(2.0, now);
      const clapGain = ctx.createGain();
      clapGain.gain.setValueAtTime(0.4, now);
      clapGain.gain.exponentialRampToValueAtTime(0.005, now + 0.12);
      noise.connect(filter);
      filter.connect(clapGain);
      clapGain.connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.12);
    }
  }

  function speakWord(text) {
    if (!soundEnabled) return;
    if ('speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        if (naturalVoice) {
          utterance.voice = naturalVoice;
        } else {
          const voices = window.speechSynthesis.getVoices();
          const koVoice = voices.find(v => v.lang === 'ko-KR' || v.lang.startsWith('ko'));
          if (koVoice) utterance.voice = koVoice;
        }
        utterance.rate = 0.92;
        utterance.pitch = 1.02;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis error:', err);
      }
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('btn-toggle-sound');
    btn.textContent = soundEnabled ? '소리 켜짐' : '소리 꺼짐';
    btn.style.color = soundEnabled ? '#2b6cb0' : '#e53e3e';
  }

  /* 24개 조음 위치별 단어 데이터베이스 (입술 8개, 혀끝 8개, 목구멍 8개) */
  const REPRESENTATIVE_FINALS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ'];

  const VOCAB_DATABASE = {
    lip: [
      { prefix: '', targetOnset: '고', final: 'ㅁ', word: '곰', icon: 'bear', hint: "두 입술을 '음~' 하고 꼭 다물며 코로 [ㅁ] 소리를 내요" },
      { prefix: '', targetOnset: '바', final: 'ㅂ', word: '밥', icon: 'rice', hint: "두 입술을 '읍!' 하고 딱 다물어 공기를 멈추며 [ㅂ] 소리를 내요" },
      { prefix: '구', targetOnset: '르', final: 'ㅁ', word: '구름', icon: 'cloud', hint: "두 입술을 부드럽게 붙여 코로 '음~' [ㅁ] 소리를 울려요" },
      { prefix: '', targetOnset: '기', final: 'ㅁ', word: '김', icon: 'gim', hint: "두 입술을 맞대고 입술소리 [ㅁ]으로 닫아보세요" },
      { prefix: '', targetOnset: '바', final: 'ㅁ', word: '밤', icon: 'chestnut', hint: "토실토실 알밤! 두 입술을 꼭 닫는 [ㅁ] 소리예요" },
      { prefix: '', targetOnset: '커', final: 'ㅂ', word: '컵', icon: 'cup', hint: "두 입술을 '읍!' 하고 딱 맞물려 소리를 닫는 [ㅂ] 받침이에요" },
      { prefix: '', targetOnset: '이', final: 'ㅂ', word: '입', icon: 'lips', hint: "말을 하는 입! 두 입술을 착 붙여 공기를 막는 [ㅂ] 받침이에요" },
      { prefix: '', targetOnset: '보', final: 'ㅁ', word: '봄', icon: 'flower', hint: "꽃피는 봄! 두 입술을 포근하게 붙여 코로 내는 [ㅁ] 소리예요" }
    ],
    tongue: [
      { prefix: '', targetOnset: '누', final: 'ㄴ', word: '눈', icon: 'snow', hint: "혀끝을 윗니 뒤 잇몸에 착 붙이고 코로 '은~' [ㄴ] 소리를 내요" },
      { prefix: '', targetOnset: '다', final: 'ㄹ', word: '달', icon: 'moon', hint: "혀끝을 윗잇몸 천장에 가볍게 올려 닿으며 [ㄹ] 소리를 내요" },
      { prefix: '', targetOnset: '수', final: 'ㄷ', suffix: '가락', word: '숟가락', icon: 'spoon', hint: "혀끝을 윗니 뒤 잇몸에 '읃!' 하고 꼭 붙여 소리를 멈추는 [ㄷ] 받침이에요" },
      { prefix: '', targetOnset: '소', final: 'ㄴ', word: '손', icon: 'hand', hint: "혀끝을 윗니 뒤 잇몸에 닿고 콧소리로 [ㄴ] 소리를 내요" },
      { prefix: '', targetOnset: '무', final: 'ㄹ', word: '물', icon: 'water', hint: "혀끝을 입천장 윗잇몸 쪽으로 살포시 들어 올리는 [ㄹ] 받침이에요" },
      { prefix: '', targetOnset: '사', final: 'ㄴ', word: '산', icon: 'mountain', hint: "혀끝을 윗잇몸에 넓게 착 붙이며 [ㄴ] 소리로 닫아보세요" },
      { prefix: '', targetOnset: '벼', final: 'ㄹ', word: '별', icon: 'star', hint: "혀끝을 윗니 뒤 천장에 부드럽게 올려 붙이는 [ㄹ] 소리예요" },
      { prefix: '', targetOnset: '도', final: 'ㄷ', suffix: '보기', word: '돋보기', icon: 'magnifier', hint: "혀끝으로 윗잇몸을 딱 막아 소리를 탁 끊어주는 [ㄷ] 받침이에요" }
    ],
    throat: [
      { prefix: '', targetOnset: '고', final: 'ㅇ', word: '공', icon: 'ball', hint: "혀 뒤쪽을 목구멍 쪽으로 들고 코로 '응~' 소리를 울려요" },
      { prefix: '수', targetOnset: '바', final: 'ㄱ', word: '수박', icon: 'watermelon', hint: "혀 뒤쪽으로 목구멍 안쪽을 '윽!' 하고 딱 막는 [ㄱ] 받침이에요" },
      { prefix: '', targetOnset: '채', final: 'ㄱ', word: '책', icon: 'book', hint: "목구멍 깊은 곳에서 공기가 나오지 않게 딱 막는 [ㄱ] 소리예요" },
      { prefix: '', targetOnset: '가', final: 'ㅇ', word: '강', icon: 'river', hint: "목구멍 안쪽을 열고 코로 소리를 시원하게 울리는 [ㅇ] 소리예요" },
      { prefix: '', targetOnset: '바', final: 'ㅇ', word: '방', icon: 'room', hint: "혀 뒤를 올려 목구멍과 코를 찌잉 울리는 [ㅇ] 받침이에요" },
      { prefix: '', targetOnset: '떠', final: 'ㄱ', word: '떡', icon: 'ricecake', hint: "목구멍 안쪽에서 공기를 '윽!' 하고 딱 멈추는 [ㄱ] 받침이에요" },
      { prefix: '호', targetOnset: '바', final: 'ㄱ', word: '호박', icon: 'pumpkin', hint: "혀 뒤쪽을 목구멍에 대고 소리를 딱 끊어주는 [ㄱ] 소리예요" },
      { prefix: '', targetOnset: '조', final: 'ㅇ', word: '종', icon: 'bell', hint: "목구멍을 둥글게 울려 '응~' 맑게 울려 퍼지는 [ㅇ] 받침이에요" }
    ]
  };

  /* 인라인 SVG 일러스트 단서 모음 */
  const SVG_ICONS = ${JSON.stringify(RAW_SVG_MAP)};

  function getIllustration(icon) {
    return SVG_ICONS[icon] || SVG_ICONS['bear'];
  }

  /* 24개 순환 트랙 명세 */
  const TRACK_TILES = [
    { type: 'start', label: '출발' },
    { type: 'lip', label: '입술 소리(ㅁ,ㅂ)' },
    { type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)' },
    { type: 'event', label: '세종대왕 격려', eventType: 'forward1', desc: '세종대왕의 격려! 앞으로 1칸 이동합니다.' },
    { type: 'throat', label: '목구멍 소리(ㅇ,ㄱ)' },
    { type: 'lip', label: '입술 소리(ㅁ,ㅂ)' },
    { type: 'event', label: '친구와 박수', eventType: 'clap', desc: '친구와 함께 손뼉을 짝짝 치세요!' },
    { type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)' },
    { type: 'throat', label: '목구멍 소리(ㅇ,ㄱ)' },
    // 우측 세로
    { type: 'lip', label: '입술 소리(ㅁ,ㅂ)' },
    { type: 'event', label: '바람이 쌩!', eventType: 'back1', desc: '바람이 쌩! 뒤로 1칸 이동합니다.' },
    { type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)' },
    // 하단 가로
    { type: 'throat', label: '목구멍 소리(ㅇ,ㄱ)' },
    { type: 'lip', label: '입술 소리(ㅁ,ㅂ)' },
    { type: 'event', label: '세종대왕 격려', eventType: 'forward1', desc: '세종대왕의 격려! 앞으로 1칸 이동합니다.' },
    { type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)' },
    { type: 'throat', label: '목구멍 소리(ㅇ,ㄱ)' },
    { type: 'lip', label: '입술 소리(ㅁ,ㅂ)' },
    { type: 'event', label: '친구와 박수', eventType: 'clap', desc: '친구와 함께 손뼉을 짝짝 치세요!' },
    { type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)' },
    { type: 'throat', label: '목구멍 소리(ㅇ,ㄱ)' },
    // 좌측 세로
    { type: 'event', label: '바람이 쌩!', eventType: 'back1', desc: '바람이 쌩! 뒤로 1칸 이동합니다.' },
    { type: 'lip', label: '입술 소리(ㅁ,ㅂ)' },
    { type: 'tongue', label: '혀끝 소리(ㄴ,ㄷ,ㄹ)' }
  ];

  function getGridPosition(rawIndex) {
    const index = ((rawIndex % 24) + 24) % 24;
    if (index >= 0 && index <= 8) return { row: 1, col: index + 1 };
    if (index >= 9 && index <= 11) return { row: index - 7, col: 9 };
    if (index >= 12 && index <= 20) return { row: 5, col: 9 - (index - 12) };
    return { row: 5 - (index - 20), col: 1 };
  }

  /* 게임 및 속도 상태 (선생님 반응 시간 조절) */
  let currentMode = 'A';
  let moveSpeedMs = 320; // 기본 '보통' (320ms)
  let isMissionSolved = false; // 중복 구출 방지 플래그
  let naturalVoice = null;
  const AVATAR_OPTIONS = [
    { icon: '🐶', label: '강아지' },
    { icon: '🐱', label: '고양이' },
    { icon: '🐻', label: '곰돌이' },
    { icon: '🐰', label: '토끼' },
    { icon: '🦁', label: '사자' },
    { icon: '🐼', label: '판다' },
    { icon: '🦊', label: '여우' },
    { icon: '🐯', label: '호랑이' },
    { icon: '🧭', label: '나침반' },
    { icon: '🎒', label: '탐험' },
    { icon: '🔍', label: '돋보기' },
    { icon: '⭐', label: '별빛' }
  ];

  let players = [
    { id: 0, name: '선아', icon: '🐶', label: '강아지', pos: 0, score: 0 },
    { id: 1, name: '주언', icon: '🐱', label: '고양이', pos: 0, score: 0 },
    { id: 2, name: '초아', icon: '🐻', label: '곰돌이', pos: 0, score: 0 },
    { id: 3, name: '여진', icon: '🐰', label: '토끼', pos: 0, score: 0 }
  ];
  let turnIndex = 0;
  let isRolling = false;
  let isGameOver = false;
  let currentMission = null;

  function updateDiceUIState() {
    const dice = document.getElementById('main-dice');
    if (!dice) return;
    if (isRolling || isGameOver) {
      dice.classList.add('disabled');
    } else {
      dice.classList.remove('disabled');
    }
  }

  function initNaturalVoice() {
    if ('speechSynthesis' in window) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const koVoices = voices.filter(v => v.lang === 'ko-KR' || v.lang.startsWith('ko'));
        if (koVoices.length > 0) {
          naturalVoice = koVoices.find(v => 
            /natural|neural|online|google|유나|yuna|혜미|heami|서연|seoyeon|소라|sora/i.test(v.name)
          ) || koVoices.find(v => !v.localService) || koVoices[0];
        }
      };
      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  /* 훈민정음 마을 스토리 오프닝 함수 */
  function speakStoryPrologue() {
    speakWord('훈민정음 마을에 받침들이 사라져버렸어요. 도움반 친구들이 바른 소리를 내어 사라진 받침들을 되찾아와야 해요.');
  }

  function openStoryModal() {
    document.getElementById('story-intro-modal').style.display = 'flex';
  }

  function closeStoryAndOpenOrder() {
    document.getElementById('story-intro-modal').style.display = 'none';
    showOrderModal();
    speakWord('친구들의 동물 캐릭터를 고르고 출발 순서를 정해주세요!');
  }

  window.onload = () => {
    initNaturalVoice();
    buildBoard();
    openStoryModal();
    initConfetti();
  };

  function setMode(mode) {
    currentMode = mode;
    document.getElementById('btn-mode-a').classList.toggle('active', mode === 'A');
    document.getElementById('btn-mode-b').classList.toggle('active', mode === 'B');
  }

  /* 교사용 속도 설정 */
  function openTeacherModal() {
    document.getElementById('teacher-modal').style.display = 'flex';
  }

  function closeTeacherModal() {
    document.getElementById('teacher-modal').style.display = 'none';
  }

  function setMoveSpeed(speed) {
    document.getElementById('speed-slow').classList.toggle('active', speed === 'slow');
    document.getElementById('speed-normal').classList.toggle('active', speed === 'normal');
    document.getElementById('speed-fast').classList.toggle('active', speed === 'fast');

    const badge = document.getElementById('header-speed-badge');
    if (speed === 'slow') {
      moveSpeedMs = 650;
      badge.textContent = '🐢 느림';
      badge.style.background = '#38a169';
    } else if (speed === 'fast') {
      moveSpeedMs = 140;
      badge.textContent = '🐇 빠름';
      badge.style.background = '#e53e3e';
    } else {
      moveSpeedMs = 320;
      badge.textContent = '🚶 보통';
      badge.style.background = '#3182ce';
    }
  }

  function setPlayerAvatar(playerId, icon, label) {
    const p = players.find(x => x.id === playerId);
    if (p) {
      p.icon = icon;
      p.label = label;
      renderOrderList();
    }
  }

  function shuffleOrder() {
    playSound('roll');
    players.sort(() => Math.random() - 0.5);
    renderOrderList();
  }

  function renderOrderList() {
    const listView = document.getElementById('order-list-view');
    if (!listView) return;
    listView.innerHTML = '';

    players.forEach((p, i) => {
      const item = document.createElement('div');
      item.className = 'order-item';
      item.style.display = 'flex';
      item.style.flexDirection = 'column';
      item.style.alignItems = 'flex-start';
      item.style.gap = '6px';
      item.style.padding = '10px 12px';
      item.style.borderRadius = '14px';
      item.style.border = '1px solid #e2e8f0';
      item.style.marginBottom = '8px';
      item.style.background = '#f8fafc';

      let avatarButtonsHtml = '';
      AVATAR_OPTIONS.forEach(opt => {
        const isSelected = p.icon === opt.icon;
        avatarButtonsHtml += \`<button type="button" onclick="setPlayerAvatar(\${p.id}, '\${opt.icon}', '\${opt.label}')" style="border: 2px solid \${isSelected ? '#3182ce' : '#e2e8f0'}; background: \${isSelected ? '#ebf8ff' : '#ffffff'}; border-radius: 8px; padding: 2px 6px; font-size: 1.15rem; cursor: pointer;" title="\${opt.label}">\${opt.icon}</button>\`;
      });

      item.innerHTML = \`
        <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.95rem; font-weight:800; color:#2d3748;">
            <span style="color:#3182ce;">\${i + 1}등</span> 차례 : <strong>\${p.name}</strong>
            <span style="font-size:0.8rem; font-weight:normal; color:#718096; margin-left:4px;">(\${p.label})</span>
          </span>
          <span class="token p\${p.id}" style="font-size:1.15rem; width:28px; height:28px;">\${p.icon || p.name[0]}</span>
        </div>
        <div style="width:100%; display:flex; flex-wrap:wrap; gap:4px; margin-top:2px;">
          \${avatarButtonsHtml}
        </div>
      \`;
      listView.appendChild(item);
    });
  }

  function showOrderModal() {
    renderOrderList();
    document.getElementById('order-modal').style.display = 'flex';
  }

  function confirmOrderAndStart() {
    document.getElementById('order-modal').style.display = 'none';
    updatePlayerStatusUI();
    renderTokens();
    speakWord(\`\${players[0].name} 학생의 차례입니다. 주사위를 눌러주세요.\`);
  }

  function buildBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    TRACK_TILES.forEach((tileData, i) => {
      const pos = getGridPosition(i);
      const tile = document.createElement('div');
      tile.className = \`tile \${tileData.type}\`;
      tile.style.gridRow = pos.row;
      tile.style.gridColumn = pos.col;
      tile.id = \`tile-\${i}\`;

      let badgeLabel = '';
      if (tileData.type === 'start') badgeLabel = '출발';
      else if (tileData.type === 'lip') badgeLabel = '입술소리';
      else if (tileData.type === 'tongue') badgeLabel = '혀끝소리';
      else if (tileData.type === 'throat') badgeLabel = '목구멍소리';
      else badgeLabel = '이벤트';

      tile.innerHTML = \`
        <span class="tile-index">\${i}</span>
        <span class="tile-type-badge">\${badgeLabel}</span>
        <div class="tile-label">\${tileData.label}</div>
        <div class="tile-players" id="tile-players-\${i}"></div>
      \`;
      board.appendChild(tile);
    });

    const centerStage = document.createElement('div');
    centerStage.className = 'center-stage';
    centerStage.innerHTML = \`
      <div class="player-status-bar" id="player-status-bar"></div>
      <div class="dice-area">
        <div class="dice" id="main-dice" onclick="handleDiceRoll()" title="주사위 굴리기">
          <div class="dice-pips-grid" id="dice-pips-grid">
            <span style="font-size:2.8rem; font-weight:900; color:#a0aec0; grid-column:2; grid-row:2; line-height:1;">?</span>
          </div>
        </div>
        <div class="action-guide-text" id="turn-guide-text">주사위를 굴려주세요!</div>
        <div style="font-size: 0.75rem; font-weight: 800; color: #718096; background:#edf2f7; padding:3px 10px; border-radius:12px;">주사위: 1~6점 (점 표시) • 받침 6개 구출 승리</div>
      </div>
      <div style="font-size: 0.85rem; font-weight: 800; color: #a0aec0;">👑 세종대왕과 함께하는 한글 바른 소리 탐험</div>
    \`;
    board.appendChild(centerStage);
    updatePlayerStatusUI();
  }

  const DICE_PIPS_MAP = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };

  function renderDicePips(val) {
    const grid = document.getElementById('dice-pips-grid');
    if (!grid) return;
    if (val === '?' || !val) {
      grid.innerHTML = '<span style="font-size:2.8rem; font-weight:900; color:#a0aec0; grid-column:2; grid-row:2; line-height:1;">?</span>';
      return;
    }
    const num = parseInt(val, 10);
    const active = DICE_PIPS_MAP[num] || [4];
    let html = '';
    for (let i = 0; i < 9; i++) {
      if (active.includes(i)) {
        html += \`<div class="pip-dot \${num === 1 ? 'pip-red' : ''}"></div>\`;
      } else {
        html += '<div class="pip-dot empty"></div>';
      }
    }
    grid.innerHTML = html;
  }

  function updatePlayerStatusUI() {
    const container = document.getElementById('player-status-bar');
    if (!container) return;
    container.innerHTML = '';

    players.forEach((p, idx) => {
      const isCurrentTurn = idx === turnIndex;
      const card = document.createElement('div');
      card.className = \`player-card \${isCurrentTurn ? 'active' : ''}\`;
      card.innerHTML = \`
        \${isCurrentTurn ? '<div class="turn-indicator-badge">👉 지금 차례!</div>' : ''}
        <div class="token p\${p.id}" style="width:28px; height:28px; font-size:1rem; display:flex; align-items:center; justify-content:center;">\${p.icon || p.name[0]}</div>
        <div class="player-info">
          <span class="player-name">\${p.name} <small style="font-size:0.7rem; color:#718096; font-weight:normal;">(\${p.label || '대원'})</small></span>
          <span class="player-score">구출: \${p.score}/6개</span>
        </div>
      \`;
      container.appendChild(card);
    });

    const activePlayer = players[turnIndex];
    const guideText = document.getElementById('turn-guide-text');
    if (guideText) {
      guideText.innerHTML = \`<span style="display:inline-flex; align-items:center; gap:6px; background:#ebf8ff; color:#2b6cb0; padding:4px 14px; border-radius:999px; border:1px solid #bee3f8;">
        <span style="font-size:1.15rem;">\${activePlayer.icon || '🐾'}</span>
        <strong>\${activePlayer.name} (\${activePlayer.label})</strong> 차례예요! 주사위를 톡 터치하세요! 🎲
      </span>\`;
    }
  }

  function renderTokens() {
    for (let i = 0; i < TRACK_TILES.length; i++) {
      const container = document.getElementById(\`tile-players-\${i}\`);
      if (container) container.innerHTML = '';
    }

    players.forEach(p => {
      const container = document.getElementById(\`tile-players-\${p.pos}\`);
      if (container) {
        const token = document.createElement('div');
        token.className = \`token p\${p.id}\`;
        token.textContent = p.icon || p.name[0];
        container.appendChild(token);
      }
    });
  }

  function handleDiceRoll() {
    if (isRolling || isGameOver) return;
    isRolling = true;
    updateDiceUIState();

    playSound('roll');
    const dice = document.getElementById('main-dice');
    dice.classList.add('rolling');

    let rollCount = 0;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * 6) + 1;
      renderDicePips(rand);
      rollCount++;
      if (rollCount > 10) {
        clearInterval(interval);
        const finalValue = Math.floor(Math.random() * 6) + 1;
        renderDicePips(finalValue);
        dice.classList.remove('rolling');
        const activePlayer = players[turnIndex];
        const guideText = document.getElementById('turn-guide-text');
        if (guideText) {
          guideText.textContent = \`\${activePlayer.name} 학생: 주사위 눈 [\${finalValue}점] 이동!\`;
        }
        movePlayer(finalValue);
      }
    }, 60);
  }

  /* 선생님이 설정한 속도(moveSpeedMs)에 맞춰 부드럽게 이동 */
  function movePlayer(steps) {
    const player = players[turnIndex];
    let stepCount = 0;

    const moveInterval = setInterval(() => {
      player.pos = ((player.pos + 1) % TRACK_TILES.length + TRACK_TILES.length) % TRACK_TILES.length;
      playSound('step');
      renderTokens();
      stepCount++;

      if (stepCount >= steps) {
        clearInterval(moveInterval);
        setTimeout(() => {
          handleTileArrival(player.pos);
        }, Math.max(300, moveSpeedMs * 0.8));
      }
    }, moveSpeedMs);
  }

  function handleTileArrival(pos) {
    const tile = TRACK_TILES[pos];
    if (tile.type === 'event') {
      handleEventTile(tile);
    } else if (tile.type === 'start') {
      passTurn();
    } else {
      openMissionModal(tile.type);
    }
  }

  function handleEventTile(tile) {
    const eventModal = document.getElementById('event-modal');
    const eventDesc = document.getElementById('event-desc-text');
    eventDesc.textContent = tile.desc;
    speakWord(tile.desc);
    eventModal.style.display = 'flex';
    eventModal.dataset.eventType = tile.eventType;
  }

  function closeEventModal() {
    const eventModal = document.getElementById('event-modal');
    const eventType = eventModal.dataset.eventType;
    eventModal.style.display = 'none';

    const player = players[turnIndex];
    if (eventType === 'forward1') {
      player.pos = ((player.pos + 1) % TRACK_TILES.length + TRACK_TILES.length) % TRACK_TILES.length;
      renderTokens();
      setTimeout(() => {
        handleTileArrival(player.pos);
      }, 400);
    } else if (eventType === 'back1') {
      player.pos = ((player.pos - 1) % TRACK_TILES.length + TRACK_TILES.length) % TRACK_TILES.length;
      renderTokens();
      setTimeout(() => {
        passTurn();
      }, 300);
    } else {
      passTurn();
    }
  }

  /* 미션 팝업 열기 & [나] 모드 점선 테두리 색상 깜빡임 적용 */
  function openMissionModal(type) {
    const pool = VOCAB_DATABASE[type];
    currentMission = pool[Math.floor(Math.random() * pool.length)];

    const titleEl = document.getElementById('mission-type-title');
    const hintIcon = document.getElementById('hint-icon');
    const hintDesc = document.getElementById('hint-desc');

    if (type === 'lip') {
      titleEl.textContent = '입술 소리 칸 (ㅁ, ㅂ)';
      hintIcon.textContent = '👄';
      hintDesc.textContent = currentMission.hint;
    } else if (type === 'tongue') {
      titleEl.textContent = '혀끝 소리 칸 (ㄴ, ㄷ, ㄹ)';
      hintIcon.textContent = '👅';
      hintDesc.textContent = currentMission.hint;
    } else {
      titleEl.textContent = '목구멍 소리 칸 (ㅇ, ㄱ)';
      hintIcon.textContent = '🗣️';
      hintDesc.textContent = currentMission.hint;
    }

    document.getElementById('mission-img-box').innerHTML = getIllustration(currentMission.icon);
    document.getElementById('prefix-text').textContent = currentMission.prefix || '';
    document.getElementById('target-char').textContent = currentMission.targetOnset;
    document.getElementById('final-slot').textContent = '?';
    document.getElementById('suffix-text').textContent = currentMission.suffix || '';

    const targetBlock = document.getElementById('target-block');
    targetBlock.classList.remove('merged');

    // ✨ [나] 촉구 모드일 때 비어 있는 목표 받침 네모 박스의 점선 테두리 색상 깜빡임 활성화!
    if (currentMode === 'B') {
      targetBlock.classList.add('prompt-dashed-blink');
    } else {
      targetBlock.classList.remove('prompt-dashed-blink');
    }

    // 힌트 초기화 (사용자 요청: 바로 보이지 않고 버튼 클릭 시 확인)
    isHintVisible = false;
    document.getElementById('articulation-hint-card').style.display = 'none';
    document.getElementById('hint-view-text').textContent = '힌트 보기';
    document.getElementById('btn-hint-view').classList.remove('active');

    document.getElementById('feedback-text').textContent = '';
    isMissionSolved = false;
    renderChoices(currentMission.final);
    document.getElementById('mission-modal').style.display = 'flex';
    speakWord(\`비어 있는 받침을 찾아 \${currentMission.word} 낱말을 완성해 보세요.\`);
  }

  let isHintVisible = false;

  function listenMissionHint() {
    if (!currentMission) return;
    speakWord(\`\${currentMission.word} 힌트! \${currentMission.hint}\`);
  }

  function toggleMissionHintView() {
    if (!currentMission) return;
    isHintVisible = !isHintVisible;
    const card = document.getElementById('articulation-hint-card');
    const textEl = document.getElementById('hint-view-text');
    const btn = document.getElementById('btn-hint-view');

    if (isHintVisible) {
      card.style.display = 'flex';
      textEl.textContent = '힌트 숨기기';
      btn.classList.add('active');
    } else {
      card.style.display = 'none';
      textEl.textContent = '힌트 보기';
      btn.classList.remove('active');
    }
  }

  function renderChoices(correctFinal) {
    const box = document.getElementById('choices-box');
    box.innerHTML = '';

    let choices = [];
    if (currentMode === 'A') {
      choices = [...REPRESENTATIVE_FINALS];
    } else {
      const distractors = REPRESENTATIVE_FINALS.filter(f => f !== correctFinal);
      const randomDistractor = distractors[Math.floor(Math.random() * distractors.length)];
      choices = [correctFinal, randomDistractor].sort(() => Math.random() - 0.5);
    }

    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = ch;

      if (currentMode === 'B' && ch === correctFinal) {
        btn.classList.add('prompt-glow');
        btn.innerHTML = \`<span>\${ch}</span><span style="font-size:0.75rem; position:absolute; top:3px; right:4px;">⭐</span>\`;
      }

      btn.onclick = () => verifyAnswer(ch, btn);
      box.appendChild(btn);
    });
  }

  let chantTimers = [];
  let isChantFinished = false;

  function verifyAnswer(selectedFinal, clickedBtn) {
    if (isMissionSolved) return;
    const feedback = document.getElementById('feedback-text');

    if (selectedFinal === currentMission.final) {
      isMissionSolved = true;
      playSound('correct');
      document.getElementById('final-slot').textContent = selectedFinal;
      const targetBlock = document.getElementById('target-block');
      targetBlock.classList.remove('prompt-dashed-blink');
      targetBlock.classList.add('merged');
      feedback.style.color = '#2f855a';
      feedback.innerHTML = '<span style="display:inline-flex; align-items:center; gap:6px;">🎉 <b>멋져요! 받침 구출 성공!</b> 다 함께 외쳐볼까요?</span>';

      speakWord(\`\${currentMission.word}! 참 잘했어요!\`);

      // 0.85초 후 "다 함께 외쳐요!" 모달로 전환
      setTimeout(() => {
        document.getElementById('mission-modal').style.display = 'none';
        openChantModal();
      }, 850);
    } else {
      playSound('wrong');
      // 🌿 특수교육 맞춤 비처벌적 피드백: 위협적인 빨강 대신 따뜻한 웜 오렌지 & 성장 마인드셋 문구
      feedback.style.color = '#dd6b20';
      const wrongCombination = composeSyllable(currentMission.targetOnset, selectedFinal);
      feedback.innerHTML = \`<span style="display:inline-flex; align-items:center; gap:6px;">🌱 <b>"\${wrongCombination}"</b>도 멋진 글자예요! 다른 받침도 쏙 넣어볼까요?</span>\`;
      speakWord(\`\${wrongCombination}? 괜찮아요! 다른 받침도 쏙 넣어보아요.\`);

      if (clickedBtn) {
        clickedBtn.classList.add('wobble-soft');
        setTimeout(() => clickedBtn.classList.remove('wobble-soft'), 500);
      }
    }
  }

  function openChantModal() {
    isChantFinished = false;
    const modal = document.getElementById('chant-modal');
    modal.style.display = 'flex';

    // 4명의 학생 합창단 UI 렌더링
    const grid = document.getElementById('chant-players-grid');
    grid.innerHTML = '';
    players.forEach((p, idx) => {
      const isTurn = idx === turnIndex;
      const div = document.createElement('div');
      div.className = 'chant-player-item' + (isTurn ? ' turn-player' : '');
      div.innerHTML = \`
        <div style="position:relative; display:flex; align-items:center; justify-content:center;">
          <span style="font-size:1.4rem;">\${p.icon || '🐶'}</span>
          <span class="clapping-hands" style="font-size:1rem; position:absolute; right:-6px; bottom:-4px;">👏</span>
        </div>
        <span style="font-size:0.75rem; font-weight:900; margin-top:3px; color:\${isTurn ? '#d69e2e' : '#4a5568'};">\${p.name}</span>
        <span style="font-size:0.65rem; color:#718096;">\${isTurn ? '도전자!' : '합창 중!'}</span>
      \`;
      grid.appendChild(div);
    });

    runChant();
  }

  function clearChantTimers() {
    chantTimers.forEach(t => clearTimeout(t));
    chantTimers = [];
  }

  function runChant() {
    clearChantTimers();
    const word = currentMission.word;
    const syllables = word.split('');
    const container = document.getElementById('chant-syllables-container');
    container.innerHTML = '';

    syllables.forEach((syl, idx) => {
      const card = document.createElement('div');
      card.className = 'chant-syllable-card';
      card.id = 'chant-card-' + idx;
      card.innerHTML = \`
        <span class="chant-clap-badge" style="display:none;" id="clap-badge-\${idx}">👏 짝!</span>
        <span>\${syl}</span>
        <span style="font-size:0.65rem; color:#a0aec0; margin-top:2px;">\${idx + 1}박</span>
      \`;
      container.appendChild(card);
    });

    const statusMsg = document.getElementById('chant-status-msg');

    // 1. "다 함께 외쳐요!" 발화 (3초 전 안내)
    speakWord('다 함께 외쳐요!');
    statusMsg.innerHTML = '<span style="color:#c05621; font-size:1.05rem;">👏 손뼉 칠 준비! <b>3</b>초 뒤에 시작해요!</span>';

    const t2 = setTimeout(() => {
      statusMsg.innerHTML = '<span style="color:#c05621; font-size:1.05rem;">👏 손뼉 칠 준비! <b>2</b>초 뒤에 시작해요!</span>';
    }, 1000);
    chantTimers.push(t2);

    const t1 = setTimeout(() => {
      statusMsg.innerHTML = '<span style="color:#c05621; font-size:1.05rem;">👏 손뼉 칠 준비! <b>1</b>초 뒤에 시작해요!</span>';
    }, 2000);
    chantTimers.push(t1);

    // 3초(3000ms) 뒤에 단어 음절 발음 및 손뼉 시작!
    let delay = 3000;
    const interval = 1000;

    syllables.forEach((syl, idx) => {
      const t = setTimeout(() => {
        statusMsg.textContent = '손뼉을 치며 큰 소리로 따라 외쳐요!';
        document.querySelectorAll('.chant-syllable-card').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.chant-clap-badge').forEach(b => b.style.display = 'none');

        const curCard = document.getElementById('chant-card-' + idx);
        if (curCard) {
          curCard.classList.add('active');
          const badge = document.getElementById('clap-badge-' + idx);
          if (badge) badge.style.display = 'block';
        }
        playSound('clap');
        speakWord(\`\${syl}!\`);
      }, delay);
      chantTimers.push(t);
      delay += interval;
    });

    // 전체 다 함께 외치기
    const finalTimer = setTimeout(() => {
      document.querySelectorAll('.chant-syllable-card').forEach(c => {
        c.classList.remove('active');
        c.classList.add('all-active');
      });
      document.querySelectorAll('.chant-clap-badge').forEach(b => b.style.display = 'none');

      statusMsg.innerHTML = '🎉 다 함께 큰 소리로: &ldquo;' + word + '!&rdquo; 참 잘했어요! 🎉';
      playSound('clap');
      setTimeout(() => playSound('clap'), 120);
      speakWord(\`다 함께! \${word}! 참 잘했어요!\`);
    }, delay + 250);
    chantTimers.push(finalTimer);
  }

  function replayChant() {
    runChant();
  }

  function finishChant() {
    if (isChantFinished) return;
    isChantFinished = true;
    clearChantTimers();

    // 단 1회 정확히 1개 구출 반영
    players[turnIndex].score += 1;
    updatePlayerStatusUI();

    document.getElementById('chant-modal').style.display = 'none';
    checkVictoryCondition();
  }

  function composeSyllable(onsetVowelStr, finalChar) {
    if (!onsetVowelStr || typeof onsetVowelStr !== 'string') return '';
    const finals = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const charCode = onsetVowelStr.charCodeAt(onsetVowelStr.length - 1);
    const finalIdx = finals.indexOf(finalChar || '');

    if (charCode >= 0xAC00 && charCode <= 0xD7A3 && finalIdx !== -1) {
      const baseCode = charCode - ((charCode - 0xAC00) % 28);
      const combined = String.fromCharCode(baseCode + finalIdx);
      return onsetVowelStr.slice(0, -1) + combined;
    }
    return onsetVowelStr + (finalChar || '');
  }

  function checkVictoryCondition() {
    const activePlayer = players[turnIndex];
    if (activePlayer.score >= 6) {
      isGameOver = true;
      isRolling = false;
      updateDiceUIState();
      document.getElementById('victory-text').innerHTML = \`<span style="font-size:2.8rem; display:block; margin-bottom:8px;">\${activePlayer.icon || '🏆'} 👑</span><strong>\${activePlayer.name}</strong> 학생(\${activePlayer.label || '대원'})이 받침 6개를 모두 구출했습니다!\`;
      document.getElementById('victory-modal').style.display = 'flex';
      startConfetti();
      speakWord(\`축하합니다! \${activePlayer.name} 학생이 승리하였습니다!\`);
    } else {
      passTurn();
    }
  }

  function passTurn() {
    if (isGameOver) return;
    turnIndex = (turnIndex + 1) % players.length;
    isRolling = false;
    updateDiceUIState();
    updatePlayerStatusUI();
    speakWord(\`\${players[turnIndex].name} 차례입니다.\`);
  }

  function restartGame() {
    stopConfetti();
    isGameOver = false;
    isRolling = false;
    updateDiceUIState();
    document.getElementById('victory-modal').style.display = 'none';
    players.forEach(p => {
      p.pos = 0;
      p.score = 0;
    });
    turnIndex = 0;
    showOrderModal();
  }

  /* 승리 축하 Confetti */
  let confettiInterval = null;
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);

  function initConfetti() {
    resizeCanvas();
  }

  function startConfetti() {
    particles = [];
    for (let i = 0; i < 160; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: ['#e53e3e', '#3182ce', '#38a169', '#ecc94b', '#9f7aea', '#ed8936'][Math.floor(Math.random() * 6)],
        gravity: 0.22,
        opacity: 1
      });
    }

    if (confettiInterval) clearInterval(confettiInterval);
    confettiInterval = setInterval(updateConfetti, 1000 / 60);
  }

  function updateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.opacity -= 0.005;

      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(p.opacity, 0);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    particles = particles.filter(p => p.opacity > 0 && p.y < canvas.height);
    if (particles.length === 0) {
      stopConfetti();
    }
  }

  function stopConfetti() {
    clearInterval(confettiInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
  }
</script>
</body>
</html>`;
}
