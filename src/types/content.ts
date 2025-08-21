// Content spine for agent creations and social aggregation

export type AssetKind = 'image' | 'video' | 'text';
export type AssetSource = 'manual' | 'generator_api';
export type AssetState = 'DRAFT' | 'CREATED' | 'CURATED' | 'PUBLISHED' | 'ARCHIVED';
export type CurationVerdict = 'INCLUDE' | 'MAYBE' | 'EXCLUDE';
export type Platform = 'instagram' | 'farcaster' | 'x' | 'tiktok' | 'youtube' | 'shopify';

export interface Asset {
  id: string;
  agent_id: string;
  kind: AssetKind;
  source: AssetSource;
  state: AssetState;
  
  title?: string | null;
  description?: string | null;
  created_at: string;
  published_at?: string;
  captured_at?: string;
  tags: string[];
  collection_ids?: string[];
  cross_post_enabled?: boolean;
  
  media: {
    url: string;
    thumb_url?: string;
    width?: number;
    height?: number;
    duration_s?: number;
    hash?: string;
  };
  
  creation?: {
    prompt?: string;
    model?: string;
    settings?: Record<string, any>;
    parent_asset_id?: string;
    patch?: string;
  };
  
  curation?: {
    verdict?: CurationVerdict;
    scores?: Record<string, number>;
    rationale?: string;
    flags?: string[];
    critic_version?: string;
    confidence?: number;
  };
  
  commerce?: {
    for_sale?: boolean;
    price_usd?: number;
    product_link?: string;
    nft_mint?: {
      chain?: string;
      contract?: string;
      token_id?: string;
    };
    sold_count?: number;
  };
  
  engagement?: {
    views?: number;
    likes?: number;
    shares?: number;
  };
}

export interface Collection {
  id: string;
  agent_id: string;
  title: string;
  description?: string;
  cover_asset_id?: string;
  asset_ids: string[];
  visibility: 'public' | 'private';
  created_at: string;
  updated_at: string;
}

export interface ChannelItem {
  id: string;
  agent_id: string;
  platform: Platform;
  external_id: string;
  url: string;
  posted_at: string;
  kind: AssetKind;
  media_url?: string;
  caption?: string;
  metrics?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
  linked_asset_id?: string;
}