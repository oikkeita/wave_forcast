import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const data = [
  { id: '1', name: 'John Smith', age: '30', country: 'USA' },
  { id: '2', name: 'Emma Johnson', age: '25', country: 'Canada' },
  { id: '3', name: 'Anna Kim', age: '40', country: 'South Korea' },
  { id: '4', name: 'Mehmet Yılmaz', age: '35', country: 'Turkey' },
  { id: '5', name: 'Liu Hong', age: '28', country: 'China' },
];

const TableHeader = () => {
  return (
    <View style={styles.row}>
      <Text style={styles.headerText}>ID</Text>
      <Text style={styles.headerText}>Name</Text>
      <Text style={styles.headerText}>Age</Text>
      <Text style={styles.headerText}>Country</Text>
    </View>
  );
};

const TableItem = ({ item }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.itemText}>{item.id}</Text>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>{item.age}</Text>
      <Text style={styles.itemText}>{item.country}</Text>
    </View>
  );
};

const App = () => {
  return (
    <View style={styles.container}>
      <TableHeader />
      <FlatList
        data={data}
        renderItem={({ item }) => <TableItem item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    width: '25%',
    textAlign: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
    width: '25%',
    textAlign: 'center',
  },
});

export default App;
