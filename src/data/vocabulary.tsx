import React from 'react';
import { WordMission } from '../types';

export const VOCABULARY_LIST: WordMission[] = [
  // 1. 입술소리 (ㅁ, ㅂ) - 8개 (종성 음가: 양순 불파음 [ㅂ], 양순 비음 [ㅁ])
  {
    id: 'lip-1',
    category: 'lip',
    word: '곰',
    prefix: '',
    targetOnset: '고',
    final: 'ㅁ',
    iconName: 'bear',
    hintText: "두 입술을 '음~' 하고 꼭 다물며 코로 [ㅁ] 소리를 내요"
  },
  {
    id: 'lip-2',
    category: 'lip',
    word: '밥',
    prefix: '',
    targetOnset: '바',
    final: 'ㅂ',
    iconName: 'rice',
    hintText: "두 입술을 '읍!' 하고 딱 다물어 공기를 멈추며 [ㅂ] 소리를 내요"
  },
  {
    id: 'lip-3',
    category: 'lip',
    word: '구름',
    prefix: '구',
    targetOnset: '르',
    final: 'ㅁ',
    iconName: 'cloud',
    hintText: "두 입술을 부드럽게 붙여 코로 '음~' [ㅁ] 소리를 울려요"
  },
  {
    id: 'lip-4',
    category: 'lip',
    word: '김',
    prefix: '',
    targetOnset: '기',
    final: 'ㅁ',
    iconName: 'gim',
    hintText: "두 입술을 맞대고 입술소리 [ㅁ]으로 닫아보세요"
  },
  {
    id: 'lip-5',
    category: 'lip',
    word: '밤',
    prefix: '',
    targetOnset: '바',
    final: 'ㅁ',
    iconName: 'chestnut',
    hintText: "토실토실 알밤! 두 입술을 꼭 닫는 [ㅁ] 소리예요"
  },
  {
    id: 'lip-6',
    category: 'lip',
    word: '컵',
    prefix: '',
    targetOnset: '커',
    final: 'ㅂ',
    iconName: 'cup',
    hintText: "두 입술을 '읍!' 하고 딱 맞물려 소리를 닫는 [ㅂ] 받침이에요"
  },
  {
    id: 'lip-7',
    category: 'lip',
    word: '입',
    prefix: '',
    targetOnset: '이',
    final: 'ㅂ',
    iconName: 'lips',
    hintText: "말을 하는 입! 두 입술을 착 붙여 공기를 막는 [ㅂ] 받침이에요"
  },
  {
    id: 'lip-8',
    category: 'lip',
    word: '봄',
    prefix: '',
    targetOnset: '보',
    final: 'ㅁ',
    iconName: 'flower',
    hintText: "꽃피는 봄! 두 입술을 포근하게 붙여 코로 내는 [ㅁ] 소리예요"
  },

  // 2. 혀끝소리 (ㄴ, ㄷ, ㄹ) - 8개 (종성 음가: 치조 비음 [ㄴ], 치조 불파음 [ㄷ], 설측음 [ㄹ])
  {
    id: 'tongue-1',
    category: 'tongue',
    word: '눈',
    prefix: '',
    targetOnset: '누',
    final: 'ㄴ',
    iconName: 'snow',
    hintText: "혀끝을 윗니 뒤 잇몸에 착 붙이고 코로 '은~' [ㄴ] 소리를 내요"
  },
  {
    id: 'tongue-2',
    category: 'tongue',
    word: '달',
    prefix: '',
    targetOnset: '다',
    final: 'ㄹ',
    iconName: 'moon',
    hintText: "혀끝을 윗잇몸 천장에 가볍게 올려 닿으며 [ㄹ] 소리를 내요"
  },
  {
    id: 'tongue-3',
    category: 'tongue',
    word: '숟가락',
    prefix: '',
    targetOnset: '수',
    final: 'ㄷ',
    suffix: '가락',
    iconName: 'spoon',
    hintText: "혀끝을 윗니 뒤 잇몸에 '읃!' 하고 꼭 붙여 소리를 멈추는 [ㄷ] 받침이에요"
  },
  {
    id: 'tongue-4',
    category: 'tongue',
    word: '손',
    prefix: '',
    targetOnset: '소',
    final: 'ㄴ',
    iconName: 'hand',
    hintText: "혀끝을 윗니 뒤 잇몸에 닿고 콧소리로 [ㄴ] 소리를 내요"
  },
  {
    id: 'tongue-5',
    category: 'tongue',
    word: '물',
    prefix: '',
    targetOnset: '무',
    final: 'ㄹ',
    iconName: 'water',
    hintText: "혀끝을 입천장 윗잇몸 쪽으로 살포시 들어 올리는 [ㄹ] 받침이에요"
  },
  {
    id: 'tongue-6',
    category: 'tongue',
    word: '산',
    prefix: '',
    targetOnset: '사',
    final: 'ㄴ',
    iconName: 'mountain',
    hintText: "혀끝을 윗잇몸에 넓게 착 붙이며 [ㄴ] 소리로 닫아보세요"
  },
  {
    id: 'tongue-7',
    category: 'tongue',
    word: '별',
    prefix: '',
    targetOnset: '벼',
    final: 'ㄹ',
    iconName: 'star',
    hintText: "혀끝을 윗니 뒤 천장에 부드럽게 올려 붙이는 [ㄹ] 소리예요"
  },
  {
    id: 'tongue-8',
    category: 'tongue',
    word: '돋보기',
    prefix: '',
    targetOnset: '도',
    final: 'ㄷ',
    suffix: '보기',
    iconName: 'magnifier',
    hintText: "혀끝으로 윗잇몸을 딱 막아 소리를 탁 끊어주는 [ㄷ] 받침이에요"
  },

  // 3. 목구멍소리 (ㅇ, ㄱ) - 8개 (종성 음가: 연구개 비음 [ㅇ], 연구개 불파음 [ㄱ])
  {
    id: 'throat-1',
    category: 'throat',
    word: '공',
    prefix: '',
    targetOnset: '고',
    final: 'ㅇ',
    iconName: 'ball',
    hintText: "혀 뒤쪽을 목구멍 쪽으로 들고 코로 '응~' 소리를 울려요"
  },
  {
    id: 'throat-2',
    category: 'throat',
    word: '수박',
    prefix: '수',
    targetOnset: '바',
    final: 'ㄱ',
    iconName: 'watermelon',
    hintText: "혀 뒤쪽으로 목구멍 안쪽을 '윽!' 하고 딱 막는 [ㄱ] 받침이에요"
  },
  {
    id: 'throat-3',
    category: 'throat',
    word: '책',
    prefix: '',
    targetOnset: '채',
    final: 'ㄱ',
    iconName: 'book',
    hintText: "목구멍 깊은 곳에서 공기가 나오지 않게 딱 막는 [ㄱ] 소리예요"
  },
  {
    id: 'throat-4',
    category: 'throat',
    word: '강',
    prefix: '',
    targetOnset: '가',
    final: 'ㅇ',
    iconName: 'river',
    hintText: "목구멍 안쪽을 열고 코로 소리를 시원하게 울리는 [ㅇ] 소리예요"
  },
  {
    id: 'throat-5',
    category: 'throat',
    word: '방',
    prefix: '',
    targetOnset: '바',
    final: 'ㅇ',
    iconName: 'room',
    hintText: "혀 뒤를 올려 목구멍과 코를 찌잉 울리는 [ㅇ] 받침이에요"
  },
  {
    id: 'throat-6',
    category: 'throat',
    word: '떡',
    prefix: '',
    targetOnset: '떠',
    final: 'ㄱ',
    iconName: 'ricecake',
    hintText: "목구멍 안쪽에서 공기를 '윽!' 하고 딱 멈추는 [ㄱ] 받침이에요"
  },
  {
    id: 'throat-7',
    category: 'throat',
    word: '호박',
    prefix: '호',
    targetOnset: '바',
    final: 'ㄱ',
    iconName: 'pumpkin',
    hintText: "혀 뒤쪽을 목구멍에 대고 소리를 딱 끊어주는 [ㄱ] 소리예요"
  },
  {
    id: 'throat-8',
    category: 'throat',
    word: '종',
    prefix: '',
    targetOnset: '조',
    final: 'ㅇ',
    iconName: 'bell',
    hintText: "목구멍을 둥글게 울려 '응~' 맑게 울려 퍼지는 [ㅇ] 받침이에요"
  }
];

export const RAW_SVG_MAP: Record<string, string> = {
  bear: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="55" r="32" fill="#8d5b4c"/><circle cx="28" cy="28" r="14" fill="#8d5b4c"/><circle cx="72" cy="28" r="14" fill="#8d5b4c"/><circle cx="28" cy="28" r="7" fill="#fbb6ce"/><circle cx="72" cy="28" r="7" fill="#fbb6ce"/><circle cx="50" cy="62" r="16" fill="#f6d5b8"/><circle cx="42" cy="48" r="4" fill="#2d3748"/><circle cx="58" cy="48" r="4" fill="#2d3748"/><ellipse cx="50" cy="58" rx="6" ry="4" fill="#2d3748"/><path d="M47 66 Q50 69 53 66" stroke="#2d3748" stroke-width="2" fill="none"/></svg>`,
  rice: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M20 50 Q50 95 80 50 Z" fill="#cbd5e0"/><ellipse cx="50" cy="50" rx="30" ry="12" fill="#e2e8f0"/><ellipse cx="50" cy="46" rx="26" ry="18" fill="#ffffff"/><circle cx="42" cy="42" r="3" fill="#cbd5e0"/><circle cx="56" cy="40" r="3" fill="#cbd5e0"/><path d="M35 80 L65 80 L62 88 L38 88 Z" fill="#a0aec0"/></svg>`,
  cloud: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M28 65 Q14 65 18 48 Q20 30 38 32 Q48 16 68 26 Q86 22 86 44 Q96 54 86 65 Z" fill="#63b3ed"/><circle cx="38" cy="46" r="3" fill="#2b6cb0"/><circle cx="58" cy="46" r="3" fill="#2b6cb0"/><path d="M44 54 Q48 58 52 54" stroke="#2b6cb0" stroke-width="2" fill="none"/></svg>`,
  gim: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect x="18" y="24" width="64" height="52" rx="6" fill="#2d3748"/><rect x="22" y="28" width="56" height="44" rx="4" fill="#1a202c"/><circle cx="34" cy="40" r="2" fill="#4a5568"/><circle cx="66" cy="60" r="2" fill="#4a5568"/><circle cx="50" cy="50" r="2" fill="#4a5568"/><path d="M30 65 Q50 72 70 65" stroke="#4a5568" stroke-width="1.5" fill="none"/></svg>`,
  chestnut: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M50 18 Q80 40 78 70 Q70 86 50 86 Q30 86 22 70 Q20 40 50 18 Z" fill="#744210"/><path d="M24 70 Q50 62 76 70 Q68 86 50 86 Q32 86 24 70 Z" fill="#d69e2e"/><circle cx="42" cy="48" r="3" fill="#ffffff"/><circle cx="58" cy="48" r="3" fill="#ffffff"/><circle cx="50" cy="56" r="2" fill="#ffffff"/></svg>`,
  cup: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M25 30 L32 80 Q33 86 42 86 L58 86 Q67 86 68 80 L75 30 Z" fill="#4299e1"/><ellipse cx="50" cy="30" rx="25" ry="6" fill="#63b3ed"/><path d="M72 40 Q88 40 88 56 Q88 70 70 70" stroke="#3182ce" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="32" rx="20" ry="4" fill="#ebf8ff"/></svg>`,
  lips: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M15 50 Q35 30 50 42 Q65 30 85 50 Q65 78 50 78 Q35 78 15 50 Z" fill="#e53e3e"/><path d="M15 50 Q35 48 50 56 Q65 48 85 50 Q65 60 50 60 Q35 60 15 50 Z" fill="#9b2c2c"/><ellipse cx="50" cy="44" rx="8" ry="3" fill="#feb2b2"/></svg>`,
  flower: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="30" r="14" fill="#f687b3"/><circle cx="70" cy="50" r="14" fill="#f687b3"/><circle cx="50" cy="70" r="14" fill="#f687b3"/><circle cx="30" cy="50" r="14" fill="#f687b3"/><circle cx="50" cy="50" r="16" fill="#ecc94b"/><circle cx="45" cy="46" r="2.5" fill="#744210"/><circle cx="55" cy="46" r="2.5" fill="#744210"/><path d="M47 54 Q50 58 53 54" stroke="#744210" stroke-width="2" fill="none"/></svg>`,

  // 혀끝소리
  snow: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="64" r="26" fill="#e2e8f0"/><circle cx="50" cy="36" r="18" fill="#edf2f7"/><circle cx="44" cy="32" r="3" fill="#2d3748"/><circle cx="56" cy="32" r="3" fill="#2d3748"/><polygon points="50,38 60,40 50,42" fill="#ed8936"/><circle cx="50" cy="56" r="3" fill="#4a5568"/><circle cx="50" cy="68" r="3" fill="#4a5568"/><rect x="34" y="16" width="32" height="6" rx="2" fill="#e53e3e"/><rect x="40" y="6" width="20" height="12" rx="2" fill="#c53030"/></svg>`,
  moon: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M42 16 A36 36 0 1 0 80 76 A32 32 0 1 1 42 16 Z" fill="#ecc94b"/><circle cx="48" cy="46" r="3" fill="#b7791f"/><circle cx="48" cy="62" r="2.5" fill="#b7791f"/><circle cx="36" cy="54" r="2" fill="#b7791f"/></svg>`,
  spoon: `<svg viewBox="0 0 100 100" class="w-full h-full"><ellipse cx="32" cy="32" rx="18" ry="24" transform="rotate(-30 32 32)" fill="#cbd5e0"/><ellipse cx="32" cy="32" rx="14" ry="20" transform="rotate(-30 32 32)" fill="#e2e8f0"/><rect x="44" y="44" width="46" height="8" rx="4" transform="rotate(45 44 44)" fill="#a0aec0"/><circle cx="80" cy="80" r="3" fill="#718096"/></svg>`,
  hand: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M35 70 L35 45 Q35 40 40 40 Q45 40 45 45 L45 32 Q45 27 50 27 Q55 27 55 32 L55 30 Q55 25 60 25 Q65 25 65 30 L65 36 Q65 31 70 31 Q75 31 75 36 L75 60 Q75 80 55 82 L42 82 Q35 80 35 70 Z" fill="#fbd38d"/><path d="M35 60 Q22 55 24 45 Q26 40 32 45 L35 50" stroke="#fbd38d" stroke-width="8" stroke-linecap="round" fill="none"/></svg>`,
  water: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M50 15 C50 15 22 52 22 68 A28 28 0 1 0 78 68 C78 52 50 15 50 15 Z" fill="#4299e1"/><path d="M35 68 A16 16 0 0 1 50 52" stroke="#ebf8ff" stroke-width="4" stroke-linecap="round" fill="none"/></svg>`,
  mountain: `<svg viewBox="0 0 100 100" class="w-full h-full"><polygon points="50,20 15,85 85,85" fill="#38a169"/><polygon points="70,38 48,85 92,85" fill="#2f855a"/><polygon points="50,20 40,40 50,45 60,38" fill="#edf2f7"/><circle cx="50" cy="85" r="3" fill="#22543d"/></svg>`,
  star: `<svg viewBox="0 0 100 100" class="w-full h-full"><polygon points="50,12 62,38 90,40 68,60 75,88 50,73 25,88 32,60 10,40 38,38" fill="#ecc94b" stroke="#d69e2e" stroke-width="2"/><circle cx="44" cy="48" r="3" fill="#744210"/><circle cx="56" cy="48" r="3" fill="#744210"/><path d="M47 56 Q50 60 53 56" stroke="#744210" stroke-width="2" fill="none"/></svg>`,
  coin: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="36" fill="#ecc94b" stroke="#d69e2e" stroke-width="4"/><circle cx="50" cy="50" r="26" fill="none" stroke="#d69e2e" stroke-width="2" stroke-dasharray="4 3"/><text x="50" y="58" font-size="24" font-weight="bold" fill="#b7791f" text-anchor="middle">₩</text></svg>`,
  magnifier: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="44" cy="44" r="25" fill="#ebf8ff" stroke="#3182ce" stroke-width="6"/><circle cx="44" cy="44" r="19" fill="none" stroke="#63b3ed" stroke-width="2"/><line x1="62" y1="62" x2="84" y2="84" stroke="#2b6cb0" stroke-width="9" stroke-linecap="round"/><circle cx="36" cy="36" r="4" fill="#ffffff"/></svg>`,

  // 목구멍소리
  ball: `<svg viewBox="0 0 100 100" class="w-full h-full"><circle cx="50" cy="50" r="36" fill="#ed8936"/><circle cx="38" cy="38" r="8" fill="#fbd38d"/><path d="M18 50 A36 36 0 0 1 82 50" fill="none" stroke="#dd6b20" stroke-width="3"/><path d="M50 14 A36 36 0 0 1 50 86" fill="none" stroke="#dd6b20" stroke-width="3"/></svg>`,
  watermelon: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M14 45 Q50 95 86 45 Z" fill="#38a169"/><path d="M20 45 Q50 90 80 45 Z" fill="#e53e3e"/><circle cx="36" cy="54" r="3" fill="#2d3748"/><circle cx="64" cy="54" r="3" fill="#2d3748"/><circle cx="50" cy="65" r="3" fill="#2d3748"/><circle cx="42" cy="74" r="2.5" fill="#2d3748"/><circle cx="58" cy="74" r="2.5" fill="#2d3748"/></svg>`,
  book: `<svg viewBox="0 0 100 100" class="w-full h-full"><polygon points="18,25 48,32 48,82 18,75" fill="#4299e1"/><polygon points="82,25 52,32 52,82 82,75" fill="#3182ce"/><path d="M48 32 Q50 34 52 32 L52 82 Q50 84 48 82 Z" fill="#2b6cb0"/><line x1="26" y1="42" x2="42" y2="46" stroke="#ebf8ff" stroke-width="2"/><line x1="26" y1="52" x2="42" y2="56" stroke="#ebf8ff" stroke-width="2"/><line x1="58" y1="46" x2="74" y2="42" stroke="#ebf8ff" stroke-width="2"/><line x1="58" y1="56" x2="74" y2="52" stroke="#ebf8ff" stroke-width="2"/></svg>`,
  river: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect x="15" y="20" width="70" height="60" rx="12" fill="#90cdf4"/><path d="M15 35 Q35 25 50 40 T85 30 L85 70 Q65 80 50 65 T15 75 Z" fill="#3182ce"/><circle cx="35" cy="48" r="4" fill="#ebf8ff"/><circle cx="65" cy="52" r="3" fill="#ebf8ff"/></svg>`,
  room: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect x="20" y="20" width="60" height="65" rx="8" fill="#feebc8"/><rect x="30" y="32" width="22" height="26" rx="4" fill="#90cdf4" stroke="#dd6b20" stroke-width="2"/><line x1="41" y1="32" x2="41" y2="58" stroke="#dd6b20" stroke-width="2"/><line x1="30" y1="45" x2="52" y2="45" stroke="#dd6b20" stroke-width="2"/><rect x="58" y="44" width="16" height="41" fill="#c05621"/><circle cx="62" cy="65" r="2.5" fill="#ecc94b"/></svg>`,
  ricecake: `<svg viewBox="0 0 100 100" class="w-full h-full"><ellipse cx="50" cy="70" rx="36" ry="14" fill="#edf2f7"/><ellipse cx="50" cy="55" rx="32" ry="12" fill="#fbb6ce"/><ellipse cx="50" cy="40" rx="28" ry="10" fill="#9ae6b4"/><ellipse cx="50" cy="26" rx="24" ry="8" fill="#feebc8"/></svg>`,
  pumpkin: `<svg viewBox="0 0 100 100" class="w-full h-full"><rect x="46" y="16" width="8" height="14" rx="2" fill="#2f855a"/><ellipse cx="32" cy="55" rx="18" ry="26" fill="#dd6b20"/><ellipse cx="68" cy="55" rx="18" ry="26" fill="#dd6b20"/><ellipse cx="42" cy="55" rx="18" ry="28" fill="#ed8936"/><ellipse cx="58" cy="55" rx="18" ry="28" fill="#ed8936"/><ellipse cx="50" cy="55" rx="16" ry="29" fill="#f6ad55"/></svg>`,
  bell: `<svg viewBox="0 0 100 100" class="w-full h-full"><path d="M50 18 Q30 35 28 65 L72 65 Q70 35 50 18 Z" fill="#ecc94b" stroke="#d69e2e" stroke-width="2"/><ellipse cx="50" cy="65" rx="24" ry="6" fill="#d69e2e"/><circle cx="50" cy="74" r="7" fill="#b7791f"/><circle cx="50" cy="18" r="5" fill="#b7791f"/></svg>`
};

export const SvgIllustration: React.FC<{ iconName: string; className?: string }> = ({ iconName, className = 'w-20 h-20' }) => {
  const svgHtml = RAW_SVG_MAP[iconName] || RAW_SVG_MAP.bear;
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
};
