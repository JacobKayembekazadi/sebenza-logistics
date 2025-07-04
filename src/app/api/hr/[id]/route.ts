import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { JWTPayload } from '@/lib/auth';

// Job Posting update schema
const jobPostingUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  department: z.string().min(1, 'Department is required').optional(),
  location: z.string().min(1, 'Location is required').optional(),
  status: z.enum(['Open', 'Closed', 'Archived']).optional(),
});

type JobPosting = {
  id: string;
  title: string;
  department: string;
  location: string;
  status: 'Open' | 'Closed' | 'Archived';
  createdAt: string;
  updatedAt: string;
};

// Mock job postings database - In production, this would be a real database
let mockJobPostings: JobPosting[] = [
  {
    id: 'job-1',
    title: 'Warehouse Manager',
    department: 'Operations',
    location: 'Johannesburg',
    status: 'Open',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'job-2',
    title: 'Logistics Coordinator',
    department: 'Logistics',
    location: 'Cape Town',
    status: 'Open',
    createdAt: '2025-01-14T14:30:00Z',
    updatedAt: '2025-01-14T14:30:00Z',
  },
];

// GET /api/hr/[id] - Get a specific job posting
async function GET_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const jobPosting = mockJobPostings.find(job => job.id === params.id);

  if (!jobPosting) {
    return errorResponse('Job posting not found', 404);
  }

  return successResponse(jobPosting);
}

// PUT /api/hr/[id] - Update a job posting
async function PUT_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const body = await request.json();
  const validatedData = jobPostingUpdateSchema.parse(body);

  const jobIndex = mockJobPostings.findIndex(job => job.id === params.id);

  if (jobIndex === -1) {
    return errorResponse('Job posting not found', 404);
  }

  const updatedJobPosting = {
    ...mockJobPostings[jobIndex],
    ...validatedData,
    updatedAt: new Date().toISOString(),
  };

  mockJobPostings[jobIndex] = updatedJobPosting;
  return successResponse(updatedJobPosting);
}

// DELETE /api/hr/[id] - Delete a job posting
async function DELETE_handler(
  request: NextRequest,
  { params }: { params: { id: string } },
  user: JWTPayload
) {
  const jobIndex = mockJobPostings.findIndex(job => job.id === params.id);

  if (jobIndex === -1) {
    return errorResponse('Job posting not found', 404);
  }

  mockJobPostings.splice(jobIndex, 1);
  return successResponse({ message: 'Job posting deleted successfully' });
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
