import { NextRequest } from 'next/server';
import { warehouseSchema, paginationSchema } from '@/lib/validations';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { warehouses as initialWarehouses, Warehouse } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Mock warehouses database - In production, this would be a real database
let mockWarehouses: Warehouse[] = [...initialWarehouses];

// GET /api/warehouses - List all warehouses with pagination and search
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  const params = paginationSchema.parse(Object.fromEntries(searchParams));

  let filteredWarehouses = [...mockWarehouses];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredWarehouses = filteredWarehouses.filter(warehouse =>
      warehouse.name.toLowerCase().includes(searchLower) ||
      warehouse.location.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    filteredWarehouses.sort((a, b) => {
      const aValue = a[params.sortBy as keyof Warehouse];
      const bValue = b[params.sortBy as keyof Warehouse];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return params.sortOrder === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      
      return 0;
    });
  }

  // Apply pagination
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  const paginatedWarehouses = filteredWarehouses.slice(startIndex, endIndex);

  const pagination = {
    page: params.page,
    limit: params.limit,
    total: filteredWarehouses.length,
    totalPages: Math.ceil(filteredWarehouses.length / params.limit),
  };

  return successResponse(paginatedWarehouses, 'Warehouses retrieved successfully', 200, pagination);
}

// POST /api/warehouses - Create a new warehouse
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = warehouseSchema.parse(body);

  const newWarehouse: Warehouse = {
    id: uuidv4(),
    ...validatedData,
  };

  mockWarehouses.push(newWarehouse);

  return successResponse(newWarehouse, 'Warehouse created successfully', 201);
}

export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
