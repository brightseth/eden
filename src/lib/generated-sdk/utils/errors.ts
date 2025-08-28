// Standardized error handling for Registry SDK
// Following ADR-019 Registry Integration Pattern

export class BaseRegistryError extends Error {
  public code: string;
  public statusCode?: number;
  public requestId: string;
  public timestamp: Date;

  constructor(
    message: string,
    code: string,
    statusCode?: number,
    requestId: string = '',
    response?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.requestId = requestId;
    this.timestamp = new Date();
    this.response = response;
  }

  public response?: any;
}

// Specific error types as required by ADR-019
export class AgentNotFoundError extends BaseRegistryError {
  constructor(agentId: string, requestId: string = '') {
    super(
      `Agent with ID '${agentId}' not found`,
      'AGENT_NOT_FOUND',
      404,
      requestId
    );
  }
}

export class RateLimitError extends BaseRegistryError {
  constructor(retryAfter: number = 0, requestId: string = '') {
    super(
      `Rate limit exceeded. Retry after ${retryAfter} seconds`,
      'RATE_LIMIT_EXCEEDED',
      429,
      requestId
    );
    this.retryAfter = retryAfter;
  }

  public retryAfter: number;
}

export class ValidationError extends BaseRegistryError {
  constructor(message: string, fieldErrors?: Record<string, string>, requestId: string = '') {
    super(message, 'VALIDATION_ERROR', 400, requestId);
    this.fieldErrors = fieldErrors;
  }

  public fieldErrors?: Record<string, string>;
}

export class NetworkError extends BaseRegistryError {
  constructor(message: string, requestId: string = '') {
    super(message, 'NETWORK_ERROR', 0, requestId);
  }
}

export class AuthenticationError extends BaseRegistryError {
  constructor(message: string = 'Authentication failed', requestId: string = '') {
    super(message, 'AUTHENTICATION_ERROR', 401, requestId);
  }
}

export class AuthorizationError extends BaseRegistryError {
  constructor(message: string = 'Access denied', requestId: string = '') {
    super(message, 'AUTHORIZATION_ERROR', 403, requestId);
  }
}

export class WalletAuthError extends BaseRegistryError {
  constructor(message: string, requestId: string = '') {
    super(message, 'WALLET_AUTH_ERROR', 400, requestId);
  }
}

export class InternalServerError extends BaseRegistryError {
  constructor(message: string = 'Internal server error', requestId: string = '') {
    super(message, 'INTERNAL_SERVER_ERROR', 500, requestId);
  }
}

// Legacy compatibility - keep existing RegistryApiError but extend new base
export class RegistryApiError extends BaseRegistryError {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message, 'REGISTRY_API_ERROR', status, '', response);
  }
}

// Error factory function to create appropriate error types
export function createRegistryError(
  status: number,
  message: string,
  response?: any,
  requestId: string = ''
): BaseRegistryError {
  switch (status) {
    case 400:
      if (response?.fieldErrors) {
        return new ValidationError(message, response.fieldErrors, requestId);
      }
      return new ValidationError(message, undefined, requestId);
    
    case 401:
      return new AuthenticationError(message, requestId);
    
    case 403:
      return new AuthorizationError(message, requestId);
    
    case 404:
      // Try to extract agent ID from response or message
      const agentIdMatch = message.match(/agent.*?['"]([^'"]+)['"]/i);
      if (agentIdMatch) {
        return new AgentNotFoundError(agentIdMatch[1], requestId);
      }
      return new BaseRegistryError(message, 'NOT_FOUND', status, requestId, response);
    
    case 429:
      const retryAfter = response?.retryAfter || 0;
      return new RateLimitError(retryAfter, requestId);
    
    case 500:
    case 502:
    case 503:
    case 504:
      return new InternalServerError(message, requestId);
    
    default:
      return new BaseRegistryError(message, 'UNKNOWN_ERROR', status, requestId, response);
  }
}