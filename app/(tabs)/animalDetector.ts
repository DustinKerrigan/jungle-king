import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as cocossd from "@tensorflow-models/coco-ssd"; //fix this

let model: cocossd.ObjectDetection | null = null;

export async function loadModel() {
  await tf.setBackend("webgl");
  await tf.ready();

  if (!model) {
    model = await cocossd.load({ base: "lite_mobilenet_v2" });
  }

  return model;
}
