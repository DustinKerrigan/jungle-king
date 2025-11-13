import React, { useEffect, useRef, useState } from "react"; //this should work
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedAnimal, setScannedAnimal] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Camera permission is required.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.text}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = () => {
    const animals = ["Monkey", "Lion", "Snake", "Parrot"]; //example animals, predixtive model would go here
    const random = animals[Math.floor(Math.random() * animals.length)];
    setScannedAnimal(random);
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />
      <View style={styles.overlay}>
        <TouchableOpacity onPress={handleScan} style={styles.scanButton}>
          <Text style={styles.text}>Scan</Text>
        </TouchableOpacity>
        {scannedAnimal && (
          <Text style={styles.result}>{scannedAnimal} detected!</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "white", fontSize: 18 },
  button: { backgroundColor: "#333", padding: 10, marginTop: 10, borderRadius: 8 },
  overlay: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  scanButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 50 },
  result: { color: "white", fontSize: 20, marginTop: 10 },
});


