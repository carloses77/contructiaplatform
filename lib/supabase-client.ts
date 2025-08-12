
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Optimized Supabase client singleton
class OptimizedSupabaseClient {
  private static instance: SupabaseClient | null = null;
  private static isInitializing = false;
  private static connectionHealth = true;

  public static getInstance(): SupabaseClient {
    if (this.instance && this.connectionHealth) {
      return this.instance;
    }

    if (this.isInitializing) {
      // Return a temporary instance to prevent blocking
      return this.createTempInstance();
    }

    this.isInitializing = true;

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('Supabase environment variables missing');
        this.connectionHealth = false;
        return this.createTempInstance();
      }

      this.instance = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        },
        realtime: {
          params: {
            eventsPerSecond: 2
          }
        },
        global: {
          headers: {
            'x-client-info': 'constructia-admin-optimized'
          },
          fetch: (url, options = {}) => {
            // Add timeout to prevent hanging requests
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            return fetch(url, {
              ...options,
              signal: controller.signal,
            }).then(response => {
              clearTimeout(timeoutId);
              return response;
            }).catch(error => {
              clearTimeout(timeoutId);
              if (error.name === 'AbortError') {
                console.warn('Supabase request timeout');
                this.connectionHealth = false;
              }
              throw error;
            });
          }
        }
      });

      this.connectionHealth = true;
      this.monitorConnection();
      
      return this.instance;
    } catch (error) {
      console.error('Error initializing Supabase client:', error);
      this.connectionHealth = false;
      return this.createTempInstance();
    } finally {
      this.isInitializing = false;
    }
  }

  private static createTempInstance(): SupabaseClient {
    // Create a minimal working instance for fallback
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';
    
    return createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 1 } }
    });
  }

  private static monitorConnection(): void {
    // Check connection health every 5 minutes
    setInterval(async () => {
      if (this.instance) {
        try {
          const { error } = await this.instance.from('clients').select('id').limit(1);
          this.connectionHealth = !error;
        } catch {
          this.connectionHealth = false;
        }
      }
    }, 300000); // 5 minutes
  }

  public static isHealthy(): boolean {
    return this.connectionHealth;
  }

  public static reset(): void {
    this.instance = null;
    this.isInitializing = false;
    this.connectionHealth = true;
  }

  // Optimized query method with retry logic
  public static async executeQuery(queryFunction: (client: SupabaseClient) => Promise<any>, retries = 2): Promise<any> {
    const client = this.getInstance();
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await queryFunction(client);
        
        // Check if the result indicates a connection issue
        if (result.error && result.error.message?.includes('connection')) {
          this.connectionHealth = false;
          
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
        }
        
        return result;
      } catch (error) {
        console.error(`Query attempt ${attempt + 1} failed:`, error);
        
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        
        throw error;
      }
    }
  }
}

// Export the singleton instance getter
export default OptimizedSupabaseClient.getInstance;
export const getSupabaseClient = OptimizedSupabaseClient.getInstance;
export const executeQuery = OptimizedSupabaseClient.executeQuery;
export const isSupabaseHealthy = OptimizedSupabaseClient.isHealthy;
export const resetSupabaseClient = OptimizedSupabaseClient.reset;
