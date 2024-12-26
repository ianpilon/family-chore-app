export const STORAGE_CONFIG = {
  compression: {
    maxSize: 800,
    quality: 0.8,
    type: 'image/jpeg'
  },
  paths: {
    profiles: 'profiles',
    tasks: 'tasks'
  }
} as const;