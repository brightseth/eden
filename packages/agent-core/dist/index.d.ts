export interface Agent {
    id: string;
    handle: string;
    name: string;
    bio: string;
    status: 'active' | 'inactive' | 'developing';
    createdAt: string;
    updatedAt: string;
    prototypeUrl?: string;
    position: number;
    avatar?: string;
    socialLinks?: {
        twitter?: string;
        discord?: string;
        website?: string;
    };
}
export interface Work {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    agentId: string;
    createdAt: string;
    updatedAt: string;
    metadata?: {
        prompt?: string;
        style?: string;
        model?: string;
        dimensions?: {
            width: number;
            height: number;
        };
    };
}
export interface Cohort {
    id: string;
    name: string;
    year: number;
    description: string;
    agents: Agent[];
    status: 'active' | 'archived';
    createdAt: string;
    updatedAt: string;
}
export interface Studio {
    id: string;
    name: string;
    description: string;
    agentId: string;
    isPublic: boolean;
    works: Work[];
    createdAt: string;
    updatedAt: string;
}
export interface AgentMetrics {
    totalWorks: number;
    recentWorks: number;
    revenue?: number;
    holders?: number;
    launchDate: string;
    lastActiveAt: string;
}
export declare enum AgentStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DEVELOPING = "developing"
}
export declare enum CohortStatus {
    ACTIVE = "active",
    ARCHIVED = "archived"
}
