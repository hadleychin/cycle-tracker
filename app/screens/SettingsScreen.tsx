import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Title, Divider, List, Button, useTheme } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { useCycle } from '../context/CycleContext';

const SettingsScreen = () => {
  const theme = useTheme();
  const { appData, saveCycleSettings } = useCycle();
  
  const [cycleLength, setCycleLength] = useState(appData.cycle.settings.cycleLength);
  const [lutealLength, setLutealLength] = useState(appData.cycle.settings.lutealLength);
  const [menstrualLength, setMenstrualLength] = useState(appData.cycle.settings.menstrualLength);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const handleCycleLengthChange = (value: number) => {
    setCycleLength(value);
    setHasUnsavedChanges(true);
  };
  
  const handleLutealLengthChange = (value: number) => {
    setLutealLength(value);
    setHasUnsavedChanges(true);
  };
  
  const handleMenstrualLengthChange = (value: number) => {
    setMenstrualLength(value);
    setHasUnsavedChanges(true);
  };
  
  const saveSettings = async () => {
    const settings = {
      cycleLength,
      lutealLength,
      menstrualLength,
    };
    
    await saveCycleSettings(settings);
    setHasUnsavedChanges(false);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Title style={styles.title}>Settings</Title>
        
        <List.Section>
          <List.Subheader>Cycle Parameters</List.Subheader>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Cycle Length: {cycleLength} days</Text>
            <Text style={styles.settingDescription}>
              The average number of days in your menstrual cycle
            </Text>
            <Slider
              style={styles.slider}
              value={cycleLength}
              minimumValue={14}
              maximumValue={42}
              step={1}
              onValueChange={handleCycleLengthChange}
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
          
          <Divider style={styles.divider} />
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Luteal Phase Length: {lutealLength} days</Text>
            <Text style={styles.settingDescription}>
              The time from ovulation until your next period
            </Text>
            <Slider
              style={styles.slider}
              value={lutealLength}
              minimumValue={7}
              maximumValue={21}
              step={1}
              onValueChange={handleLutealLengthChange}
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
          
          <Divider style={styles.divider} />
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Period Length: {menstrualLength} days</Text>
            <Text style={styles.settingDescription}>
              How many days your period typically lasts
            </Text>
            <Slider
              style={styles.slider}
              value={menstrualLength}
              minimumValue={2}
              maximumValue={14}
              step={1}
              onValueChange={handleMenstrualLengthChange}
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
        </List.Section>
        
        <List.Section>
          <List.Subheader>App Information</List.Subheader>
          <List.Item
            title="Version"
            description="1.0.0"
            left={props => <List.Icon {...props} icon="information" />}
          />
          <List.Item
            title="Data Storage"
            description="All data is stored locally on your device"
            left={props => <List.Icon {...props} icon="database" />}
          />
        </List.Section>
        
        {hasUnsavedChanges && (
          <Button 
            mode="contained" 
            onPress={saveSettings}
            style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
          >
            Save Changes
          </Button>
        )}
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  settingItem: {
    marginVertical: 10,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 10,
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
  divider: {
    marginVertical: 10,
  },
  saveButton: {
    marginTop: 30,
    marginBottom: 20,
  },
});

export default SettingsScreen; 