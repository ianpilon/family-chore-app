export async function requestCameraPermission(): Promise<boolean> {
  try {
    // Check if permissions API is supported
    if (!navigator.permissions || !navigator.permissions.query) {
      // Fallback to getUserMedia directly
      await navigator.mediaDevices.getUserMedia({ video: true });
      return true;
    }

    // Check permission status
    const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
    
    if (result.state === 'granted') {
      return true;
    }
    
    if (result.state === 'prompt') {
      // Request camera access
      await navigator.mediaDevices.getUserMedia({ video: true });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Camera permission error:', error);
    return false;
  }
}