import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const GOOD_WAVE_THRESHOLD = 1; // Surf maxが1以上なら良い波と判断する

export default function App() {
  const [convertedData, setConvertedData] = useState([]);

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
            timestamp: date,
            isGood: isGood
          };
        });
        setConvertedData(convertedData);
      })
      .catch(error => console.error(error));
  }, []);

  const DailyData = ({ date, data }) => {
    const renderWaveItem = ({ item }) => (
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
      </View>
    );
    return (
      <View>
        <Text style={styles.title}>{date}</Text>
        <FlatList
          data={data}
          renderItem={renderWaveItem}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  const DailyDataList = () => {
    const dataByDate = {};
    convertedData.forEach(item => {
      const dateString = item.timestamp.toLocaleDateString();
      if (!dataByDate[dateString]) {
        dataByDate[dateString] = [];
      }
      dataByDate[dateString].push(item);
    });
    const dataList = Object.keys(dataByDate).map(dateString => {
      const data = dataByDate[dateString];
      return {
        date: dateString,
        data: data,
      };
    });
    return (
      <FlatList
        data={dataList}
        renderItem={({ item }) => <DailyData date={item.date} data={item.data} />}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wave Forecast</Text>
      <DailyDataList />
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
  dailyWaveItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  dailyWaveItemTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    backgroundColor: '#ddd',  
  },
  dailyWaveItemDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dailyWaveItemGood: {
    color: 'red',
    fontWeight: 'bold',
  },
  dailyWaveItemNotGood: {
    color: 'blue',
    fontWeight: 'bold',
  },
});
