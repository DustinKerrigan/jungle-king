import React, { useEffect, useRef, useState } from "react"; 
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { loadAnimalModel, runDetection } from "./animalDetector";

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

    const { base64, width, height } = pic;
    if (!base64 || !width || !height) return;
    // Convert base64 → Image → Canvas → Pixel array
    const image = new Image();
    image.src = `data:image/jpg;base64,${base64}`;
    await new Promise(resolve => (image.onload = resolve));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d"); 
    if (!ctx){ //might be null at runtime, so we avoid error here
      console.warn("Canvas context is not available");
      return;
    }
    ctx.drawImage(image, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    //creating the tensor from the pixels
    const imageTensor = tf.browser.fromPixels(imageData);
    const predictions = await runDetection(imageTensor);

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


