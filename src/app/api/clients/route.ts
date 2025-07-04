import { NextRequest } from 'next/server';
import { clientSchema, paginationSchema } from '@/lib/validations';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { clients as initialClients, Client } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Mock clients database - In production, this would be a real database
let mockClients: Client[] = [...initialClients];

// GET /api/clients - List all clients with pagination and search
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  const params = paginationSchema.parse(Object.fromEntries(searchParams));

  let filteredClients = [...mockClients];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredClients = filteredClients.filter(client =>
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.toLowerCase().includes(searchLower) ||
      client.address.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    filteredClients.sort((a, b) => {
      const aValue = a[params.sortBy as keyof Client];
      const bValue = b[params.sortBy as keyof Client];
      
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
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  const pagination = {
    page: params.page,
    limit: params.limit,
    total: filteredClients.length,
    totalPages: Math.ceil(filteredClients.length / params.limit),
  };

  return successResponse(paginatedClients, 'Clients retrieved successfully', 200, pagination);
}

// POST /api/clients - Create a new client
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = clientSchema.parse(body);

  const newClient: Client = {
    id: uuidv4(),
    ...validatedData,
    avatar: `https://placehold.co/100x100/A6B1E1/FFFFFF.png`, // Default avatar
  };

  mockClients.push(newClient);

  return successResponse(newClient, 'Client created successfully', 201);
}

export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
