import { NextRequest } from 'next/server';
import { projectSchema, paginationSchema } from '@/lib/validations';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { projects as initialProjects, Project } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Mock projects database - In production, this would be a real database
let mockProjects: Project[] = [...initialProjects];

// GET /api/projects - List all projects with pagination and search
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  const params = paginationSchema.parse(Object.fromEntries(searchParams));

  let filteredProjects = [...mockProjects];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredProjects = filteredProjects.filter(project =>
      project.name.toLowerCase().includes(searchLower) ||
      project.location.toLowerCase().includes(searchLower) ||
      project.description.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    filteredProjects.sort((a, b) => {
      const aValue = a[params.sortBy as keyof Project];
      const bValue = b[params.sortBy as keyof Project];
      
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
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const pagination = {
    page: params.page,
    limit: params.limit,
    total: filteredProjects.length,
    totalPages: Math.ceil(filteredProjects.length / params.limit),
  };

  return successResponse(paginatedProjects, 'Projects retrieved successfully', 200, pagination);
}

// POST /api/projects - Create a new project
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = projectSchema.parse(body);

  const newProject: Project = {
    id: uuidv4(),
    ...validatedData,
    description: validatedData.description || '',
    progress: 0, // New projects start at 0% progress
  };

  mockProjects.push(newProject);

  return successResponse(newProject, 'Project created successfully', 201);
}

export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
