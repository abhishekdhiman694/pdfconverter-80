
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from '@/components/ui/use-toast';
import { ApiService, User } from '@/lib/api-service';

interface ConversionContextType {
  canConvert: boolean;
  incrementConversion: () => void;
  resetConversions: () => void;
  conversionCount: number;
  showLoginPrompt: () => void;
  refreshUserData: () => Promise<void>;
  isServerConnected: boolean;
}

// Create a custom event for opening the login dialog
const openLoginDialogEvent = new CustomEvent('openLoginDialog');

const ConversionContext = createContext<ConversionContextType>({
  canConvert: true,
  incrementConversion: () => {},
  resetConversions: () => {},
  conversionCount: 0,
  showLoginPrompt: () => {},
  refreshUserData: async () => {},
  isServerConnected: false,
});

export const useConversion = () => useContext(ConversionContext);

export const ConversionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>('pdfZenithUser', null);
  const [conversionCount, setConversionCount] = useState(0);
  const [canConvert, setCanConvert] = useState(true);
  const [isServerConnected, setIsServerConnected] = useState(false);
  
  // Check if the Supabase connection is working
  useEffect(() => {
    const checkServerConnection = async () => {
      const isConnected = await ApiService.checkServerHealth();
      setIsServerConnected(isConnected);
      
      if (!isConnected) {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Could not connect to Supabase. Some features may be unavailable."
        });
      }
    };
    
    checkServerConnection();
    
    // Set up a periodic health check every 30 seconds
    const interval = setInterval(checkServerConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Initialize conversion count from user data
  useEffect(() => {
    if (user) {
      setConversionCount(user.convertCount);
    } else {
      setConversionCount(0);
    }
  }, [user]);
  
  // Check if user can convert (free user gets 1 conversion)
  useEffect(() => {
    if (user) {
      // Logged in users can convert unlimited files
      setCanConvert(true);
    } else {
      // Guest users can only convert 1 file
      setCanConvert(conversionCount < 1);
    }
  }, [conversionCount, user]);

  // Refresh user data from Supabase
  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      const updatedUser = await ApiService.getUserData(user.email);
      if (updatedUser) {
        setUser(updatedUser);
        setConversionCount(updatedUser.convertCount);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };
  
  const incrementConversion = async () => {
    const newCount = conversionCount + 1;
    setConversionCount(newCount);
    
    if (user) {
      // Update user's conversion count in Supabase
      const updatedCount = await ApiService.incrementConversion(user.email);
      if (updatedCount !== null) {
        // Update local state with server response
        const updatedUser = { ...user, convertCount: updatedCount };
        setUser(updatedUser);
        setConversionCount(updatedCount);
      }
    } else if (newCount >= 1) {
      // Show login prompt after first conversion for guest users
      showLoginPrompt();
    }
  };

  const showLoginPrompt = () => {
    if (!user) {
      toast({
        title: "Free Conversion Used",
        description: "You've used your free conversion. Please login or sign up to continue using our tools.",
        variant: "default",
        action: <button 
          onClick={() => window.dispatchEvent(openLoginDialogEvent)} 
          className="bg-zenith-500 text-white px-3 py-1 rounded-md hover:bg-zenith-600 transition-colors"
        >
          Login
        </button>,
      });
    }
  };
  
  const resetConversions = async () => {
    if (user) {
      // Reset conversions in Supabase
      const success = await ApiService.resetConversions(user.email);
      if (success) {
        const updatedUser = { ...user, convertCount: 0 };
        setUser(updatedUser);
        setConversionCount(0);
      }
    } else {
      // Reset local state only
      setConversionCount(0);
    }
  };
  
  return (
    <ConversionContext.Provider 
      value={{
        canConvert,
        incrementConversion,
        resetConversions,
        conversionCount,
        showLoginPrompt,
        refreshUserData,
        isServerConnected
      }}
    >
      {children}
    </ConversionContext.Provider>
  );
};
