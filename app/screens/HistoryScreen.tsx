import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import { useCycle } from '../context/CycleContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface CycleStat {
  startDate: string;
  endDate: string;
  length: number;
}

const HistoryScreen = () => {
  const theme = useTheme();
  const { appData } = useCycle();
  
  const [cycleStats, setCycleStats] = useState<CycleStat[]>([]);
  const [averageCycleLength, setAverageCycleLength] = useState<number | null>(null);
  const [averageMenstrualLength, setAverageMenstrualLength] = useState<number | null>(null);
  
  useEffect(() => {
    calculateStats();
  }, [appData]);
  
  const calculateStats = () => {
    // Find confirmed menstrual days
    const menstrualDays = Object.values(appData.logs)
      .filter(log => log.isMenstrualConfirmed)
      .map(log => new Date(log.date))
      .sort((a, b) => a.getTime() - b.getTime());
    
    if (menstrualDays.length < 2) {
      // Not enough data for cycle stats
      return;
    }
    
    // Calculate cycle lengths
    const cycles: CycleStat[] = [];
    
    for (let i = 0; i < menstrualDays.length - 1; i++) {
      const startDate = menstrualDays[i];
      const endDate = new Date(menstrualDays[i + 1]);
      const dayBefore = new Date(endDate);
      dayBefore.setDate(dayBefore.getDate() - 1);
      
      const cycleLength = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      cycles.push({
        startDate: startDate.toISOString().split('T')[0],
        endDate: dayBefore.toISOString().split('T')[0],
        length: cycleLength,
      });
    }
    
    setCycleStats(cycles);
    
    // Calculate averages
    if (cycles.length > 0) {
      const totalLength = cycles.reduce((sum, cycle) => sum + cycle.length, 0);
      setAverageCycleLength(Math.round(totalLength / cycles.length));
    }
    
    // For menstrual length, we use the settings as a proxy since actual menstrual end 
    // is not tracked in the current design
    setAverageMenstrualLength(appData.cycle.settings.menstrualLength);
  };
  
  const exportData = async () => {
    try {
      // Create a CSV of all logs
      let csvContent = 'Date,Phase,Temperature,Mood,Symptoms,Notes,IsMenstrualStart\n';
      
      Object.values(appData.logs).forEach(log => {
        const date = log.date;
        const phase = appData.cycle.phases.find(p => {
          const logDate = new Date(date);
          const startDate = new Date(p.startDate);
          const endDate = new Date(p.endDate);
          return logDate >= startDate && logDate <= endDate;
        })?.phase || 'unknown';
        
        // Format symptoms as comma-separated string
        const symptoms = log.symptoms ? log.symptoms.join('; ') : '';
        
        // Clean notes for CSV (replace commas and quotes)
        const notes = log.notes ? log.notes.replace(/,/g, ';').replace(/"/g, '""') : '';
        
        csvContent += `${date},${phase},${log.temperature || ''},${log.mood || ''},"${symptoms}","${notes}",${log.isMenstrualConfirmed ? 'Yes' : 'No'}\n`;
      });
      
      // Add settings info at the end
      csvContent += '\nSettings\n';
      csvContent += `Cycle Length,${appData.cycle.settings.cycleLength}\n`;
      csvContent += `Luteal Length,${appData.cycle.settings.lutealLength}\n`;
      csvContent += `Menstrual Length,${appData.cycle.settings.menstrualLength}\n`;
      
      // Save to a temporary file
      const fileName = `mycycle_export_${new Date().toISOString().split('T')[0]}.csv`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, csvContent);
      
      // Share the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Export Failed', 'There was an error exporting your data');
    }
  };
  
  const getDateString = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.pageTitle}>Cycle History</Title>
        
        {appData.cycle.lastCycleStart && (
          <Card style={styles.statsCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Current Cycle</Title>
              <Paragraph>
                Started on: {getDateString(appData.cycle.lastCycleStart)}
              </Paragraph>
              {appData.cycle.nextPredictedStart && (
                <Paragraph>
                  Predicted to end: {getDateString(appData.cycle.nextPredictedStart)}
                </Paragraph>
              )}
            </Card.Content>
          </Card>
        )}
        
        {averageCycleLength && (
          <Card style={styles.statsCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Cycle Statistics</Title>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{averageCycleLength}</Text>
                  <Text style={styles.statLabel}>Avg. Cycle Length</Text>
                  <Text style={styles.statUnit}>days</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{averageMenstrualLength}</Text>
                  <Text style={styles.statLabel}>Avg. Period Length</Text>
                  <Text style={styles.statUnit}>days</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
        
        <Card style={styles.historyCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Cycle Start Dates</Title>
            {cycleStats.length > 0 ? (
              cycleStats.map((cycle, index) => (
                <View key={index} style={styles.cycleItem}>
                  <View style={styles.dateBlock}>
                    <Text style={styles.dateText}>{getDateString(cycle.startDate)}</Text>
                    <Text style={styles.durationText}>{cycle.length} days</Text>
                  </View>
                </View>
              ))
            ) : (
              <Paragraph style={styles.noDataText}>
                {appData.cycle.lastCycleStart 
                  ? 'Track at least two cycles to see cycle statistics'
                  : 'No cycles recorded yet'}
              </Paragraph>
            )}
          </Card.Content>
        </Card>
        
        <Button 
          mode="contained"
          onPress={exportData}
          style={[styles.exportButton, { backgroundColor: theme.colors.primary }]}
          icon="export"
        >
          Export Data (CSV)
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  historyCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#eee',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  statUnit: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  cycleItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dateBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
  },
  durationText: {
    fontSize: 14,
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  exportButton: {
    marginTop: 20,
    marginBottom: 40,
  },
});

export default HistoryScreen; 