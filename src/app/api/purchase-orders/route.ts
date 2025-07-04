import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Purchase Order schema for validation
const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'Supplier ID is required'),
  supplierName: z.string().min(1, 'Supplier name is required'),
  amount: z.number().positive('Amount must be positive'),
  status: z.enum(['Draft', 'Sent', 'Fulfilled', 'Cancelled']).default('Draft'),
});

type PurchaseOrder = {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  date: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Fulfilled' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
};

// Mock purchase orders database - In production, this would be a real database
let mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-1',
    poNumber: 'PO-2025-001',
    supplierId: 'sup-1',
    supplierName: 'Global Logistics Solutions',
    date: '2025-01-15',
    amount: 25000,
    status: 'Sent',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'po-2',
    poNumber: 'PO-2025-002',
    supplierId: 'sup-2',
    supplierName: 'African Freight Services',
    date: '2025-01-16',
    amount: 15000,
    status: 'Draft',
    createdAt: '2025-01-16T14:30:00Z',
    updatedAt: '2025-01-16T14:30:00Z',
  },
];

let poCounter = 3; // For generating PO numbers

// GET /api/purchase-orders - List all purchase orders
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  
  let filteredPOs = [...mockPurchaseOrders];

  // Filter by status if provided
  const status = searchParams.get('status');
  if (status) {
    filteredPOs = filteredPOs.filter(po => po.status === status);
  }

  // Filter by supplier if provided
  const supplierId = searchParams.get('supplierId');
  if (supplierId) {
    filteredPOs = filteredPOs.filter(po => po.supplierId === supplierId);
  }

  // Search in PO number, supplier name
  const search = searchParams.get('search');
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPOs = filteredPOs.filter(po =>
      po.poNumber.toLowerCase().includes(searchLower) ||
      po.supplierName.toLowerCase().includes(searchLower)
    );
  }

  return successResponse(filteredPOs);
}

// POST /api/purchase-orders - Create a new purchase order
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = purchaseOrderSchema.parse(body);

  const newPurchaseOrder: PurchaseOrder = {
    id: uuidv4(),
    poNumber: `PO-2025-${String(poCounter).padStart(3, '0')}`,
    ...validatedData,
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  poCounter++;
  mockPurchaseOrders.push(newPurchaseOrder);
  return successResponse(newPurchaseOrder, undefined, 201);
}

// Export the handlers wrapped with authentication and error handling
export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
