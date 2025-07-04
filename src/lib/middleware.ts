import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, hasRole, JWTPayload } from '@/lib/auth';
import { unauthorizedResponse, forbiddenResponse } from '@/lib/api-response';

export function requireAuth(handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = authenticateRequest(request);
    
    if (!user) {
      return unauthorizedResponse('Authentication required');
    }
    
    return handler(request, user);
  };
}

export function requireRole(role: 'admin' | 'user') {
  return function(handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>) {
    return async (request: NextRequest): Promise<NextResponse> => {
      const user = authenticateRequest(request);
      
      if (!user) {
        return unauthorizedResponse('Authentication required');
      }
      
      if (!hasRole(user, role)) {
        return forbiddenResponse('Insufficient permissions');
      }
      
      return handler(request, user);
    };
  };
}
