/**
 * API Utilities - Unified error handling and response formatting
 */

// Error codes enumeration
export const ErrorCode = {
  INVALID_PARAMETER: 'INVALID_PARAMETER',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMITED: 'RATE_LIMITED',
};

// Custom API Error class
export class ApiError extends Error {
  constructor(code, message, field = null, statusCode = 400) {
    super(message);
    this.code = code;
    this.field = field;
    this.statusCode = statusCode;
  }
}

/**
 * Create a successful API response
 */
export function successResponse(data, meta = null) {
  const response = {
    success: true,
    data,
  };
  if (meta) {
    response.meta = meta;
  }
  return response;
}

/**
 * Create an error API response
 */
export function errorResponse(code, message, field = null) {
  const response = {
    success: false,
    error: {
      code,
      message,
    },
  };
  if (field) {
    response.error.field = field;
  }
  return response;
}

/**
 * Parse and validate pagination parameters
 */
export function parsePagination(query, defaults = {}) {
  const {
    maxLimit = 200,
    defaultLimit = 50,
  } = defaults;

  const limit = Math.min(
    Math.max(1, Number(query.limit) || defaultLimit),
    maxLimit
  );
  const offset = Math.max(0, Number(query.offset) || 0);

  return { limit, offset };
}

/**
 * Parse numeric range parameters (min/max)
 */
export function parseNumericRange(query, field) {
  const minKey = `min${field.charAt(0).toUpperCase() + field.slice(1)}`;
  const maxKey = `max${field.charAt(0).toUpperCase() + field.slice(1)}`;

  const result = {};

  if (query[minKey] !== undefined && query[minKey] !== '') {
    const val = Number(query[minKey]);
    if (!isNaN(val)) {
      result.gte = val;
    }
  }

  if (query[maxKey] !== undefined && query[maxKey] !== '') {
    const val = Number(query[maxKey]);
    if (!isNaN(val)) {
      result.lte = val;
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Parse string filter (supports comma-separated values)
 */
export function parseStringFilter(value) {
  if (!value || typeof value !== 'string') return undefined;
  const values = value.split(',').map(v => v.trim()).filter(Boolean);
  return values.length > 0 ? values : undefined;
}

/**
 * Build pagination metadata
 */
export function buildPaginationMeta(total, limit, offset) {
  return {
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  };
}

/**
 * Express error handler middleware
 */
export function errorHandler(err, _req, res, _next) {
  console.error('API Error:', err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      errorResponse(err.code, err.message, err.field)
    );
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(409).json(
      errorResponse(ErrorCode.VALIDATION_ERROR, 'Resource already exists')
    );
  }

  if (err.code === 'P2025') {
    return res.status(404).json(
      errorResponse(ErrorCode.NOT_FOUND, 'Resource not found')
    );
  }

  // Default internal error
  return res.status(500).json(
    errorResponse(
      ErrorCode.INTERNAL_ERROR,
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message
    )
  );
}

/**
 * Async handler wrapper to catch errors
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
