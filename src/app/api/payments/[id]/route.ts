import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { JWTPayload } from '@/lib/auth';

// Payment update schema
const paymentUpdateSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required').optional(),
  clientName: z.string().min(1, 'Client name is required').optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  date: z.string().optional(),
  method: z.enum(['Cash', 'Bank Transfer', 'Credit Card', 'Other']).optional(),
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

// GET /api/payments/[id] - Get a specific payment
async function GET_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const payment = mockPayments.find(pay => pay.id === params.id);

  if (!payment) {
    return errorResponse('Payment not found', 404);
  }

  return successResponse(payment);
}

// PUT /api/payments/[id] - Update a payment
async function PUT_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const body = await request.json();
  const validatedData = paymentUpdateSchema.parse(body);

  const paymentIndex = mockPayments.findIndex(pay => pay.id === params.id);

  if (paymentIndex === -1) {
    return errorResponse('Payment not found', 404);
  }

  const updatedPayment = {
    ...mockPayments[paymentIndex],
    ...validatedData,
    updatedAt: new Date().toISOString(),
  };

  mockPayments[paymentIndex] = updatedPayment;
  return successResponse(updatedPayment);
}

// DELETE /api/payments/[id] - Delete a payment
async function DELETE_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const paymentIndex = mockPayments.findIndex(pay => pay.id === params.id);

  if (paymentIndex === -1) {
    return errorResponse('Payment not found', 404);
  }

  mockPayments.splice(paymentIndex, 1);
  return successResponse({ message: 'Payment deleted successfully' });
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
