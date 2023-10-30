import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const GOOD_WAVE_THRESHOLD = 1;

export default function App() {
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    fetch('https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=5842041f4e65fad6a7708d9b')
      .then(response => response.json())
      .then(data => {
        const groupedByDay = groupDataByDay(data.data.wave);
        setDailyData(groupedByDay);
      })
      .catch(error => console.error(error));
  }, []);

  const groupDataByDay = data => {
    const groupedData = {};
    data.forEach(item => {
      const timestampInMilliseconds = item.timestamp * 1000;
      const date = new Date(timestampInMilliseconds).toLocaleDateString();
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      const isGood = item.surf.max >= GOOD_WAVE_THRESHOLD;
      groupedData[date].push({
        ...item,
        timestamp: new Date(timestampInMilliseconds).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isGood: isGood,
      });
    });
    return Object.entries(groupedData).map(([date, forecasts]) => ({
      date,
      forecasts,
      expanded: false,
    }));
  };

  const toggleExpansion = index => {
    const updatedData = [...dailyData];
    updatedData[index].expanded = !updatedData[index].expanded;
    setDailyData(updatedData);
  };

  const renderWaveItem = ({ item, index }) => {
    return (
      <View style={styles.waveItem}>
        <TouchableOpacity onPress={() => toggleExpansion(index)}>
          <Text style={styles.waveItemTitle}>Date: {item.date}</Text>
        </TouchableOpacity>
        {item.expanded && (
          <View>
            <View style={styles.tableRow}>
              <Text style={styles.tableHeader}>Timestamp</Text>
              <Text style={styles.tableHeader}>Is Good</Text>
              <Text style={styles.tableHeader}>wave min</Text>
              <Text style={styles.tableHeader}>wave max</Text>
            </View>
            {item.forecasts.map(forecast => (
              <View key={forecast.id} style={styles.tableRow}>
                <Text>{forecast.timestamp}</Text>
                <Text style={forecast.isGood ? styles.good : styles.notGood}>
                  {forecast.isGood ? 'Yes' : 'No'}
                </Text>
                <Text>{forecast.surf.min}</Text>
                <Text>{forecast.surf.max}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wave Forecast</Text>
      <FlatList
        data={dailyData}
        renderItem={renderWaveItem}
        style={{ marginTop: 20 }}
        keyExtractor={item => item.date}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  good: {
    color: 'red'
  },
  notGood: {
    color: 'blue'
  },
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 30,
  },
  waveItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc', // テーブルの境界線の色
    marginBottom: 10,
    padding: 5,
  },
  waveItemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#ddd',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
  },
});
