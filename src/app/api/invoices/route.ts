import { NextRequest } from 'next/server';
import { invoiceSchema, paginationSchema } from '@/lib/validations';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { invoices as initialInvoices, Invoice } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Mock invoices database - In production, this would be a real database
let mockInvoices: Invoice[] = [...initialInvoices];

// GET /api/invoices - List all invoices with pagination and search
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  const params = paginationSchema.parse(Object.fromEntries(searchParams));

  let filteredInvoices = [...mockInvoices];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredInvoices = filteredInvoices.filter(invoice =>
      invoice.id.toLowerCase().includes(searchLower) ||
      invoice.client.toLowerCase().includes(searchLower)
    );
  }

  // Filter by client if clientId is provided
  const clientId = searchParams.get('clientId');
  if (clientId) {
    filteredInvoices = filteredInvoices.filter(invoice => invoice.client === clientId);
  }

  // Filter by project if projectId is provided
  const projectId = searchParams.get('projectId');
  if (projectId) {
    filteredInvoices = filteredInvoices.filter(invoice => invoice.projectId === projectId);
  }

  // Filter by status if provided
  const status = searchParams.get('status');
  if (status) {
    filteredInvoices = filteredInvoices.filter(invoice => invoice.status === status);
  }

  // Apply sorting
  if (params.sortBy) {
    filteredInvoices.sort((a, b) => {
      const aValue = a[params.sortBy as keyof Invoice];
      const bValue = b[params.sortBy as keyof Invoice];
      
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
  const paginatedInvoices = filteredInvoices.slice(startIndex, endIndex);

  const pagination = {
    page: params.page,
    limit: params.limit,
    total: filteredInvoices.length,
    totalPages: Math.ceil(filteredInvoices.length / params.limit),
  };

  return successResponse(paginatedInvoices, 'Invoices retrieved successfully', 200, pagination);
}

// POST /api/invoices - Create a new invoice
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = invoiceSchema.parse(body);

  // Generate invoice ID
  const invoiceCount = mockInvoices.length + 1;
  const invoiceId = `INV-${invoiceCount.toString().padStart(3, '0')}`;

  const newInvoice: Invoice = {
    id: invoiceId,
    ...validatedData,
  };

  mockInvoices.push(newInvoice);

  return successResponse(newInvoice, 'Invoice created successfully', 201);
}

export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
