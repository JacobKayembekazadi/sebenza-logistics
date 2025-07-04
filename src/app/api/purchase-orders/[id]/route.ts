import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { JWTPayload } from '@/lib/auth';

// Purchase Order update schema
const purchaseOrderUpdateSchema = z.object({
  supplierId: z.string().min(1, 'Supplier ID is required').optional(),
  supplierName: z.string().min(1, 'Supplier name is required').optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  status: z.enum(['Draft', 'Sent', 'Fulfilled', 'Cancelled']).optional(),
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

// GET /api/purchase-orders/[id] - Get a specific purchase order
async function GET_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const purchaseOrder = mockPurchaseOrders.find(po => po.id === params.id);

  if (!purchaseOrder) {
    return errorResponse('Purchase order not found', 404);
  }

  return successResponse(purchaseOrder);
}

// PUT /api/purchase-orders/[id] - Update a purchase order
async function PUT_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const body = await request.json();
  const validatedData = purchaseOrderUpdateSchema.parse(body);

  const poIndex = mockPurchaseOrders.findIndex(po => po.id === params.id);

  if (poIndex === -1) {
    return errorResponse('Purchase order not found', 404);
  }

  const updatedPurchaseOrder = {
    ...mockPurchaseOrders[poIndex],
    ...validatedData,
    updatedAt: new Date().toISOString(),
  };

  mockPurchaseOrders[poIndex] = updatedPurchaseOrder;
  return successResponse(updatedPurchaseOrder);
}

// DELETE /api/purchase-orders/[id] - Delete a purchase order
async function DELETE_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const poIndex = mockPurchaseOrders.findIndex(po => po.id === params.id);

  if (poIndex === -1) {
    return errorResponse('Purchase order not found', 404);
  }

  mockPurchaseOrders.splice(poIndex, 1);
  return successResponse({ message: 'Purchase order deleted successfully' });
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
