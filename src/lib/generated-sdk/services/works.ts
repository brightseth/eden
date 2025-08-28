// Works/Creation service client for Registry SDK
// Following ADR-019 Registry Integration Pattern

import { Creation, CreateCreationParams, UpdateCreationParams, GetCreationsParams } from '../types/works';
import { BaseRegistryError, createRegistryError } from '../utils/errors';
import { withRetry, RetryConfig } from '../utils/retry';
import { MemoryCache, cached } from '../utils/cache';

export class WorksService {
  constructor(
    private request: <T>(path: string, options?: RequestInit, retries?: number) => Promise<T>,
    private cache?: MemoryCache,
    private retryConfig?: RetryConfig
  ) {}

  /**
   * Get all creations with optional filtering
   */
  async getCreations(params?: GetCreationsParams): Promise<Creation[]> {
    const fetchCreations = async () => {
      const searchParams = new URLSearchParams();
      
      if (params?.agentId) searchParams.append('agentId', params.agentId);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.tags?.length) searchParams.append('tags', params.tags.join(','));
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
      if (params?.sortBy) searchParams.append('sortBy', params.sortBy);
      if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder);
      
      const query = searchParams.toString();
      const path = `/creations${query ? `?${query}` : ''}`;
      
      // API might return different structures, handle both
      const response = await this.request<Creation[] | { creations: Creation[] }>(path);
      
      // Extract creations array regardless of response structure
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object' && 'creations' in response) {
        return response.creations;
      }
      
      return [];
    };

    if (this.retryConfig) {
      const result = await withRetry(fetchCreations, this.retryConfig);
      return result.data;
    }

    return fetchCreations();
  }

  /**
   * Get a specific creation by ID
   */
  async getCreation(id: string): Promise<Creation> {
    const fetchCreation = async () => {
      const path = `/creations/${id}`;
      
      try {
        return await this.request<Creation>(path);
      } catch (error: any) {
        if (error.statusCode === 404) {
          throw createRegistryError(404, `Creation '${id}' not found`, error.response);
        }
        throw error;
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(fetchCreation, this.retryConfig);
      return result.data;
    }

    return fetchCreation();
  }

  /**
   * Create a new creation
   */
  async createCreation(params: CreateCreationParams): Promise<Creation> {
    const createWork = async () => {
      const path = '/creations';
      
      try {
        const result = await this.request<Creation>(path, {
          method: 'POST',
          body: JSON.stringify(params)
        });

        // Invalidate related cache entries
        if (this.cache) {
          this.cache.invalidateByTag('works');
          if (params.agentId) {
            this.cache.invalidateByPattern(new RegExp(`agents.*${params.agentId}`));
          }
        }

        return result;
      } catch (error: any) {
        if (error.statusCode === 400) {
          throw createRegistryError(400, 'Invalid creation data', error.response);
        }
        throw error;
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(createWork, this.retryConfig);
      return result.data;
    }

    return createWork();
  }

  /**
   * Update an existing creation
   */
  async updateCreation(id: string, params: UpdateCreationParams): Promise<Creation> {
    const updateWork = async () => {
      const path = `/creations/${id}`;
      
      try {
        const result = await this.request<Creation>(path, {
          method: 'PATCH',
          body: JSON.stringify(params)
        });

        // Invalidate related cache entries
        if (this.cache) {
          this.cache.invalidateByTag('works');
          this.cache.invalidateByTag('work');
        }

        return result;
      } catch (error: any) {
        if (error.statusCode === 404) {
          throw createRegistryError(404, `Creation '${id}' not found`, error.response);
        }
        if (error.statusCode === 400) {
          throw createRegistryError(400, 'Invalid update data', error.response);
        }
        throw error;
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(updateWork, this.retryConfig);
      return result.data;
    }

    return updateWork();
  }

  /**
   * Delete a creation
   */
  async deleteCreation(id: string): Promise<{ success: boolean; message: string }> {
    const deleteWork = async () => {
      const path = `/creations/${id}`;
      
      try {
        const result = await this.request<{ success: boolean; message: string }>(path, {
          method: 'DELETE'
        });

        // Invalidate related cache entries
        if (this.cache) {
          this.cache.invalidateByTag('works');
          this.cache.invalidateByTag('work');
        }

        return result;
      } catch (error: any) {
        if (error.statusCode === 404) {
          throw createRegistryError(404, `Creation '${id}' not found`, error.response);
        }
        throw error;
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(deleteWork, this.retryConfig);
      return result.data;
    }

    return deleteWork();
  }

  /**
   * Get creations by agent
   */
  async getCreationsByAgent(agentId: string, params?: Omit<GetCreationsParams, 'agentId'>): Promise<Creation[]> {
    return this.getCreations({ ...params, agentId });
  }

  /**
   * Get creations by status
   */
  async getCreationsByStatus(status: Creation['status'], params?: Omit<GetCreationsParams, 'status'>): Promise<Creation[]> {
    return this.getCreations({ ...params, status });
  }

  /**
   * Search creations by title or tags
   */
  async searchCreations(query: string, params?: GetCreationsParams): Promise<Creation[]> {
    const creations = await this.getCreations(params);
    const searchTerm = query.toLowerCase();
    
    return creations.filter(creation => 
      creation.title.toLowerCase().includes(searchTerm) ||
      creation.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get creation statistics for an agent
   */
  async getAgentCreationStats(agentId: string): Promise<{
    total: number;
    published: number;
    draft: number;
    curated: number;
    archived: number;
  }> {
    const creations = await this.getCreationsByAgent(agentId);
    
    return {
      total: creations.length,
      published: creations.filter(c => c.status === 'PUBLISHED').length,
      draft: creations.filter(c => c.status === 'DRAFT').length,
      curated: creations.filter(c => c.status === 'CURATED').length,
      archived: creations.filter(c => c.status === 'ARCHIVED').length
    };
  }

  /**
   * Bulk update creation status
   */
  async bulkUpdateStatus(
    creationIds: string[], 
    status: Creation['status']
  ): Promise<{ success: boolean; updated: number; errors: string[] }> {
    const results = {
      success: true,
      updated: 0,
      errors: [] as string[]
    };

    for (const id of creationIds) {
      try {
        await this.updateCreation(id, { status });
        results.updated++;
      } catch (error) {
        results.success = false;
        results.errors.push(`Failed to update ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return results;
  }

  /**
   * Check if creation exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      await this.getCreation(id);
      return true;
    } catch (error) {
      if (error instanceof BaseRegistryError && error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }
}