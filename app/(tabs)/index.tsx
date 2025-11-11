import { Text, View, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-green-200">
      <Text className="text-xl font-bold text-green-800">Tailwind Works!</Text>
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
