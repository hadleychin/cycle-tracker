import { 
  calculatePhases, 
  predictNextCycleStart, 
  getPhaseForDate,
  formatDate,
  addDays,
  parseDate,
  isSameDay
} from '../CycleEngine';
import { CycleSettings } from '../../types';

describe('CycleEngine', () => {
  // Test settings with default values
  const defaultSettings: CycleSettings = {
    cycleLength: 28,
    lutealLength: 14,
    menstrualLength: 5
  };

  describe('calculatePhases', () => {
    it('should calculate all phases correctly for default settings', () => {
      const startDate = '2023-01-01';
      const phases = calculatePhases(startDate, defaultSettings);
      
      // Should have 4 phases
      expect(phases.length).toBe(4);
      
      // Menstrual phase should be 5 days (Day 1-5)
      expect(phases[0].phase).toBe('menstrual');
      expect(phases[0].startDate).toBe('2023-01-01');
      expect(phases[0].endDate).toBe('2023-01-05');
      
      // Follicular phase should be days 6-14
      expect(phases[1].phase).toBe('follicular');
      expect(phases[1].startDate).toBe('2023-01-06');
      expect(phases[1].endDate).toBe('2023-01-14');
      
      // Ovulation day should be day 15
      expect(phases[2].phase).toBe('ovulation');
      expect(phases[2].startDate).toBe('2023-01-15');
      expect(phases[2].endDate).toBe('2023-01-15');
      
      // Luteal phase should be days 16-28
      expect(phases[3].phase).toBe('luteal');
      expect(phases[3].startDate).toBe('2023-01-16');
      expect(phases[3].endDate).toBe('2023-01-28');
    });
    
    it('should handle when follicular phase is very short or non-existent', () => {
      const shortSettings: CycleSettings = {
        cycleLength: 21,
        lutealLength: 14,
        menstrualLength: 7
      };
      
      const startDate = '2023-01-01';
      const phases = calculatePhases(startDate, shortSettings);
      
      // In this case, menstruation is 7 days and ovulation is on day 8,
      // so there's no follicular phase
      expect(phases.length).toBe(3);
      
      // Check that we go straight from menstrual to ovulation
      expect(phases[0].phase).toBe('menstrual');
      expect(phases[0].endDate).toBe('2023-01-07');
      expect(phases[1].phase).toBe('ovulation');
      expect(phases[1].startDate).toBe('2023-01-08');
    });
  });

  describe('predictNextCycleStart', () => {
    it('should correctly predict the next cycle start date', () => {
      const startDate = '2023-01-01';
      const nextStart = predictNextCycleStart(startDate, 28);
      expect(nextStart).toBe('2023-01-29');
    });
    
    it('should handle different cycle lengths', () => {
      const startDate = '2023-01-01';
      expect(predictNextCycleStart(startDate, 21)).toBe('2023-01-22');
      expect(predictNextCycleStart(startDate, 35)).toBe('2023-02-05');
    });
  });

  describe('getPhaseForDate', () => {
    it('should correctly identify the phase for a given date', () => {
      const startDate = '2023-01-01';
      const phases = calculatePhases(startDate, defaultSettings);
      
      // Check different parts of the cycle
      expect(getPhaseForDate('2023-01-01', phases)).toBe('menstrual'); // First day
      expect(getPhaseForDate('2023-01-05', phases)).toBe('menstrual'); // Last menstrual day
      expect(getPhaseForDate('2023-01-10', phases)).toBe('follicular'); 
      expect(getPhaseForDate('2023-01-15', phases)).toBe('ovulation');
      expect(getPhaseForDate('2023-01-20', phases)).toBe('luteal');
      expect(getPhaseForDate('2023-01-28', phases)).toBe('luteal'); // Last day of cycle
      
      // Date outside the cycle
      expect(getPhaseForDate('2023-01-29', phases)).toBeNull();
    });
  });

  describe('dateUtils', () => {
    it('should correctly format date', () => {
      const date = new Date('2023-01-15');
      expect(formatDate(date)).toBe('2023-01-15');
    });
    
    it('should correctly add days to a date', () => {
      const date = new Date('2023-01-15');
      const newDate = addDays(date, 5);
      expect(formatDate(newDate)).toBe('2023-01-20');
      
      // Add negative days
      const prevDate = addDays(date, -3);
      expect(formatDate(prevDate)).toBe('2023-01-12');
    });
    
    it('should correctly parse date strings', () => {
      const dateStr = '2023-01-15';
      const date = parseDate(dateStr);
      expect(date instanceof Date).toBe(true);
      expect(date.getFullYear()).toBe(2023);
      expect(date.getMonth()).toBe(0); // January is 0
      expect(date.getDate()).toBe(15);
    });
    
    it('should correctly check if two dates are the same day', () => {
      expect(isSameDay('2023-01-15', '2023-01-15')).toBe(true);
      expect(isSameDay('2023-01-15', '2023-01-16')).toBe(false);
      expect(isSameDay('2023-01-15T12:00:00.000Z', '2023-01-15')).toBe(true);
    });
  });
}); 