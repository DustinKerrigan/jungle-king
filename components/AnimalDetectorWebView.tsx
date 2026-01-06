import React, { forwardRef } from "react";
import { WebView } from "react-native-webview";
import { Asset } from "expo-asset";

type Detection = {
  class: string;
  score: number;
  bbox: number[];
};

type Props = {
  onResult: (detections: Detection[]) => void;
};

const AnimalDetectorWebView = forwardRef<any, Props>(({ onResult }, ref) => {
  const html = Asset.fromModule(
    require("../src/ml/detector.html")
  ).uri;

  return (
    <WebView
      ref={ref}
      source={{ uri: html }}
      originWhitelist={["*"]}
      javaScriptEnabled
      onMessage={(event) => {
        const data = JSON.parse(event.nativeEvent.data);
        if (data.type === "RESULT") {
          onResult(data.payload);
        }
      }}
      style={{ width: 0, height: 0 }}
    />
  );
});

export default AnimalDetectorWebView;
