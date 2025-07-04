import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Supplier schema for validation
const supplierSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
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

// GET /api/suppliers - List all suppliers
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  
  let filteredSuppliers = [...mockSuppliers];

  // Search in name, contact person, email
  const search = searchParams.get('search');
  if (search) {
    const searchLower = search.toLowerCase();
    filteredSuppliers = filteredSuppliers.filter(supplier =>
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.contactPerson.toLowerCase().includes(searchLower) ||
      supplier.email.toLowerCase().includes(searchLower)
    );
  }

  return successResponse(filteredSuppliers);
}

// POST /api/suppliers - Create a new supplier
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = supplierSchema.parse(body);

  const newSupplier: Supplier = {
    id: uuidv4(),
    ...validatedData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockSuppliers.push(newSupplier);
  return successResponse(newSupplier, undefined, 201);
}

// Export the handlers wrapped with authentication and error handling
export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
