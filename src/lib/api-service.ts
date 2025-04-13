
import { toast } from '@/components/ui/use-toast';

const API_URL = 'http://localhost:5000/api';

export interface User {
  id?: string;
  email: string;
  username: string;
  convertCount: number;
}

export interface ApiResponse<T> {
  message: string;
  [key: string]: any;
}

export class ApiService {
  /**
   * Register a new user
   */
  static async register(email: string, username: string, password: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Registration Error",
          description: data.message || "Failed to register"
        });
        return null;
      }
      
      return data.user;
    } catch (error) {
      console.error('Register error:', error);
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: "Could not connect to the server"
      });
      return null;
    }
  }
  
  /**
   * Login a user
   */
  static async login(email: string, password: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Login Error",
          description: data.message || "Failed to login"
        });
        return null;
      }
      
      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "Could not connect to the server"
      });
      return null;
    }
  }
  
  /**
   * Increment conversion count
   */
  static async incrementConversion(email: string): Promise<number | null> {
    try {
      const response = await fetch(`${API_URL}/conversions/${email}/increment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Increment conversion error:', data.message);
        return null;
      }
      
      return data.convertCount;
    } catch (error) {
      console.error('Increment conversion error:', error);
      return null;
    }
  }
  
  /**
   * Reset conversion count
   */
  static async resetConversions(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/conversions/${email}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Reset conversion error:', error);
      return false;
    }
  }
  
  /**
   * Get user data
   */
  static async getUserData(email: string): Promise<User | null> {
    try {
      const response = await fetch(`${API_URL}/users/${email}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Get user data error:', data.message);
        return null;
      }
      
      return data.user;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }
}
