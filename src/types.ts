export type ArticulationType = 'lip' | 'tongue' | 'throat';

export type GameMode = 'A' | 'B'; // 'A': [가] 일반 모드 (7지선다), 'B': [나] 촉구 모드 (2지선다 + 시각적 반짝임 촉구)

export type SpeedMode = 'slow' | 'normal' | 'fast';

export interface WordMission {
  id: string;
  category: ArticulationType;
  word: string;
  prefix?: string;
  targetOnset: string;
  final: string;
  suffix?: string;
  iconName: string;
  hintText: string;
}

export interface Player {
  id: number;
  name: string;
  avatarIcon: string; // e.g. '🐶', '🐱', '🐻', '🐰'
  avatarLabel: string; // e.g. '강아지', '고양이', '곰돌이'
  pos: number;
  score: number;
  color: string;
  tokenBg: string;
}

export interface AvatarOption {
  id: string;
  icon: string;
  label: string;
  category: 'animal' | 'explorer';
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'dog', icon: '🐶', label: '강아지', category: 'animal' },
  { id: 'cat', icon: '🐱', label: '고양이', category: 'animal' },
  { id: 'bear', icon: '🐻', label: '곰돌이', category: 'animal' },
  { id: 'rabbit', icon: '🐰', label: '토끼', category: 'animal' },
  { id: 'fox', icon: '🦊', label: '사막여우', category: 'animal' },
  { id: 'panda', icon: '🐼', label: '판다', category: 'animal' },
  { id: 'lion', icon: '🦁', label: '아기사자', category: 'animal' },
  { id: 'koala', icon: '🐨', label: '코알라', category: 'animal' },
  { id: 'explorer', icon: '🧭', label: '탐험대원', category: 'explorer' },
  { id: 'rocket', icon: '🚀', label: '우주대원', category: 'explorer' },
  { id: 'hero', icon: '🦸', label: '꼬마영웅', category: 'explorer' },
  { id: 'crown', icon: '👑', label: '훈민수호자', category: 'explorer' },
];

export interface TrackTile {
  index: number;
  type: 'start' | 'lip' | 'tongue' | 'throat' | 'event';
  label: string;
  badge: string;
  eventType?: 'forward1' | 'back1' | 'clap';
  desc?: string;
}

export interface TeacherSettings {
  speed: SpeedMode; // 'slow': 650ms, 'normal': 320ms, 'fast': 140ms
  ttsEnabled: boolean;
  soundEnabled: boolean;
  targetScore: number;
}
