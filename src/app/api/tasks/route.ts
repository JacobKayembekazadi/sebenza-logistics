import { NextRequest } from 'next/server';
import { taskSchema, paginationSchema } from '@/lib/validations';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { tasks as initialTasks, Task } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Mock tasks database - In production, this would be a real database
let mockTasks: Task[] = [...initialTasks];

// GET /api/tasks - List all tasks with pagination and search
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  const params = paginationSchema.parse(Object.fromEntries(searchParams));

  let filteredTasks = [...mockTasks];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredTasks = filteredTasks.filter(task =>
      task.name.toLowerCase().includes(searchLower) ||
      task.assignee.toLowerCase().includes(searchLower)
    );
  }

  // Filter by project if projectId is provided
  const projectId = searchParams.get('projectId');
  if (projectId) {
    filteredTasks = filteredTasks.filter(task => task.projectId === projectId);
  }

  // Apply sorting
  if (params.sortBy) {
    filteredTasks.sort((a, b) => {
      const aValue = a[params.sortBy as keyof Task];
      const bValue = b[params.sortBy as keyof Task];
      
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
  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  const pagination = {
    page: params.page,
    limit: params.limit,
    total: filteredTasks.length,
    totalPages: Math.ceil(filteredTasks.length / params.limit),
  };

  return successResponse(paginatedTasks, 'Tasks retrieved successfully', 200, pagination);
}

// POST /api/tasks - Create a new task
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = taskSchema.parse(body);

  const newTask: Task = {
    id: uuidv4(),
    ...validatedData,
  };

  mockTasks.push(newTask);

  return successResponse(newTask, 'Task created successfully', 201);
}

export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
