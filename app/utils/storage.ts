import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, CycleSettings, DayLog } from '../types';
import { calculatePhases, formatDate, predictNextCycleStart } from './CycleEngine';

const STORAGE_KEY = 'my-cycle-data';

const DEFAULT_SETTINGS: CycleSettings = {
  cycleLength: 28,
  lutealLength: 14,
  menstrualLength: 5,
};

const DEFAULT_APP_DATA: AppData = {
  cycle: {
    settings: DEFAULT_SETTINGS,
    lastCycleStart: null,
    nextPredictedStart: null,
    phases: [],
  },
  logs: {},
  isOnboarded: false,
};

/**
 * Gets all app data from AsyncStorage
 */
export const getAppData = async (): Promise<AppData> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue ? JSON.parse(jsonValue) : DEFAULT_APP_DATA;
  } catch (error) {
    console.error('Error getting app data:', error);
    return DEFAULT_APP_DATA;
  }
};

/**
 * Saves all app data to AsyncStorage
 */
export const saveAppData = async (data: AppData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving app data:', error);
  }
};

/**
 * Initializes or updates cycle with settings and optional start date
 */
export const saveCycleSettings = async (
  settings: CycleSettings,
  cycleStartDate?: string
): Promise<AppData> => {
  const appData = await getAppData();
  const startDate = cycleStartDate || appData.cycle.lastCycleStart;
  
  let updatedAppData = {
    ...appData,
    cycle: {
      ...appData.cycle,
      settings,
    },
    isOnboarded: true,
  };

  // If we have a cycle start date, calculate phases
  if (startDate) {
    const phases = calculatePhases(startDate, settings);
    const nextPredictedStart = predictNextCycleStart(startDate, settings.cycleLength);
    
    updatedAppData = {
      ...updatedAppData,
      cycle: {
        ...updatedAppData.cycle,
        lastCycleStart: startDate,
        nextPredictedStart,
        phases,
      },
    };
  }

  await saveAppData(updatedAppData);
  return updatedAppData;
};

/**
 * Logs a menstrual start and recalculates cycle phases
 */
export const logMenstrualStart = async (date: string): Promise<AppData> => {
  const appData = await getAppData();
  const formattedDate = formatDate(new Date(date));
  
  // Create or update the log for this day
  const existingLog = appData.logs[formattedDate] || { date: formattedDate };
  const updatedLog: DayLog = {
    ...existingLog,
    isMenstrualConfirmed: true,
  };
  
  // Calculate new phases and next prediction
  const phases = calculatePhases(formattedDate, appData.cycle.settings);
  const nextPredictedStart = predictNextCycleStart(
    formattedDate,
    appData.cycle.settings.cycleLength
  );
  
  const updatedAppData: AppData = {
    ...appData,
    cycle: {
      ...appData.cycle,
      lastCycleStart: formattedDate,
      nextPredictedStart,
      phases,
    },
    logs: {
      ...appData.logs,
      [formattedDate]: updatedLog,
    },
  };
  
  await saveAppData(updatedAppData);
  return updatedAppData;
};

/**
 * Saves a day log
 */
export const saveDayLog = async (log: DayLog): Promise<AppData> => {
  const appData = await getAppData();
  const formattedDate = formatDate(new Date(log.date));
  
  const updatedAppData: AppData = {
    ...appData,
    logs: {
      ...appData.logs,
      [formattedDate]: log,
    },
  };
  
  await saveAppData(updatedAppData);
  return updatedAppData;
};

/**
 * Gets a day log by date
 */
export const getDayLog = async (date: string): Promise<DayLog | null> => {
  const appData = await getAppData();
  const formattedDate = formatDate(new Date(date));
  return appData.logs[formattedDate] || null;
}; 