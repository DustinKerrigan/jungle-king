import { Text, View, StyleSheet } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.text}>Demo Homescreen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065f46',
  },
});
