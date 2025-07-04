import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { JWTPayload } from '@/lib/auth';

// Estimate update schema
const estimateUpdateSchema = z.object({
  client: z.string().min(1, 'Client is required').optional(),
  estimateNumber: z.string().min(1, 'Estimate number is required').optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  shippingAddress: z.string().optional(),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  signature: z.string().optional(),
  status: z.enum(['Draft', 'Sent', 'Accepted', 'Declined']).optional(),
  date: z.string().optional(),
});

type Estimate = {
  id: string;
  client: string;
  estimateNumber: string;
  amount: number;
  tax?: number;
  discount?: number;
  shippingAddress?: string;
  notes?: string;
  termsAndConditions?: string;
  signature?: string;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Declined';
  date: string;
  createdAt: string;
  updatedAt: string;
};

// Mock estimates database - In production, this would be a real database
let mockEstimates: Estimate[] = [
  {
    id: 'est-1',
    client: 'Acme Corporation',
    estimateNumber: 'EST-2025-001',
    amount: 15000,
    tax: 1200,
    discount: 0,
    status: 'Sent',
    date: '2025-01-15',
    notes: 'Logistics services for Q1 2025',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'est-2',
    client: 'TechCorp Ltd',
    estimateNumber: 'EST-2025-002',
    amount: 8500,
    tax: 680,
    discount: 500,
    status: 'Draft',
    date: '2025-01-16',
    notes: 'Warehouse management services',
    createdAt: '2025-01-16T14:30:00Z',
    updatedAt: '2025-01-16T14:30:00Z',
  },
];

// GET /api/estimates/[id] - Get a specific estimate
async function GET_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const estimate = mockEstimates.find(est => est.id === params.id);

  if (!estimate) {
    return errorResponse('Estimate not found', 404);
  }

  return successResponse(estimate);
}

// PUT /api/estimates/[id] - Update an estimate
async function PUT_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const body = await request.json();
  const validatedData = estimateUpdateSchema.parse(body);

  const estimateIndex = mockEstimates.findIndex(est => est.id === params.id);

  if (estimateIndex === -1) {
    return errorResponse('Estimate not found', 404);
  }

  const updatedEstimate = {
    ...mockEstimates[estimateIndex],
    ...validatedData,
    updatedAt: new Date().toISOString(),
  };

  mockEstimates[estimateIndex] = updatedEstimate;
  return successResponse(updatedEstimate);
}

// DELETE /api/estimates/[id] - Delete an estimate
async function DELETE_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const estimateIndex = mockEstimates.findIndex(est => est.id === params.id);

  if (estimateIndex === -1) {
    return errorResponse('Estimate not found', 404);
  }

  mockEstimates.splice(estimateIndex, 1);
  return successResponse({ message: 'Estimate deleted successfully' });
}

// Export the handlers wrapped with authentication and error handling
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return withErrorHandling(requireAuth((req, user) => GET_handler(req, context, user)))(request);
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return withErrorHandling(requireAuth((req, user) => PUT_handler(req, context, user)))(request);
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  return withErrorHandling(requireAuth((req, user) => DELETE_handler(req, context, user)))(request);
}
