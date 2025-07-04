import { NextRequest } from 'next/server';
import { updateProjectSchema } from '@/lib/validations';
import { successResponse, notFoundResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { projects as initialProjects, Project } from '@/lib/data';
import { JWTPayload } from '@/lib/auth';

// Mock projects database - In production, this would be a real database
let mockProjects: Project[] = [...initialProjects];

// GET /api/projects/[id] - Get a specific project
async function GET_handler(
  request: NextRequest,
  user: JWTPayload,
  { params }: { params: { id: string } }
) {
  const project = mockProjects.find(p => p.id === params.id);
  
  if (!project) {
    return notFoundResponse('Project not found');
  }

  return successResponse(project, 'Project retrieved successfully');
}

// PUT /api/projects/[id] - Update a specific project
async function PUT_handler(
  request: NextRequest,
  user: JWTPayload,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validatedData = updateProjectSchema.parse({ ...body, id: params.id });
  
  const projectIndex = mockProjects.findIndex(p => p.id === params.id);
  
  if (projectIndex === -1) {
    return notFoundResponse('Project not found');
  }

  // Update the project
  const updatedProject = {
    ...mockProjects[projectIndex],
    ...validatedData,
  };
  
  mockProjects[projectIndex] = updatedProject;

  return successResponse(updatedProject, 'Project updated successfully');
}

// DELETE /api/projects/[id] - Delete a specific project
async function DELETE_handler(
  request: NextRequest,
  user: JWTPayload,
  { params }: { params: { id: string } }
) {
  const projectIndex = mockProjects.findIndex(p => p.id === params.id);
  
  if (projectIndex === -1) {
    return notFoundResponse('Project not found');
  }

  // Remove the project
  mockProjects.splice(projectIndex, 1);

  return successResponse(null, 'Project deleted successfully');
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
