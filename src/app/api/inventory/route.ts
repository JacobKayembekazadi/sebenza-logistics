import { NextRequest } from 'next/server';
import { stockItemSchema, paginationSchema } from '@/lib/validations';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { stockItems as initialStockItems, StockItem } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Mock stock items database - In production, this would be a real database
let mockStockItems: StockItem[] = [...initialStockItems];

// GET /api/inventory - List all stock items with pagination and search
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  const params = paginationSchema.parse(Object.fromEntries(searchParams));

  let filteredStockItems = [...mockStockItems];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredStockItems = filteredStockItems.filter(item =>
      item.reference.toLowerCase().includes(searchLower) ||
      item.senderName.toLowerCase().includes(searchLower) ||
      item.receiverName.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower)
    );
  }

  // Filter by warehouse if provided
  const warehouseId = searchParams.get('warehouseId');
  if (warehouseId) {
    filteredStockItems = filteredStockItems.filter(item => item.warehouseId === warehouseId);
  }

  // Filter by status if provided
  const status = searchParams.get('status');
  if (status) {
    filteredStockItems = filteredStockItems.filter(item => item.status === status);
  }

  // Apply sorting
  if (params.sortBy) {
    filteredStockItems.sort((a, b) => {
      const aValue = a[params.sortBy as keyof StockItem];
      const bValue = b[params.sortBy as keyof StockItem];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return params.sortOrder === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return params.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
      }
      
      return 0;
    });
  }

  // Apply pagination
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  const paginatedStockItems = filteredStockItems.slice(startIndex, endIndex);

  const pagination = {
    page: params.page,
    limit: params.limit,
    total: filteredStockItems.length,
    totalPages: Math.ceil(filteredStockItems.length / params.limit),
  };

  return successResponse(paginatedStockItems, 'Stock items retrieved successfully', 200, pagination);
}

// POST /api/inventory - Create a new stock item
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = stockItemSchema.parse(body);

  const newStockItem: StockItem = {
    id: uuidv4(),
    ...validatedData,
    warehouseName: validatedData.warehouseId ? 'Main Warehouse' : undefined, // In production, fetch from warehouse table
  };

  mockStockItems.push(newStockItem);

  return successResponse(newStockItem, 'Stock item created successfully', 201);
}

export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
