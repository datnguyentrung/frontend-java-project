// import { View, Text, StyleSheet } from 'react-native';
// import React, { useRef, useEffect } from 'react';
// import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera';
// import { runOnJS } from 'react-native-reanimated'; // ⚠️ nên đổi sang react-native-worklets-core sau
// import { initModel, getEmbeddingFromTensor } from '@/utils/embeddingUtils';
// import { sendEmbedding } from '@/services/ai/embeddingService';
// import * as ort from 'onnxruntime-react-native';
// // "react-native-vision-camera": "^4.7.2",
// export default function ScanScreenAI() {
//     const device = useCameraDevice('front');
//     const lastFrameTimeRef = useRef(0); // để giới hạn tốc độ xử lý frame

//     useEffect(() => {
//         (async () => {
//             const status = await Camera.requestCameraPermission();
//             if (status !== 'denied') {
//                 console.warn('Camera permission not granted');
//             }
//             await initModel();
//         })();
//     }, [])

//     // Hàm convert frame thành tensor (demo, cần viết decoder thực sự)
//     const preprocessFrame = (frame: any): ort.Tensor => {
//         // 🔥 TODO: convert frame -> Float32Array [1, 3, H, W]
//         // Ví dụ giả định: frame có data dạng Uint8 RGBA
//         const floatArray = new Float32Array(frame.data.length);
//         for (let i = 0; i < frame.data.length; i++) {
//             floatArray[i] = frame.data[i] / 255.0; // Chuẩn hóa
//         }
//         return new ort.Tensor('float32', floatArray, [1, 3, frame.height, frame.width]);
//     }

//     // Hàm xử lý frame trong JS
//     const handleFrame = async (frame: any) => {
//         try {
//             const tensor = preprocessFrame(frame);
//             const embedding = await getEmbeddingFromTensor(tensor);
//             await sendEmbedding(embedding);
//             // console.log("✅ Embedding sent:", embedding.slice(0, 5), "...");
//         } catch (err) {
//             console.error("Embedding error:", err);
//         }
//     }

//     // Frame processor (worklet)
//     const frameProcessor = useFrameProcessor((frame) => {
//         'worklet';
//         const now = Date.now();
//         if (now - lastFrameTimeRef.current < 1000) { // giới hạn 1 frame/giây
//             return;
//         }
//         lastFrameTimeRef.current = now;

//         runOnJS(handleFrame)(frame); // gọi hàm JS từ worklet
//     }, []);

//     if (device == null) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.title}>Camera not available</Text>
//             </View>
//         );
//     }

//     return (
//         <Camera
//             style={styles.absoluteFill}
//             device={device}
//             isActive={true}
//             frameProcessor={frameProcessor}
//         />
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     absoluteFill: {
//         position: 'absolute',
//         top: 0,
//         right: 0,
//         bottom: 0,
//         left: 0,
//     }
// });