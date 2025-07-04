import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Estimate schema for validation
const estimateSchema = z.object({
  client: z.string().min(1, 'Client is required'),
  estimateNumber: z.string().min(1, 'Estimate number is required'),
  amount: z.number().positive('Amount must be positive'),
  tax: z.number().min(0).optional(),
  discount: z.number().min(0).optional(),
  shippingAddress: z.string().optional(),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  signature: z.string().optional(),
  status: z.enum(['Draft', 'Sent', 'Accepted', 'Declined']).default('Draft'),
  date: z.string().optional(), // Will default to current date
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

// GET /api/estimates - List all estimates
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  
  let filteredEstimates = [...mockEstimates];

  // Filter by status if provided
  const status = searchParams.get('status');
  if (status) {
    filteredEstimates = filteredEstimates.filter(estimate => estimate.status === status);
  }

  // Search in client name, estimate number, notes
  const search = searchParams.get('search');
  if (search) {
    const searchLower = search.toLowerCase();
    filteredEstimates = filteredEstimates.filter(estimate =>
      estimate.client.toLowerCase().includes(searchLower) ||
      estimate.estimateNumber.toLowerCase().includes(searchLower) ||
      (estimate.notes && estimate.notes.toLowerCase().includes(searchLower))
    );
  }

  // Filter by date range
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  if (dateFrom) {
    filteredEstimates = filteredEstimates.filter(estimate => estimate.date >= dateFrom);
  }
  if (dateTo) {
    filteredEstimates = filteredEstimates.filter(estimate => estimate.date <= dateTo);
  }

  return successResponse(filteredEstimates);
}

// POST /api/estimates - Create a new estimate
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = estimateSchema.parse(body);

  const newEstimate: Estimate = {
    id: uuidv4(),
    ...validatedData,
    date: validatedData.date || new Date().toISOString().split('T')[0], // Current date if not provided
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockEstimates.push(newEstimate);
  return successResponse(newEstimate, undefined, 201);
}

// Export the handlers wrapped with authentication and error handling
export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
