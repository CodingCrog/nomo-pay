// Debug utilities to check backend connection
import { socket, isNomoConnected } from '../../node_modules/nsw-frontend-core-lib/dist/index.js';

export function debugBackendConnection() {
  console.log('=== Backend Connection Debug ===');
  console.log('VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
  console.log('VITE_FORCE_DEBUG:', import.meta.env.VITE_FORCE_DEBUG);
  console.log('Window location:', window.location.href);
  
  // Check if socket is available
  try {
    console.log('Socket object:', socket);
    console.log('Socket connected:', socket?.connected);
    console.log('Socket ID:', socket?.id);
    console.log('Is Nomo connected:', isNomoConnected());
  } catch (error) {
    console.error('Error accessing socket:', error);
  }
}

// Call this on load
if (typeof window !== 'undefined') {
  (window as any).debugBackend = debugBackendConnection;
  setTimeout(() => {
    debugBackendConnection();
  }, 2000);
}