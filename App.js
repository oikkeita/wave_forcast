import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const GOOD_WAVE_THRESHOLD = 1;

// コンポーネントの定義
export default function App() {
  // Stateの初期化
  const [dailyData, setDailyData] = useState([]);

  // APIからデータを取得し、コンポーネントがマウントされた後にデータを処理する
  useEffect(() => {
    // APIからデータを取得
    fetch('https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=5842041f4e65fad6a7708d9b')
      .then(response => response.json())
      .then(data => {
        // 取得したデータを日ごとにグループ化
        const groupedByDay = groupDataByDay(data.data.wave);
        // Stateを更新
        setDailyData(groupedByDay);
      })
      .catch(error => console.error(error)); // エラーハンドリング
  }, []);

  const groupDataByDay = data => {
    const groupedData = {}; // 日付ごとにグループ化されたデータを格納するオブジェクトを初期化します
    data.forEach(item => {
      const timestampInMilliseconds = item.timestamp * 1000; // タイムスタンプをミリ秒に変換します
      const date = new Date(timestampInMilliseconds).toLocaleDateString(); // タイムスタンプから日付を取得します
  
      // 同じ日付のデータをまとめるために、日付をキーとして使用し、それぞれの日付ごとに配列を作成します
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
  
      // 予測データの各要素を取り出して、必要な情報を抽出して新たなオブジェクトとして追加します
      const isGood = item.surf.max >= GOOD_WAVE_THRESHOLD; // 波の質が良いかどうかを確認します
      groupedData[date].push({
        ...item, // 元のデータを展開
        timestamp: new Date(timestampInMilliseconds).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), // タイムスタンプをhh:mm形式にフォーマットします
        isGood: isGood, // 波が良いかどうかを追加します
      });
    });
  
    // グループ化されたデータを日付ごとのオブジェクトから配列の形式に変換して返します
    return Object.entries(groupedData).map(([date, forecasts]) => ({
      date, // 日付
      forecasts, // 予測データ
      expanded: false, // 初期状態では展開されていない状態に設定
    }));
  };
  

  // エクスパンド/コラプスをトグルする関数
  const toggleExpansion = index => {
    const updatedData = [...dailyData];
    updatedData[index].expanded = !updatedData[index].expanded;
    setDailyData(updatedData);
  };

  // 波のデータを表示する関数
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

  // コンポーネントのレンダリング
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

// スタイルの定義
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

