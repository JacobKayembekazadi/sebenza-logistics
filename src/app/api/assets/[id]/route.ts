import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { JWTPayload } from '@/lib/auth';

// Asset update schema
const assetUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  quantity: z.number().int().positive('Quantity must be a positive integer').optional(),
  purchaseDate: z.string().optional(),
  value: z.number().positive('Value must be positive').optional(),
  receiptUrl: z.string().url().optional(),
});

type Asset = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  purchaseDate: string;
  value: number;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
};

// Mock assets database - In production, this would be a real database
let mockAssets: Asset[] = [
  {
    id: 'asset-1',
    name: 'Forklift',
    description: 'Toyota 8FG25 Forklift',
    quantity: 2,
    purchaseDate: '2024-06-15',
    value: 45000,
    receiptUrl: 'https://example.com/receipts/forklift-001.pdf',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
  },
  {
    id: 'asset-2',
    name: 'Delivery Truck',
    description: 'Isuzu NPR 4x2 Delivery Truck',
    quantity: 3,
    purchaseDate: '2024-08-20',
    value: 180000,
    createdAt: '2024-08-20T14:30:00Z',
    updatedAt: '2024-08-20T14:30:00Z',
  },
];

// GET /api/assets/[id] - Get a specific asset
async function GET_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const asset = mockAssets.find(ast => ast.id === params.id);

  if (!asset) {
    return errorResponse('Asset not found', 404);
  }

  return successResponse(asset);
}

// PUT /api/assets/[id] - Update an asset
async function PUT_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const body = await request.json();
  const validatedData = assetUpdateSchema.parse(body);

  const assetIndex = mockAssets.findIndex(ast => ast.id === params.id);

  if (assetIndex === -1) {
    return errorResponse('Asset not found', 404);
  }

  const updatedAsset = {
    ...mockAssets[assetIndex],
    ...validatedData,
    updatedAt: new Date().toISOString(),
  };

  mockAssets[assetIndex] = updatedAsset;
  return successResponse(updatedAsset);
}

// DELETE /api/assets/[id] - Delete an asset
async function DELETE_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const assetIndex = mockAssets.findIndex(ast => ast.id === params.id);

  if (assetIndex === -1) {
    return errorResponse('Asset not found', 404);
  }

  mockAssets.splice(assetIndex, 1);
  return successResponse({ message: 'Asset deleted successfully' });
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
