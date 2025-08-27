// Quick utility to check backend connection issues
export function checkBackendStatus() {
  // Check if nsw-frontend-core-lib is loaded
  try {
    const lib = require('nsw-frontend-core-lib');
    console.log('✅ nsw-frontend-core-lib loaded:', lib);
  } catch (error) {
    console.error('❌ Failed to load nsw-frontend-core-lib:', error);
  }

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
  console.log('  VITE_QR_BACKEND_URL:', import.meta.env.VITE_QR_BACKEND_URL);
  console.log('  VITE_FORCE_DEBUG:', import.meta.env.VITE_FORCE_DEBUG);

  // Check if running in development
  console.log('  DEV mode:', import.meta.env.DEV);
  console.log('  PROD mode:', import.meta.env.PROD);
}