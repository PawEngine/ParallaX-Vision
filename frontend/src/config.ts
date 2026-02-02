export const CONFIG = {
  camera: {
    width: 1280,
    height: 720,
    showPreview: true, // Show camera preview for debugging
  },
  faceTracking: {
    sensitivity: 20, // Base sensitivity for parallax effect
    smoothness: 0.1,  // Lerp factor (for future use)
  },
  ui: {
    debugMode: true, // Default debug mode state
  }
} as const;
