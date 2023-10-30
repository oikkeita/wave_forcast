import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const GOOD_WAVE_THRESHOLD = 1; // Surf maxが1以上なら良い波と判断する

export default function App() {
  const [convertedData, setConvertedData] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    fetch('https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=5842041f4e65fad6a7708d9b')
      .then(response => response.json())
      .then(data => {
        const convertedData = data.data.wave.map(item => {
          const timestampInMilliseconds = item.timestamp * 1000; // timestampは秒単位なので、ミリ秒単位に変換する
          const date = new Date(timestampInMilliseconds);
          const isGood = item.surf.max >= GOOD_WAVE_THRESHOLD;
          return {
            ...item,
            timestamp: date || new Date(), 
            isGood: isGood
          };
        });
        setConvertedData(convertedData);
      })
      .catch(error => console.error(error));
  }, []);

  const toggleExpansion = id => {
    if (expandedIds.includes(id)) {
      setExpandedIds(expandedIds.filter(itemId => itemId !== id));
    } else {
      setExpandedIds([...expandedIds, id]);
    }
  };

  const renderWaveItem = ({ item }) => {
    const isExpanded = expandedIds.includes(item.id);
    return (
      <TouchableOpacity onPress={() => toggleExpansion(item.id)}>
        <View style={styles.waveItem}>
          <Text style={styles.waveItemTitle}>Timestamp:</Text>
          <Text>{item.timestamp.toString()}</Text>
          <Text style={styles.waveItemTitle}>Is Good:</Text>
          <Text style={item.isGood ? styles.good : styles.notGood}>
            {item.isGood ? 'Yes' : 'No'}
          </Text>
          <Text style={styles.waveItemTitle}>Surf min:</Text>
          <Text>{item.surf.min}</Text>
          <Text style={styles.waveItemTitle}>Surf max:</Text>
          <Text>{item.surf.max}</Text>
{/*           {isExpanded && (
            <>
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
            </>
          )} */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wave Forecast</Text>
      <FlatList
        data={convertedData}
        renderItem={renderWaveItem}
        style={{ marginTop: 20 }}
        keyExtractor={item => item.id/* .toString() */}
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
