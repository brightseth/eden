import { config } from '../config/config';
import { logger } from '../config/logger';
import { AppError } from '../middleware/errorHandler';

interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

class IPFSService {
  private pinataApiUrl = 'https://api.pinata.cloud';

  /**
   * Upload JSON data to IPFS via Pinata
   */
  async uploadJson(data: any): Promise<string> {
    try {
      if (!config.PINATA_API_KEY || !config.PINATA_SECRET_KEY) {
        logger.warn('IPFS credentials not configured, using mock CID');
        // Generate mock CID for development
        return this.generateMockCid(data);
      }

      const response = await fetch(`${this.pinataApiUrl}/pinning/pinJSONToIPFS`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': config.PINATA_API_KEY,
          'pinata_secret_api_key': config.PINATA_SECRET_KEY
        },
        body: JSON.stringify({
          pinataContent: data,
          pinataMetadata: {
            name: `Spirit-${Date.now()}`,
            keyvalues: {
              service: 'spirit-gateway',
              timestamp: new Date().toISOString()
            }
          },
          pinataOptions: {
            cidVersion: 1
          }
        })
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Pinata upload failed: ${error}`);
      }

      const result: PinataUploadResponse = await response.json();
      
      logger.info('IPFS upload successful', {
        cid: result.IpfsHash,
        pinSize: result.PinSize
      });

      return result.IpfsHash;
    } catch (error) {
      logger.error('IPFS upload failed', { error });
      
      if (config.IS_DEVELOPMENT) {
        // Fallback to mock CID in development
        return this.generateMockCid(data);
      }
      
      throw new AppError('Failed to upload to IPFS', 500);
    }
  }

  /**
   * Upload file to IPFS via Pinata
   */
  async uploadFile(file: Buffer, filename: string): Promise<string> {
    try {
      if (!config.PINATA_API_KEY || !config.PINATA_SECRET_KEY) {
        logger.warn('IPFS credentials not configured, using mock CID');
        return this.generateMockCid({ filename, size: file.length });
      }

      const formData = new FormData();
      const blob = new Blob([file]);
      formData.append('file', blob, filename);
      
      const metadata = JSON.stringify({
        name: filename,
        keyvalues: {
          service: 'spirit-gateway',
          type: 'file',
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 1
      });
      formData.append('pinataOptions', options);

      const response = await fetch(`${this.pinataApiUrl}/pinning/pinFileToIPFS`, {
        method: 'POST',
        headers: {
          'pinata_api_key': config.PINATA_API_KEY,
          'pinata_secret_api_key': config.PINATA_SECRET_KEY
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Pinata file upload failed: ${error}`);
      }

      const result: PinataUploadResponse = await response.json();
      
      logger.info('IPFS file upload successful', {
        filename,
        cid: result.IpfsHash,
        pinSize: result.PinSize
      });

      return result.IpfsHash;
    } catch (error) {
      logger.error('IPFS file upload failed', { error, filename });
      
      if (config.IS_DEVELOPMENT) {
        return this.generateMockCid({ filename, size: file.length });
      }
      
      throw new AppError('Failed to upload file to IPFS', 500);
    }
  }

  /**
   * Retrieve content from IPFS
   */
  async getJson(cid: string): Promise<any> {
    try {
      const url = `${config.IPFS_GATEWAY}/${cid}`;
      const response = await fetch(url, {
        timeout: 10000 // 10 second timeout
      } as any);

      if (!response.ok) {
        throw new Error(`IPFS fetch failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      logger.error('IPFS retrieval failed', { error, cid });
      throw new AppError(`Failed to retrieve content from IPFS: ${cid}`, 500);
    }
  }

  /**
   * Generate mock CID for development
   */
  private generateMockCid(data: any): string {
    const hash = this.simpleHash(JSON.stringify(data));
    return `Qm${hash.padEnd(44, '0')}`;
  }

  /**
   * Simple hash function for mock CIDs
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Check if IPFS is properly configured
   */
  isConfigured(): boolean {
    return !!(config.PINATA_API_KEY && config.PINATA_SECRET_KEY);
  }

  /**
   * Health check for IPFS service
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConfigured()) {
        return false;
      }

      // Test with a simple ping to Pinata
      const response = await fetch(`${this.pinataApiUrl}/data/testAuthentication`, {
        method: 'GET',
        headers: {
          'pinata_api_key': config.PINATA_API_KEY!,
          'pinata_secret_api_key': config.PINATA_SECRET_KEY!
        }
      });

      return response.ok;
    } catch (error) {
      logger.error('IPFS health check failed', { error });
      return false;
    }
  }
}

export const ipfsService = new IPFSService();