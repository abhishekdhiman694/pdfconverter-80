
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id?: string;
  email: string;
  username: string;
  convertCount: number;
}

export class ApiService {
  /**
   * Register a new user
   */
  static async register(email: string, username: string, password: string): Promise<User | null> {
    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            convertCount: 0,
          }
        }
      });
      
      if (authError) {
        toast({
          variant: "destructive",
          title: "Registration Error",
          description: authError.message || "Failed to register"
        });
        return null;
      }
      
      // Create user profile in the database
      if (authData.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email,
            username,
            convertCount: 0
          }]);
          
        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
        
        // Return user object
        return {
          id: authData.user.id,
          email,
          username,
          convertCount: 0
        };
      }
      
      return null;
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Login Error",
          description: error.message || "Failed to login"
        });
        return null;
      }
      
      if (data.user) {
        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError || !profileData) {
          console.error('Error fetching user profile:', profileError);
          return null;
        }
        
        return {
          id: data.user.id,
          email: profileData.email,
          username: profileData.username,
          convertCount: profileData.convertCount
        };
      }
      
      return null;
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
      const user = await this.getUserData(email);
      if (!user || !user.id) return null;
      
      // First get the current count
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('convertCount')
        .eq('id', user.id)
        .single();
      
      if (fetchError || !userData) {
        console.error('Error fetching conversion count:', fetchError);
        return null;
      }
      
      const newCount = (userData.convertCount || 0) + 1;
      
      // Update the count
      const { error: updateError } = await supabase
        .from('users')
        .update({ convertCount: newCount })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error updating conversion count:', updateError);
        return null;
      }
      
      return newCount;
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
      const user = await this.getUserData(email);
      if (!user || !user.id) return false;
      
      const { error } = await supabase
        .from('users')
        .update({ convertCount: 0 })
        .eq('id', user.id);
      
      return !error;
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
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !data) {
        console.error('Get user data error:', error);
        return null;
      }
      
      return {
        id: data.id,
        email: data.email,
        username: data.username,
        convertCount: data.convertCount
      };
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }
  
  /**
   * Check if the server is running
   */
  static async checkServerHealth(): Promise<boolean> {
    try {
      // Check if Supabase is accessible
      const { error } = await supabase.from('users').select('count').limit(1);
      
      // If we can connect to Supabase, consider the system healthy
      return !error;
    } catch (error) {
      console.error('Server health check failed:', error);
      return false;
    }
  }
  
  /**
   * Sign out the current user
   */
  static async signOut(): Promise<boolean> {
    try {
      const { error } = await supabase.auth.signOut();
      return !error;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  }
}
