import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Payment schema for validation
const paymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
  clientName: z.string().min(1, 'Client name is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().optional(), // Will default to current date
  method: z.enum(['Cash', 'Bank Transfer', 'Credit Card', 'Other']),
  notes: z.string().optional(),
});

type Payment = {
  id: string;
  invoiceId: string;
  clientName: string;
  amount: number;
  date: string;
  method: 'Cash' | 'Bank Transfer' | 'Credit Card' | 'Other';
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

// Mock payments database - In production, this would be a real database
let mockPayments: Payment[] = [
  {
    id: 'pay-1',
    invoiceId: 'inv-1',
    clientName: 'Acme Corporation',
    amount: 5000,
    date: '2025-01-15',
    method: 'Bank Transfer',
    notes: 'Payment for December services',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'pay-2',
    invoiceId: 'inv-2',
    clientName: 'TechCorp Ltd',
    amount: 3500,
    date: '2025-01-16',
    method: 'Credit Card',
    createdAt: '2025-01-16T14:30:00Z',
    updatedAt: '2025-01-16T14:30:00Z',
  },
];

// GET /api/payments - List all payments
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  
  let filteredPayments = [...mockPayments];

  // Filter by payment method if provided
  const method = searchParams.get('method');
  if (method) {
    filteredPayments = filteredPayments.filter(payment => payment.method === method);
  }

  // Filter by invoice if provided
  const invoiceId = searchParams.get('invoiceId');
  if (invoiceId) {
    filteredPayments = filteredPayments.filter(payment => payment.invoiceId === invoiceId);
  }

  // Search in client name, notes
  const search = searchParams.get('search');
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPayments = filteredPayments.filter(payment =>
      payment.clientName.toLowerCase().includes(searchLower) ||
      (payment.notes && payment.notes.toLowerCase().includes(searchLower))
    );
  }

  // Filter by date range
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  if (dateFrom) {
    filteredPayments = filteredPayments.filter(payment => payment.date >= dateFrom);
  }
  if (dateTo) {
    filteredPayments = filteredPayments.filter(payment => payment.date <= dateTo);
  }

  return successResponse(filteredPayments);
}

// POST /api/payments - Create a new payment
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = paymentSchema.parse(body);

  const newPayment: Payment = {
    id: uuidv4(),
    ...validatedData,
    date: validatedData.date || new Date().toISOString().split('T')[0], // Current date if not provided
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockPayments.push(newPayment);
  return successResponse(newPayment, undefined, 201);
}

// Export the handlers wrapped with authentication and error handling
export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
