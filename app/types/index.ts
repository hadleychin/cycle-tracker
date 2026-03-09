export type CycleSettings = {
  cycleLength: number;
  lutealLength: number;
  menstrualLength: number;
};

export type PhaseType = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type PhaseRange = {
  startDate: string; // ISO string
  endDate: string; // ISO string
  phase: PhaseType;
};

export type CycleData = {
  settings: CycleSettings;
  lastCycleStart: string | null; // ISO string
  nextPredictedStart: string | null; // ISO string
  phases: PhaseRange[];
};

export type DayLog = {
  date: string; // ISO string
  temperature?: number;
  mood?: string;
  symptoms?: string[];
  notes?: string;
  isMenstrualConfirmed?: boolean;
};

export type AppData = {
  cycle: CycleData;
  logs: Record<string, DayLog>; // date string as key (YYYY-MM-DD)
  isOnboarded: boolean;
}; 