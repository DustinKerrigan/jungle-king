import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AnimalDetectorWebView from "../../components/AnimalDetectorWebView";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const webViewRef = useRef<any>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState<any[]>([]);

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

  const handleScan = async () => {
    if (!cameraRef.current) return;

    setLoading(true);

    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      skipProcessing: true,
    });

    if (!photo.base64) return;

    webViewRef.current?.postMessage(
      JSON.stringify({
        type: "DETECT",
        payload: photo.base64,
      })
    );
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />

      <AnimalDetectorWebView
        ref={webViewRef}
        onResult={(results) => {
          setDetections(results);
          setLoading(false);
        }}
      />

      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={handleScan}
          style={styles.scanButton}
          disabled={loading}
        >
          <Text style={styles.text}>
            {loading ? "Detecting..." : "Scan"}
          </Text>
        </TouchableOpacity>

        {detections.map((d, i) => (
          <Text key={i} style={styles.result}>
            {d.class} ({Math.round(d.score * 100)}%)
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "white", fontSize: 18 },
  button: {
    backgroundColor: "#333",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 50,
  },
  result: {
    color: "white",
    fontSize: 20,
    marginTop: 10,
  },
});
