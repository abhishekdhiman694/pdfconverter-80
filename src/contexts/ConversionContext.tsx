
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { toast } from '@/components/ui/use-toast';

interface UserData {
  email: string;
  username: string;
  convertCount: number;
}

interface ConversionContextType {
  canConvert: boolean;
  incrementConversion: () => void;
  resetConversions: () => void;
  conversionCount: number;
  showLoginPrompt: () => void;
}

// Create a custom event for opening the login dialog
const openLoginDialogEvent = new CustomEvent('openLoginDialog');

const ConversionContext = createContext<ConversionContextType>({
  canConvert: true,
  incrementConversion: () => {},
  resetConversions: () => {},
  conversionCount: 0,
  showLoginPrompt: () => {},
});

export const useConversion = () => useContext(ConversionContext);

export const ConversionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<UserData | null>('pdfZenithUser', null);
  const [conversionCount, setConversionCount] = useState(0);
  const [canConvert, setCanConvert] = useState(true);
  
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
  
  const incrementConversion = () => {
    const newCount = conversionCount + 1;
    setConversionCount(newCount);
    
    if (user) {
      // Update user's conversion count in local storage
      const updatedUser = { ...user, convertCount: newCount };
      setUser(updatedUser);
      
      // Also update in the users array
      const users = JSON.parse(localStorage.getItem('pdfZenithUsers') || '[]');
      const updatedUsers = users.map((u: UserData) => 
        u.email === user.email ? updatedUser : u
      );
      localStorage.setItem('pdfZenithUsers', JSON.stringify(updatedUsers));
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
  
  const resetConversions = () => {
    setConversionCount(0);
    if (user) {
      const updatedUser = { ...user, convertCount: 0 };
      setUser(updatedUser);
      
      const users = JSON.parse(localStorage.getItem('pdfZenithUsers') || '[]');
      const updatedUsers = users.map((u: UserData) => 
        u.email === user.email ? updatedUser : u
      );
      localStorage.setItem('pdfZenithUsers', JSON.stringify(updatedUsers));
    }
  };
  
  return (
    <ConversionContext.Provider 
      value={{
        canConvert,
        incrementConversion,
        resetConversions,
        conversionCount,
        showLoginPrompt
      }}
    >
      {children}
    </ConversionContext.Provider>
  );
};
