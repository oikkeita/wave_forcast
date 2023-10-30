import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [waveData, setWaveData] = useState([]);

  useEffect(() => {
    fetch('https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=5842041f4e65fad6a7708d9b')
      .then(response => response.json())
      .then(data => setWaveData(data.data.wave))
      .catch(error => console.error(error));
  }, []);

  const convertedData = waveData.map(item => {
    const timestampInMilliseconds = item.timestamp * 1000; // timestampは秒単位なので、ミリ秒単位に変換する
    const date = new Date(timestampInMilliseconds);
    return {
      ...item,
      timestamp: date
    };
  });

  console.log(JSON.stringify(convertedData, null, 2));
  
  const renderWaveItem = ({ item }) => (
    <View style={styles.waveItem}>
      <Text style={styles.waveItemTitle}>Timestamp:</Text>
      <Text>{item.timestamp}</Text>
      <Text style={styles.waveItemTitle}>Surf min:</Text>
      <Text>{item.surf.min}</Text>
      <Text style={styles.waveItemTitle}>Surf max:</Text>
      <Text>{item.surf.max}</Text>
      <Text style={styles.waveItemTitle}>Swells:</Text>
      <FlatList
        data={item.swells}
        renderItem={({ item }) => (
          <View style={styles.swellItem}>
            <Text style={styles.swellItemTitle}>Height:</Text>
            <Text>{item.height}</Text>
            <Text style={styles.swellItemTitle}>Period:</Text>
            <Text>{item.period}</Text>
            <Text style={styles.swellItemTitle}>Impact:</Text>
            <Text>{item.impact}</Text>
            <Text style={styles.swellItemTitle}>Direction:</Text>
            <Text>{item.direction}</Text>
          </View>
        )}

      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={waveData}
        renderItem={renderWaveItem}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  waveItem: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  waveItemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#ddd',  
  },
  swellItem: {
    marginLeft: 20,
    marginBottom: 5,
  },
  swellItemTitle: {
    fontWeight: 'bold',
    backgroundColor: '#ccc',
  },
});
