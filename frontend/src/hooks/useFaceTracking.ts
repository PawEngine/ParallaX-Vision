import { useEffect, useRef, useState } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export type FaceRotation = {
  yaw: number; // Left-Right rotation
  pitch: number; // Up-Down rotation
  roll: number; // Tilt
};

export const useFaceTracking = (videoRef: React.RefObject<HTMLVideoElement | null>) => {
  const [rotation, setRotation] = useState<FaceRotation>({ yaw: 0, pitch: 0, roll: 0 });
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const requestRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);

  useEffect(() => {
    let mounted = true;

    const initializeFaceLandmarker = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
        );
        
        if (!mounted) return;

        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: "/face_landmarker.task",
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });

        setIsReady(true);
      } catch (err) {
        console.error(err);
        setError("Failed to initialize Face Landmarker");
      }
    };

    initializeFaceLandmarker();

    return () => {
      mounted = false;
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close();
      }
    };
  }, []);

  const predictWebcam = () => {
    const video = videoRef.current;
    const faceLandmarker = faceLandmarkerRef.current;

    if (!video || !faceLandmarker || !isReady) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) {
        requestRef.current = requestAnimationFrame(predictWebcam);
        return;
    }

    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      
      const startTimeMs = performance.now();
      const results = faceLandmarker.detectForVideo(video, startTimeMs);

      if (results.facialTransformationMatrixes && results.facialTransformationMatrixes.length > 0) {
        const matrix = results.facialTransformationMatrixes[0].data;
        // Matrix is a flat array of 16 elements (4x4)
        // Rotation matrix is upper-left 3x3
        // Calculate Euler angles from rotation matrix
        // Ref: https://learnopencv.com/rotation-matrix-to-euler-angles/
        // Assuming standard OpenGL camera coordinate system (some adjustment might be needed)
        
        // matrix indices:
        // 0  1  2  3
        // 4  5  6  7
        // 8  9  10 11
        // 12 13 14 15
        
        const m00 = matrix[0];
        const m10 = matrix[4], m11 = matrix[5], m12 = matrix[6];
        const m20 = matrix[8], m21 = matrix[9], m22 = matrix[10];

        // Sy = sqrt(m00 * m00 + m10 * m10)
        const sy = Math.sqrt(m00 * m00 + m10 * m10);
        
        let yaw, pitch, roll;
        const singular = sy < 1e-6;

        if (!singular) {
          // pitch = atan2(m21, m22)
          // yaw = atan2(-m20, sy)
          // roll = atan2(m10, m00)
             
            // Note: Start with basic calculation, might need sign flip depending on camera mirror
            pitch = Math.atan2(m21, m22);
            yaw = Math.atan2(-m20, sy);
            roll = Math.atan2(m10, m00);
        } else {
            pitch = Math.atan2(-m12, m11);
            yaw = Math.atan2(-m20, sy);
            roll = 0;
        }
        
        setRotation({ 
            yaw: yaw,   // Radians
            pitch: pitch, 
            roll: roll 
        });
      }
    }
    
    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  useEffect(() => {
    if (isReady && videoRef.current) {
      requestRef.current = requestAnimationFrame(predictWebcam);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isReady]);

  return { rotation, isReady, isDetected: rotation.yaw !== 0 || rotation.pitch !== 0 || rotation.roll !== 0, error };
};
