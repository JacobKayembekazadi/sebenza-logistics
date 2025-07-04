import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200,
  pagination?: APIResponse['pagination']
): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      ...(pagination && { pagination }),
    },
    { status }
  );
}

export function errorResponse(
  error: string,
  status: number = 400,
  errors?: Array<{ field: string; message: string }>
): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      ...(errors && { errors }),
    },
    { status }
  );
}

export function validationErrorResponse(error: ZodError): NextResponse<APIResponse> {
  const errors = error.errors.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }));

  return NextResponse.json(
    {
      success: false,
      error: 'Validation failed',
      errors,
    },
    { status: 400 }
  );
}

export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 401 }
  );
}

export function forbiddenResponse(message: string = 'Forbidden'): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 403 }
  );
}

export function notFoundResponse(message: string = 'Resource not found'): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 404 }
  );
}

export function serverErrorResponse(message: string = 'Internal server error'): NextResponse<APIResponse> {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    { status: 500 }
  );
}

// Helper to handle async API routes with error catching
export function withErrorHandling<T extends any[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof ZodError) {
        return validationErrorResponse(error);
      }
      
      return serverErrorResponse(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };
}
