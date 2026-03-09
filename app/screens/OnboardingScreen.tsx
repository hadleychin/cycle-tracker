import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput, Title, Subheading, useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useCycle } from '../context/CycleContext';
import { formatDate } from '../utils/CycleEngine';

const OnboardingScreen = () => {
  const theme = useTheme();
  const { saveCycleSettings } = useCycle();
  
  const [cycleLength, setCycleLength] = useState(28);
  const [lutealLength, setLutealLength] = useState(14);
  const [menstrualLength, setMenstrualLength] = useState(5);
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [dateInputVisible, setDateInputVisible] = useState(false);
  
  const handleSave = async () => {
    const settings = {
      cycleLength,
      lutealLength,
      menstrualLength,
    };
    
    // If last period date was entered, use it; otherwise just save settings
    await saveCycleSettings(settings, lastPeriodDate || undefined);
  };
  
  const handleDateChange = (text: string) => {
    setLastPeriodDate(text);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={[styles.title, { color: theme.colors.primary }]}>Welcome to MyCycle</Title>
        <Subheading style={styles.subtitle}>
          Let's personalize your cycle tracking experience
        </Subheading>
        
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>Cycle Length: {cycleLength} days</Text>
          <Text style={styles.settingDescription}>
            This is the average length of your menstrual cycle from the first day of one period to the day before your next period.
          </Text>
          <Slider
            style={styles.slider}
            value={cycleLength}
            minimumValue={14}
            maximumValue={42}
            step={1}
            onValueChange={value => setCycleLength(value)}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={theme.colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text>14</Text>
            <Text>28</Text>
            <Text>42</Text>
          </View>
        </View>
        
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>Luteal Phase Length: {lutealLength} days</Text>
          <Text style={styles.settingDescription}>
            This is the time from ovulation until the day before your next period. The average is 14 days.
          </Text>
          <Slider
            style={styles.slider}
            value={lutealLength}
            minimumValue={7}
            maximumValue={21}
            step={1}
            onValueChange={value => setLutealLength(value)}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={theme.colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text>7</Text>
            <Text>14</Text>
            <Text>21</Text>
          </View>
        </View>
        
        <View style={styles.settingContainer}>
          <Text style={styles.settingLabel}>Period Length: {menstrualLength} days</Text>
          <Text style={styles.settingDescription}>
            How many days does your period typically last?
          </Text>
          <Slider
            style={styles.slider}
            value={menstrualLength}
            minimumValue={2}
            maximumValue={14}
            step={1}
            onValueChange={value => setMenstrualLength(value)}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor={theme.colors.primary}
          />
          <View style={styles.sliderLabels}>
            <Text>2</Text>
            <Text>7</Text>
            <Text>14</Text>
          </View>
        </View>
        
        <Button 
          mode="text" 
          onPress={() => setDateInputVisible(!dateInputVisible)}
          style={styles.dateButton}
          labelStyle={{ color: theme.colors.primary }}
        >
          {dateInputVisible ? "Skip Last Period Date" : "Enter Last Period Date"}
        </Button>
        
        {dateInputVisible && (
          <View style={styles.dateInputContainer}>
            <Text style={styles.settingLabel}>Last Period Start Date</Text>
            <Text style={styles.settingDescription}>
              Enter the first day of your most recent period (YYYY-MM-DD)
            </Text>
            <TextInput
              style={styles.input}
              value={lastPeriodDate}
              onChangeText={handleDateChange}
              placeholder="YYYY-MM-DD"
              keyboardType="default"
              autoCapitalize="none"
            />
            <Text style={styles.dateHint}>
              Example: {formatDate(new Date())}
            </Text>
          </View>
        )}
        
        <Button 
          mode="contained" 
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
        >
          Save & Continue
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  settingContainer: {
    marginBottom: 24,
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  slider: {
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -10,
  },
  dateButton: {
    marginVertical: 10,
  },
  dateInputContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  input: {
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: '#fff',
  },
  dateHint: {
    fontSize: 12,
    color: '#888',
  },
  saveButton: {
    marginTop: 30,
    marginBottom: 50,
    paddingVertical: 8,
  },
});

export default OnboardingScreen; 