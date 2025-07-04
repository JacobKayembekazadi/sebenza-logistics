import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Asset schema for validation
const assetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
  purchaseDate: z.string(),
  value: z.number().positive('Value must be positive'),
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

// GET /api/assets - List all assets
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  
  let filteredAssets = [...mockAssets];

  // Search in name, description
  const search = searchParams.get('search');
  if (search) {
    const searchLower = search.toLowerCase();
    filteredAssets = filteredAssets.filter(asset =>
      asset.name.toLowerCase().includes(searchLower) ||
      asset.description.toLowerCase().includes(searchLower)
    );
  }

  // Filter by value range
  const minValue = searchParams.get('minValue');
  const maxValue = searchParams.get('maxValue');
  if (minValue) {
    filteredAssets = filteredAssets.filter(asset => asset.value >= Number(minValue));
  }
  if (maxValue) {
    filteredAssets = filteredAssets.filter(asset => asset.value <= Number(maxValue));
  }

  // Filter by purchase date range
  const dateFrom = searchParams.get('dateFrom');
  const dateTo = searchParams.get('dateTo');
  if (dateFrom) {
    filteredAssets = filteredAssets.filter(asset => asset.purchaseDate >= dateFrom);
  }
  if (dateTo) {
    filteredAssets = filteredAssets.filter(asset => asset.purchaseDate <= dateTo);
  }

  return successResponse(filteredAssets);
}

// POST /api/assets - Create a new asset
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = assetSchema.parse(body);

  const newAsset: Asset = {
    id: uuidv4(),
    ...validatedData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockAssets.push(newAsset);
  return successResponse(newAsset, undefined, 201);
}

// Export the handlers wrapped with authentication and error handling
export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
