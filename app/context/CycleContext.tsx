import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppData, CycleSettings, DayLog } from '../types';
import * as Storage from '../utils/storage';

type CycleContextType = {
  appData: AppData;
  isLoading: boolean;
  saveCycleSettings: (settings: CycleSettings, cycleStartDate?: string) => Promise<void>;
  logMenstrualStart: (date: string) => Promise<void>;
  saveDayLog: (log: DayLog) => Promise<void>;
  getDayLog: (date: string) => Promise<DayLog | null>;
};

const defaultContext: CycleContextType = {
  appData: {
    cycle: {
      settings: {
        cycleLength: 28,
        lutealLength: 14,
        menstrualLength: 5,
      },
      lastCycleStart: null,
      nextPredictedStart: null,
      phases: [],
    },
    logs: {},
    isOnboarded: false,
  },
  isLoading: true,
  saveCycleSettings: async () => {},
  logMenstrualStart: async () => {},
  saveDayLog: async () => {},
  getDayLog: async () => null,
};

const CycleContext = createContext<CycleContextType>(defaultContext);

export const useCycle = () => useContext(CycleContext);

export const CycleProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [appData, setAppData] = useState<AppData>(defaultContext.appData);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on initial mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await Storage.getAppData();
        setAppData(data);
      } catch (error) {
        console.error('Failed to load app data', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveCycleSettings = async (
    settings: CycleSettings,
    cycleStartDate?: string
  ) => {
    const updatedData = await Storage.saveCycleSettings(settings, cycleStartDate);
    setAppData(updatedData);
  };

  const handleLogMenstrualStart = async (date: string) => {
    const updatedData = await Storage.logMenstrualStart(date);
    setAppData(updatedData);
  };

  const handleSaveDayLog = async (log: DayLog) => {
    const updatedData = await Storage.saveDayLog(log);
    setAppData(updatedData);
  };

  const handleGetDayLog = async (date: string) => {
    return Storage.getDayLog(date);
  };

  const value = {
    appData,
    isLoading,
    saveCycleSettings: handleSaveCycleSettings,
    logMenstrualStart: handleLogMenstrualStart,
    saveDayLog: handleSaveDayLog,
    getDayLog: handleGetDayLog,
  };

  return (
    <CycleContext.Provider value={value}>
      {children}
    </CycleContext.Provider>
  );
}; 