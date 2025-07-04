import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Expense schema for validation
const expenseSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().positive('Amount must be positive'),
  date: z.string().optional(), // Will default to current date
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  isBillable: z.boolean().default(false),
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

// GET /api/expenses - List all expenses
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  
  let filteredExpenses = [...mockExpenses];

  // Filter by category if provided
  const category = searchParams.get('category');
  if (category) {
    filteredExpenses = filteredExpenses.filter(expense => 
      expense.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  // Filter by billable status if provided
  const isBillable = searchParams.get('isBillable');
  if (isBillable !== null) {
    filteredExpenses = filteredExpenses.filter(expense => 
      expense.isBillable === (isBillable === 'true')
    );
  }

  // Filter by client if provided
  const clientId = searchParams.get('clientId');
  if (clientId) {
    filteredExpenses = filteredExpenses.filter(expense => expense.clientId === clientId);
  }

  // Filter by project if provided
  const projectId = searchParams.get('projectId');
  if (projectId) {
    filteredExpenses = filteredExpenses.filter(expense => expense.projectId === projectId);
  }

  // Search in description, category
  const search = searchParams.get('search');
  if (search) {
    const searchLower = search.toLowerCase();
    filteredExpenses = filteredExpenses.filter(expense =>
      expense.description.toLowerCase().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower)
    );
  }

  // Filter by date range
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  if (dateFrom) {
    filteredExpenses = filteredExpenses.filter(expense => expense.date >= dateFrom);
  }
  if (dateTo) {
    filteredExpenses = filteredExpenses.filter(expense => expense.date <= dateTo);
  }

  return successResponse(filteredExpenses);
}

// POST /api/expenses - Create a new expense
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = expenseSchema.parse(body);

  const newExpense: Expense = {
    id: uuidv4(),
    ...validatedData,
    date: validatedData.date || new Date().toISOString().split('T')[0], // Current date if not provided
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockExpenses.push(newExpense);
  return successResponse(newExpense, undefined, 201);
}

// Export the handlers wrapped with authentication and error handling
export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
