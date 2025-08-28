// Work/Creation-related types extracted from Registry API
// Following ADR-019 Registry Integration Pattern

export interface Creation {
  id: string;
  title: string;
  mediaUri: string;
  metadata?: Record<string, unknown>;
  status: 'DRAFT' | 'CURATED' | 'PUBLISHED' | 'ARCHIVED';
  createdAt?: string;
  updatedAt?: string;
  agentId?: string;
  tags?: string[];
}

export interface CreateCreationParams {
  title: string;
  mediaUri: string;
  agentId: string;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

export interface UpdateCreationParams {
  title?: string;
  mediaUri?: string;
  metadata?: Record<string, unknown>;
  status?: Creation['status'];
  tags?: string[];
}

export interface GetCreationsParams {
  agentId?: string;
  status?: Creation['status'];
  tags?: string[];
  include?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}