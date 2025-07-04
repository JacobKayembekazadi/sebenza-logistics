import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { JWTPayload } from '@/lib/auth';

// Supplier update schema
const supplierUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  contactPerson: z.string().min(1, 'Contact person is required').optional(),
  email: z.string().email('Valid email is required').optional(),
  phone: z.string().min(1, 'Phone is required').optional(),
});

type Supplier = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
};

// Mock suppliers database - In production, this would be a real database
let mockSuppliers: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Global Logistics Solutions',
    contactPerson: 'John Smith',
    email: 'john@globallogistics.com',
    phone: '+27 11 123 4567',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'sup-2',
    name: 'African Freight Services',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@africanfreight.co.za',
    phone: '+27 21 987 6543',
    createdAt: '2025-01-14T14:30:00Z',
    updatedAt: '2025-01-14T14:30:00Z',
  },
];

// GET /api/suppliers/[id] - Get a specific supplier
async function GET_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const supplier = mockSuppliers.find(sup => sup.id === params.id);

  if (!supplier) {
    return errorResponse('Supplier not found', 404);
  }

  return successResponse(supplier);
}

// PUT /api/suppliers/[id] - Update a supplier
async function PUT_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const body = await request.json();
  const validatedData = supplierUpdateSchema.parse(body);

  const supplierIndex = mockSuppliers.findIndex(sup => sup.id === params.id);

  if (supplierIndex === -1) {
    return errorResponse('Supplier not found', 404);
  }

  const updatedSupplier = {
    ...mockSuppliers[supplierIndex],
    ...validatedData,
    updatedAt: new Date().toISOString(),
  };

  mockSuppliers[supplierIndex] = updatedSupplier;
  return successResponse(updatedSupplier);
}

// DELETE /api/suppliers/[id] - Delete a supplier
async function DELETE_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const supplierIndex = mockSuppliers.findIndex(sup => sup.id === params.id);

  if (supplierIndex === -1) {
    return errorResponse('Supplier not found', 404);
  }

  mockSuppliers.splice(supplierIndex, 1);
  return successResponse({ message: 'Supplier deleted successfully' });
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
