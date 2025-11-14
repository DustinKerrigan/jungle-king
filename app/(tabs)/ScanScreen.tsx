import React, { useEffect, useRef, useState } from "react"; //this should work
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { loadAnimalModel, detectAnimals } from "./animalDetector";

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await loadAnimalModel();
      setModelReady(true);
    })();
  }, []);

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
    if (!cameraRef.current || !modelReady) return;

    // take camera picture as base64
    const pic = await cameraRef.current.takePictureAsync({
      base64: true,
      skipProcessing: true,
    });

    if (!pic.base64) return;

    // turn base64 to tensor
    const rawImageData = tf.util.encodeString(pic.base64, "base64").buffer;
    const uint8array = new Uint8Array(rawImageData);
    const imageTensor = tf.node.decodeImage(uint8array, 3) as tf.Tensor3D;

    const predictions = await detectAnimals(imageTensor);

    if (predictions.length > 0) {
      setResult(predictions[0].class);
    } else {
      setResult("No animals detected");
    }

    imageTensor.dispose();
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />

      <View style={styles.overlay}>
        <TouchableOpacity
          disabled={!modelReady}
          onPress={handleScan}
          style={styles.scanButton}
        >
          <Text style={styles.text}>
            {modelReady ? "Scan" : "Loading model..."}
          </Text>
        </TouchableOpacity>

        {result && <Text style={styles.result}>{result}</Text>}
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


