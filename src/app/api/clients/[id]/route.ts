import { NextRequest } from 'next/server';
import { updateClientSchema } from '@/lib/validations';
import { successResponse, notFoundResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { clients as initialClients, Client } from '@/lib/data';
import { JWTPayload } from '@/lib/auth';

// Mock clients database - In production, this would be a real database
let mockClients: Client[] = [...initialClients];

// GET /api/clients/[id] - Get a specific client
async function GET_handler(
  request: NextRequest,
  user: JWTPayload,
  { params }: { params: { id: string } }
) {
  const client = mockClients.find(c => c.id === params.id);
  
  if (!client) {
    return notFoundResponse('Client not found');
  }

  return successResponse(client, 'Client retrieved successfully');
}

// PUT /api/clients/[id] - Update a specific client
async function PUT_handler(
  request: NextRequest,
  user: JWTPayload,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validatedData = updateClientSchema.parse({ ...body, id: params.id });
  
  const clientIndex = mockClients.findIndex(c => c.id === params.id);
  
  if (clientIndex === -1) {
    return notFoundResponse('Client not found');
  }

  // Update the client
  const updatedClient = {
    ...mockClients[clientIndex],
    ...validatedData,
  };
  
  mockClients[clientIndex] = updatedClient;

  return successResponse(updatedClient, 'Client updated successfully');
}

// DELETE /api/clients/[id] - Delete a specific client
async function DELETE_handler(
  request: NextRequest,
  user: JWTPayload,
  { params }: { params: { id: string } }
) {
  const clientIndex = mockClients.findIndex(c => c.id === params.id);
  
  if (clientIndex === -1) {
    return notFoundResponse('Client not found');
  }

  // Remove the client
  mockClients.splice(clientIndex, 1);

  return successResponse(null, 'Client deleted successfully');
}

// Create wrapped handlers that handle the params properly
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  return withErrorHandling(requireAuth(
    (req: NextRequest, user: JWTPayload) => GET_handler(req, user, context)
  ))(request);
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  return withErrorHandling(requireAuth(
    (req: NextRequest, user: JWTPayload) => PUT_handler(req, user, context)
  ))(request);
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  return withErrorHandling(requireAuth(
    (req: NextRequest, user: JWTPayload) => DELETE_handler(req, user, context)
  ))(request);
}
