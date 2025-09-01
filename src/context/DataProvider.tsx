import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { socket, onEvent, offEvent, useNomoConnected, isNomoConnected } from 'nsw-frontend-core-lib';
import { isFallbackModeActive } from 'nomo-webon-kit';
import '../core/api/loaders';// Import the initialization function
import { QRAuth } from '../components/QRAuth';

interface DataContextValue {
  isConnected: boolean;
  isLoading: boolean;
  isNomoAuthenticated: boolean;
}

const DataContext = createContext<DataContextValue>({
  isConnected: false,
  isLoading: true,
  isNomoAuthenticated: false,
});

export const useDataContext = () => useContext(DataContext);

// Apollo Client setup (for components that need direct GraphQL access)
const apolloClient = new ApolloClient({
  uri: import.meta.env.VITE_BACKEND_URL || 'http://localhost:1234',
  cache: new InMemoryCache(),
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading] = useState(false); // Don't block initial render
  const [isNomoAuthenticated, setIsNomoAuthenticated] = useState(false);
  const is_nomo_connected = useNomoConnected();

  useEffect(() => {
      // Listen for Nomo authentication
    const handleNomoAuth = () => {
      console.log('Nomo authentication successful');
      setIsNomoAuthenticated(true);
    };

    onEvent('nomo_authentication_success', handleNomoAuth);

    // The socket is initialized automatically by nsw-frontend-core-lib
    // We just need to listen for connection events
    const handleConnect = () => {
      console.log('Socket.IO connected to backend');
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log('Socket.IO disconnected from backend');
      setIsConnected(false);
    };

    // Check if already connected
    if (socket && socket.connected) {
      setIsConnected(true);
    }

    // Listen for connection events
    onEvent('connect', handleConnect);
    onEvent('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      offEvent('nomo_authentication_success', handleNomoAuth);
      offEvent('connect', handleConnect);
      offEvent('disconnect', handleDisconnect);
    };
  }, []);

  // Check if we need to show QR authentication
  // Show QR if running in browser (fallback mode) and not connected to Nomo
  const needsAuth = isFallbackModeActive() && !isNomoConnected();
  
  if (needsAuth && !is_nomo_connected) {
    return <QRAuth />;
  }


  return (
    <ApolloProvider client={apolloClient}>
      <DataContext.Provider value={{ isConnected, isLoading, isNomoAuthenticated }}>
        {children}
      </DataContext.Provider>
    </ApolloProvider>
  );
}