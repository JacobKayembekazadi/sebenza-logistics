import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { JWTPayload } from '@/lib/auth';

// Expense update schema
const expenseUpdateSchema = z.object({
  category: z.string().min(1, 'Category is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  date: z.string().optional(),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  isBillable: z.boolean().optional(),
  receiptUrl: z.string().url().optional(),
});

type Expense = {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  clientId?: string;
  projectId?: string;
  isBillable?: boolean;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
};

// Mock expenses database - In production, this would be a real database
let mockExpenses: Expense[] = [
  {
    id: 'exp-1',
    category: 'Transportation',
    description: 'Fuel for delivery trucks',
    amount: 2500,
    date: '2025-01-15',
    clientId: 'client-1',
    projectId: 'proj-1',
    isBillable: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'exp-2',
    category: 'Office Supplies',
    description: 'Stationery and office materials',
    amount: 350,
    date: '2025-01-16',
    isBillable: false,
    createdAt: '2025-01-16T14:30:00Z',
    updatedAt: '2025-01-16T14:30:00Z',
  },
];

// GET /api/expenses/[id] - Get a specific expense
async function GET_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const expense = mockExpenses.find(exp => exp.id === params.id);

  if (!expense) {
    return errorResponse('Expense not found', 404);
  }

  return successResponse(expense);
}

// PUT /api/expenses/[id] - Update an expense
async function PUT_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const body = await request.json();
  const validatedData = expenseUpdateSchema.parse(body);

  const expenseIndex = mockExpenses.findIndex(exp => exp.id === params.id);

  if (expenseIndex === -1) {
    return errorResponse('Expense not found', 404);
  }

  const updatedExpense = {
    ...mockExpenses[expenseIndex],
    ...validatedData,
    updatedAt: new Date().toISOString(),
  };

  mockExpenses[expenseIndex] = updatedExpense;
  return successResponse(updatedExpense);
}

// DELETE /api/expenses/[id] - Delete an expense
async function DELETE_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const expenseIndex = mockExpenses.findIndex(exp => exp.id === params.id);

  if (expenseIndex === -1) {
    return errorResponse('Expense not found', 404);
  }

  mockExpenses.splice(expenseIndex, 1);
  return successResponse({ message: 'Expense deleted successfully' });
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
