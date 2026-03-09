import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Headline, Card, useTheme, Button, TextInput, Checkbox } from 'react-native-paper';
import { Calendar, DateData } from 'react-native-calendars';
import { useCycle } from '../context/CycleContext';
import { formatDate, getPhaseForDate, isSameDay } from '../utils/CycleEngine';
import { DayLog, PhaseType } from '../types';

const SYMPTOMS = [
  'Cramps', 
  'Headache', 
  'Bloating', 
  'Fatigue', 
  'Mood Swings',
  'Breast Tenderness',
  'Nausea',
  'Acne'
];

const MOODS = [
  'Happy', 
  'Anxious', 
  'Irritable', 
  'Calm', 
  'Energized',
  'Low Energy',
  'Focused',
  'Distracted'
];

const HomeScreen = () => {
  const theme = useTheme();
  const { appData, saveDayLog, logMenstrualStart, getDayLog } = useCycle();
  
  const [selectedDate, setSelectedDate] = useState<string>(formatDate(new Date()));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dayDetails, setDayDetails] = useState<DayLog | null>(null);
  
  // Temp form data for the modal
  const [temperature, setTemperature] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [isMenstrualDay, setIsMenstrualDay] = useState(false);
  
  // Load day details whenever selected date changes
  useEffect(() => {
    const loadDayDetails = async () => {
      const details = await getDayLog(selectedDate);
      setDayDetails(details);
      
      // Initialize form with existing data
      if (details) {
        setTemperature(details.temperature ? details.temperature.toString() : '');
        setNotes(details.notes || '');
        setSelectedMood(details.mood || '');
        setSelectedSymptoms(details.symptoms || []);
        setIsMenstrualDay(!!details.isMenstrualConfirmed);
      } else {
        // Reset form
        setTemperature('');
        setNotes('');
        setSelectedMood('');
        setSelectedSymptoms([]);
        setIsMenstrualDay(false);
      }
    };
    
    loadDayDetails();
  }, [selectedDate, getDayLog]);
  
  // Prepare calendar marking data
  const getMarkedDates = () => {
    const markedDates: any = {};
    const today = formatDate(new Date());
    
    // Today's date (regardless of phases)
    markedDates[today] = {
      selected: selectedDate === today,
      selectedColor: theme.colors.primary,
      marked: true,
      dotColor: '#000'
    };
    
    // Mark phases with their colors
    appData.cycle.phases.forEach(phase => {
      const phaseStartDate = new Date(phase.startDate);
      const phaseEndDate = new Date(phase.endDate);
      const currentDate = new Date(phaseStartDate);
      
      while (currentDate <= phaseEndDate) {
        const dateString = formatDate(currentDate);
        let dotColor = '';
        let bgColor = '';
        
        switch (phase.phase) {
          case 'menstrual':
            dotColor = '#FF6B6B';
            bgColor = theme.colors.menstrual;
            break;
          case 'follicular':
            dotColor = '#4D96FF';
            bgColor = theme.colors.follicular;
            break;
          case 'ovulation':
            dotColor = '#FFD166';
            bgColor = theme.colors.ovulation;
            break;
          case 'luteal':
            dotColor = '#9C6ADE';
            bgColor = theme.colors.luteal;
            break;
        }
        
        markedDates[dateString] = {
          ...markedDates[dateString],
          selected: dateString === selectedDate,
          selectedColor: theme.colors.primary,
          marked: true,
          dotColor: dotColor,
          customStyles: {
            container: {
              backgroundColor: dateString === selectedDate ? theme.colors.primary : bgColor,
              borderRadius: 5
            },
            text: {
              color: dateString === selectedDate ? '#fff' : '#000'
            }
          }
        };
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    return markedDates;
  };
  
  const handleDateSelect = (date: DateData) => {
    setSelectedDate(date.dateString);
    setIsModalVisible(true);
  };
  
  const handleSave = async () => {
    const dayLog: DayLog = {
      date: selectedDate,
      temperature: temperature ? parseFloat(temperature) : undefined,
      mood: selectedMood || undefined,
      symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : undefined,
      notes: notes || undefined,
      isMenstrualConfirmed: isMenstrualDay,
    };
    
    // If marked as menstrual day and it's a new marking, update cycle
    if (isMenstrualDay && (!dayDetails || !dayDetails.isMenstrualConfirmed)) {
      await logMenstrualStart(selectedDate);
    } else {
      // Just save the day log
      await saveDayLog(dayLog);
    }
    
    setIsModalVisible(false);
  };
  
  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };
  
  const getPhaseText = (): string => {
    const phase = getPhaseForDate(selectedDate, appData.cycle.phases);
    if (!phase) return 'Not in tracked cycle';
    
    switch(phase) {
      case 'menstrual': return 'Menstrual Phase';
      case 'follicular': return 'Follicular Phase';
      case 'ovulation': return 'Ovulation Day';
      case 'luteal': return 'Luteal Phase';
      default: return '';
    }
  };
  
  const getColorForPhase = (phase: PhaseType | null): string => {
    if (!phase) return '#ccc';
    
    switch(phase) {
      case 'menstrual': return theme.colors.menstrual;
      case 'follicular': return theme.colors.follicular;
      case 'ovulation': return theme.colors.ovulation;
      case 'luteal': return theme.colors.luteal;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          markingType={'custom'}
          markedDates={getMarkedDates()}
          enableSwipeMonths={true}
          theme={{
            todayTextColor: theme.colors.primary,
            arrowColor: theme.colors.primary,
          }}
        />
      </View>
      
      {appData.cycle.nextPredictedStart && (
        <Card style={styles.predictionCard}>
          <Card.Content>
            <Text style={styles.predictionText}>
              Next cycle predicted to start around:
            </Text>
            <Text style={styles.dateText}>
              {new Date(appData.cycle.nextPredictedStart).toLocaleDateString()}
            </Text>
          </Card.Content>
        </Card>
      )}
      
      {/* Day Details Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.modalScroll}>
              <View style={styles.modalHeader}>
                <Headline style={styles.dateTitle}>
                  {new Date(selectedDate).toDateString()}
                </Headline>
                <Text style={[
                  styles.phaseText, 
                  { backgroundColor: getColorForPhase(getPhaseForDate(selectedDate, appData.cycle.phases)) }
                ]}>
                  {getPhaseText()}
                </Text>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Morning Temperature</Text>
                <TextInput
                  mode="outlined"
                  label="Temperature (°F)"
                  value={temperature}
                  onChangeText={setTemperature}
                  keyboardType="decimal-pad"
                  style={styles.input}
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Mood</Text>
                <View style={styles.chipsContainer}>
                  {MOODS.map(mood => (
                    <TouchableOpacity
                      key={mood}
                      style={[
                        styles.chip,
                        selectedMood === mood && { backgroundColor: theme.colors.primary }
                      ]}
                      onPress={() => setSelectedMood(mood === selectedMood ? '' : mood)}
                    >
                      <Text style={selectedMood === mood ? styles.selectedChipText : styles.chipText}>
                        {mood}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Symptoms</Text>
                <View style={styles.chipsContainer}>
                  {SYMPTOMS.map(symptom => (
                    <TouchableOpacity
                      key={symptom}
                      style={[
                        styles.chip,
                        selectedSymptoms.includes(symptom) && { backgroundColor: theme.colors.primary }
                      ]}
                      onPress={() => toggleSymptom(symptom)}
                    >
                      <Text style={selectedSymptoms.includes(symptom) ? styles.selectedChipText : styles.chipText}>
                        {symptom}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <TextInput
                  mode="outlined"
                  label="Notes"
                  value={notes}
                  onChangeText={setNotes}
                  multiline={true}
                  numberOfLines={4}
                  style={styles.input}
                />
              </View>
              
              <View style={styles.formSection}>
                <View style={styles.checkboxRow}>
                  <Checkbox
                    status={isMenstrualDay ? 'checked' : 'unchecked'}
                    onPress={() => setIsMenstrualDay(!isMenstrualDay)}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.checkboxLabel}>Mark as first day of period</Text>
                </View>
                <Text style={styles.checkboxHint}>
                  This will update your cycle tracking
                </Text>
              </View>
              
              <View style={styles.buttonRow}>
                <Button 
                  mode="outlined"
                  onPress={() => setIsModalVisible(false)}
                  style={styles.button}
                >
                  Cancel
                </Button>
                <Button 
                  mode="contained"
                  onPress={handleSave}
                  style={[styles.button, { backgroundColor: theme.colors.primary }]}
                >
                  Save
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  calendarContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  predictionCard: {
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: '#FFF4D3', // Light yellow like ovulation
  },
  predictionText: {
    fontSize: 14,
    color: '#635D50',
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4639',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    maxHeight: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalScroll: {
    padding: 20,
  },
  modalHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  dateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phaseText: {
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  chip: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
  },
  chipText: {
    color: '#333',
  },
  selectedChipText: {
    color: '#fff',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  checkboxHint: {
    fontSize: 12,
    color: '#888',
    marginLeft: 30,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default HomeScreen; 