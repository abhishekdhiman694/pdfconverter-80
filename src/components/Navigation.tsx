import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileDigit, Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ApiService, User as UserType } from '@/lib/api-service';
import { useConversion } from '@/contexts/ConversionContext';

interface NavigationProps {
  openLoginDialog?: boolean;
  setOpenLoginDialog?: (open: boolean) => void;
}

const Navigation = ({ openLoginDialog, setOpenLoginDialog }: NavigationProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useLocalStorage<UserType | null>('pdfZenithUser', null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { refreshUserData } = useConversion();

  // Listen for custom event to open login dialog
  useEffect(() => {
    const handleOpenLoginDialog = () => {
      setShowLoginDialog(true);
    };

    window.addEventListener('openLoginDialog', handleOpenLoginDialog);
    
    return () => {
      window.removeEventListener('openLoginDialog', handleOpenLoginDialog);
    };
  }, []);
  
  // Handle prop-based login dialog opening
  useEffect(() => {
    if (openLoginDialog) {
      setShowLoginDialog(true);
      if (setOpenLoginDialog) {
        setOpenLoginDialog(false);
      }
    }
  }, [openLoginDialog, setOpenLoginDialog]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const loggedInUser = await ApiService.login(email, password);
      
      if (loggedInUser) {
        setUser(loggedInUser);
        toast({
          title: "Success",
          description: "You have successfully logged in!",
        });
        setShowLoginDialog(false);
        setEmail('');
        setPassword('');
        
        // Refresh user data from server
        await refreshUserData();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
      });
      return;
    }
    
    setIsRegistering(true);
    
    try {
      const newUser = await ApiService.register(email, username, password);
      
      if (newUser) {
        setUser(newUser);
        toast({
          title: "Success",
          description: "Your account has been created!",
        });
        setShowSignupDialog(false);
        setEmail('');
        setPassword('');
        setUsername('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleLogout = async () => {
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const openLoginDialogHandler = () => {
    setShowSignupDialog(false);
    setShowLoginDialog(true);
  };

  const openSignupDialog = () => {
    setShowLoginDialog(false);
    setShowSignupDialog(true);
  };

  return (
    <nav className="py-4 border-b border-zinc-100">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 rounded-md bg-gradient-to-br from-zenith-500 to-zenith-700 text-white">
            <FileDigit size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">PDF Zenith</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-zenith-700 hover:text-zenith-500 font-medium">Home</Link>
          <Link to="/tools" className="text-zenith-700 hover:text-zenith-500 font-medium">All Tools</Link>
          <Link to="/about" className="text-zenith-700 hover:text-zenith-500 font-medium">About</Link>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zenith-50 px-3 py-1 rounded-full">
                <User size={16} className="text-zenith-700" />
                <span className="text-sm font-medium text-zenith-700">{user.username}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={openLoginDialogHandler}>Login</Button>
              <Button className="bg-zenith-500 hover:bg-zenith-600" onClick={openSignupDialog}>Sign Up</Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMenu} 
          className="md:hidden text-zenith-700"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "fixed inset-0 z-50 bg-white p-6 flex flex-col transition-transform duration-300 ease-in-out md:hidden",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
              <div className="p-2 rounded-md bg-gradient-to-br from-zenith-500 to-zenith-700 text-white">
                <FileDigit size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">PDF Zenith</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X size={24} />
            </Button>
          </div>
          <div className="flex flex-col gap-6">
            <Link to="/" className="text-xl font-medium p-2" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/tools" className="text-xl font-medium p-2" onClick={() => setIsOpen(false)}>All Tools</Link>
            <Link to="/about" className="text-xl font-medium p-2" onClick={() => setIsOpen(false)}>About</Link>
            
            {user ? (
              <>
                <div className="flex items-center gap-2 p-2">
                  <User size={20} className="text-zenith-700" />
                  <span className="font-medium text-zenith-700">{user.username}</span>
                </div>
                <Button 
                  className="bg-zenith-500 hover:bg-zenith-600 mt-4" 
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => {
                    setIsOpen(false);
                    openLoginDialogHandler();
                  }}
                >
                  Login
                </Button>
                <Button 
                  className="bg-zenith-500 hover:bg-zenith-600" 
                  onClick={() => {
                    setIsOpen(false);
                    openSignupDialog();
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Login to PDF Zenith</DialogTitle>
            <DialogDescription className="text-center">
              Enter your credentials to access all PDF tools
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={isLoggingIn}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={isLoggingIn}
              />
            </div>
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <button 
                type="button" 
                className="text-zenith-500 hover:underline" 
                onClick={openSignupDialog}
                disabled={isLoggingIn}
              >
                Sign up
              </button>
            </div>
            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                className="bg-zenith-500 hover:bg-zenith-600 w-full" 
                disabled={isLoggingIn}
              >
                <LogIn className="mr-2 h-4 w-4" /> 
                {isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Create an Account</DialogTitle>
            <DialogDescription className="text-center">
              Sign up for unlimited access to all PDF tools
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input 
                id="signup-email" 
                type="email" 
                placeholder="your@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={isRegistering}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                type="text" 
                placeholder="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
                disabled={isRegistering}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input 
                id="signup-password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                disabled={isRegistering}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                disabled={isRegistering}
              />
            </div>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <button 
                type="button" 
                className="text-zenith-500 hover:underline" 
                onClick={openLoginDialogHandler}
                disabled={isRegistering}
              >
                Login
              </button>
            </div>
            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                className="bg-zenith-500 hover:bg-zenith-600 w-full"
                disabled={isRegistering}
              >
                {isRegistering ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navigation;
