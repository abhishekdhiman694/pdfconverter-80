import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileDigit, Menu, X, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

// Interface for user data
interface UserData {
  email: string;
  username: string;
  convertCount: number;
}

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
  const [user, setUser] = useLocalStorage<UserData | null>('pdfZenithUser', null);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem('pdfZenithUsers') || '[]');
    const foundUser = users.find((u: UserData) => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      toast({
        title: "Success",
        description: "You have successfully logged in!",
      });
      setShowLoginDialog(false);
      setEmail('');
      setPassword('');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
      });
      return;
    }
    
    // Get existing users or create empty array
    const existingUsers = JSON.parse(localStorage.getItem('pdfZenithUsers') || '[]');
    
    // Check if email already exists
    if (existingUsers.some((user: UserData) => user.email === email)) {
      toast({
        variant: "destructive",
        title: "Email Already Exists",
        description: "This email is already registered. Please log in instead.",
      });
      return;
    }
    
    const newUser = { email, username, convertCount: 0 };
    
    // Add new user
    existingUsers.push(newUser);
    localStorage.setItem('pdfZenithUsers', JSON.stringify(existingUsers));
    
    // Log user in
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
  };

  const handleLogout = () => {
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
              />
            </div>
            <div className="text-sm text-center">
              Don't have an account?{" "}
              <button 
                type="button" 
                className="text-zenith-500 hover:underline" 
                onClick={openSignupDialog}
              >
                Sign up
              </button>
            </div>
            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-zenith-500 hover:bg-zenith-600 w-full">
                <LogIn className="mr-2 h-4 w-4" /> Login
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
              />
            </div>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <button 
                type="button" 
                className="text-zenith-500 hover:underline" 
                onClick={openLoginDialogHandler}
              >
                Login
              </button>
            </div>
            <div className="pt-4 flex justify-end">
              <Button type="submit" className="bg-zenith-500 hover:bg-zenith-600 w-full">
                Create Account
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navigation;
