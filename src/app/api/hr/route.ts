import { NextRequest } from 'next/server';
import { z } from 'zod';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Job Posting schema for validation
const jobPostingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['Open', 'Closed', 'Archived']).default('Open'),
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

// GET /api/hr - List all job postings
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  
  let filteredJobPostings = [...mockJobPostings];

  // Filter by status if provided
  const status = searchParams.get('status');
  if (status) {
    filteredJobPostings = filteredJobPostings.filter(job => job.status === status);
  }

  // Filter by department if provided
  const department = searchParams.get('department');
  if (department) {
    filteredJobPostings = filteredJobPostings.filter(job => 
      job.department.toLowerCase().includes(department.toLowerCase())
    );
  }

  // Search in title, department, location
  const search = searchParams.get('search');
  if (search) {
    const searchLower = search.toLowerCase();
    filteredJobPostings = filteredJobPostings.filter(job =>
      job.title.toLowerCase().includes(searchLower) ||
      job.department.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower)
    );
  }

  return successResponse(filteredJobPostings);
}

// POST /api/hr - Create a new job posting
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = jobPostingSchema.parse(body);

  const newJobPosting: JobPosting = {
    id: uuidv4(),
    ...validatedData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockJobPostings.push(newJobPosting);
  return successResponse(newJobPosting, undefined, 201);
}

// Export the handlers wrapped with authentication and error handling
export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
