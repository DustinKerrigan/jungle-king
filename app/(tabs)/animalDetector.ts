import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

let model: cocoSsd.ObjectDetection | null = null;

export async function loadAnimalModel() {
  if (model) return model;

  console.log("Loading TensorFlow backend...");
  await tf.ready();
  await tf.setBackend("webgl");

  console.log("Loading Coco-SSD model...");
  model = await cocoSsd.load();
  console.log("Coco-SSD loaded!");

  return model;
}

// imageTensor must be a Tensor3D (H × W × 3)
export async function detectAnimals(imageTensor: tf.Tensor3D) {
  if (!model) throw new Error("Model not loaded yet.");

  const results = await model.detect(imageTensor);
  return results;
}
