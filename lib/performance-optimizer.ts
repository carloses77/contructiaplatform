
// Optimized performance utilities for ConstructIA platform
// Native implementation without external dependencies

interface CacheItem {
  data: any;
  timestamp: number;
  ttl: number;
}

class OptimizedCache {
  private cache = new Map<string, CacheItem>();
  private maxSize = 50; // Increased for better performance

  set(key: string, data: any, ttl: number = 600000): void { // 10 minutes TTL
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item || Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    return !!(item && Date.now() - item.timestamp <= item.ttl);
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

// Optimized cache instance
export const optimizedCache = new OptimizedCache();

// Native debounce implementation
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func.apply(null, args);
    }, wait);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Query optimizer for Supabase
export function optimizeQuery(baseQuery: any, options: {
  limit?: number;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  filters?: Array<{ column: string; operator: string; value: any }>;
}) {
  let query = baseQuery;

  // Apply select first to reduce data transfer
  if (options.select) {
    query = query.select(options.select);
  }

  // Apply filters to reduce dataset
  if (options.filters) {
    options.filters.forEach(filter => {
      switch (filter.operator) {
        case 'eq':
          query = query.eq(filter.column, filter.value);
          break;
        case 'neq':
          query = query.neq(filter.column, filter.value);
          break;
        case 'gt':
          query = query.gt(filter.column, filter.value);
          break;
        case 'lt':
          query = query.lt(filter.column, filter.value);
          break;
        case 'gte':
          query = query.gte(filter.column, filter.value);
          break;
        case 'lte':
          query = query.lte(filter.column, filter.value);
          break;
        case 'in':
          query = query.in(filter.column, filter.value);
          break;
        default:
          break;
      }
    });
  }

  // Apply limit to reduce load
  if (options.limit) {
    query = query.limit(options.limit);
  }

  // Apply order at the end
  if (options.orderBy) {
    query = query.order(options.orderBy.column, { 
      ascending: options.orderBy.ascending ?? true 
    });
  }

  return query;
}

// Batch operations optimizer
export async function batchOperation<T>(
  items: T[],
  operation: (item: T) => Promise<any>,
  batchSize: number = 10
): Promise<any[]> {
  const results: any[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(operation));
    results.push(...batchResults);
    
    // Small delay between batches to prevent overwhelming
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}

// Memory cleanup and optimization
export function cleanupMemory(): void {
  // Clear cache if it gets too large
  if (optimizedCache.size() > 30) {
    optimizedCache.clear();
  }

  // Clear orphaned references
  if (typeof window !== 'undefined') {
    // Force garbage collection if available (dev mode)
    if ('gc' in window && process.env.NODE_ENV === 'development') {
      (window as any).gc();
    }
  }
}

// Connection health checker
export async function checkSupabaseConnection(supabase: any): Promise<boolean> {
  try {
    const { error } = await supabase.from('clients').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

// Data validation utilities
export function validateData(data: any, requiredFields: string[]): boolean {
  if (!data || typeof data !== 'object') return false;
  
  return requiredFields.every(field => {
    const value = data[field];
    return value !== null && value !== undefined && value !== '';
  });
}

// Error handling wrapper
export function withErrorHandling<T extends (...args: any[]) => any>(
  func: T,
  fallback?: (...args: Parameters<T>) => ReturnType<T>
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = func(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch(error => {
          console.error('Error in function:', error);
          return fallback ? fallback(...args) : null;
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error in function:', error);
      return fallback ? fallback(...args) : null;
    }
  }) as T;
}

// Performance monitoring
export class PerformanceMonitor {
  private static measurements = new Map<string, number>();

  static startMeasurement(key: string): void {
    this.measurements.set(key, performance.now());
  }

  static endMeasurement(key: string): number {
    const start = this.measurements.get(key);
    if (!start) return 0;
    
    const duration = performance.now() - start;
    this.measurements.delete(key);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance [${key}]: ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }
}

export default {
  optimizedCache,
  debounce,
  throttle,
  optimizeQuery,
  batchOperation,
  cleanupMemory,
  checkSupabaseConnection,
  validateData,
  withErrorHandling,
  PerformanceMonitor
};
