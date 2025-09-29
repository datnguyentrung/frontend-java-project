import * as ort from 'onnxruntime-react-native';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';

let session: ort.InferenceSession | null = null;

export async function initModel() {
    if (!session) {
        session = await ort.InferenceSession.create('model.onnx');
    }
}

export async function getEmbeddingFromTensor(tensor: ort.Tensor) {
    if (!session) {
        await initModel();
    }

    const feeds: Record<string, ort.Tensor> = { input: tensor };
    const results = await session!.run(feeds);
    const embedding = results.output.data as Float32Array;
    return embedding;
}

// npx eas credentials