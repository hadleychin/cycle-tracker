import { CycleSettings, PhaseRange, PhaseType } from '../types';

/**
 * Adds days to a date and returns a new date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Formats a date to YYYY-MM-DD string
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Creates a date from YYYY-MM-DD string
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Calculates all cycle phases based on cycle start date and settings
 */
export const calculatePhases = (
  startDate: string, 
  settings: CycleSettings
): PhaseRange[] => {
  const { cycleLength, lutealLength, menstrualLength } = settings;
  const ovulationDay = cycleLength - lutealLength + 1; // 1-indexed day in cycle
  
  const startDateObj = parseDate(startDate);
  const phases: PhaseRange[] = [];

  // Menstrual phase
  const menstrualEndDateObj = addDays(startDateObj, menstrualLength - 1);
  phases.push({
    startDate: formatDate(startDateObj),
    endDate: formatDate(menstrualEndDateObj),
    phase: 'menstrual'
  });

  // Follicular phase (if there's any days between menstruation end and ovulation)
  if (ovulationDay - 1 > menstrualLength) {
    const follicularStartDateObj = addDays(menstrualEndDateObj, 1);
    const follicularEndDateObj = addDays(startDateObj, ovulationDay - 2); // Day before ovulation
    phases.push({
      startDate: formatDate(follicularStartDateObj),
      endDate: formatDate(follicularEndDateObj),
      phase: 'follicular'
    });
  }

  // Ovulation phase (just one day for simplicity)
  const ovulationDateObj = addDays(startDateObj, ovulationDay - 1);
  phases.push({
    startDate: formatDate(ovulationDateObj),
    endDate: formatDate(ovulationDateObj),
    phase: 'ovulation'
  });

  // Luteal phase
  const lutealStartDateObj = addDays(ovulationDateObj, 1);
  const lutealEndDateObj = addDays(startDateObj, cycleLength - 1);
  phases.push({
    startDate: formatDate(lutealStartDateObj),
    endDate: formatDate(lutealEndDateObj),
    phase: 'luteal'
  });

  return phases;
};

/**
 * Predicts the next cycle start date based on the last cycle start and cycle length
 */
export const predictNextCycleStart = (
  lastCycleStart: string,
  cycleLength: number
): string => {
  const startDateObj = parseDate(lastCycleStart);
  const nextStartDateObj = addDays(startDateObj, cycleLength);
  return formatDate(nextStartDateObj);
};

/**
 * Gets the phase for a specific date
 */
export const getPhaseForDate = (
  date: string,
  phases: PhaseRange[]
): PhaseType | null => {
  const dateObj = parseDate(date);
  
  for (const phase of phases) {
    const phaseStartObj = parseDate(phase.startDate);
    const phaseEndObj = parseDate(phase.endDate);
    
    if (dateObj >= phaseStartObj && dateObj <= phaseEndObj) {
      return phase.phase;
    }
  }
  
  return null;
};

/**
 * Determines if two dates are the same day
 */
export const isSameDay = (date1: string, date2: string): boolean => {
  return date1.split('T')[0] === date2.split('T')[0];
}; 