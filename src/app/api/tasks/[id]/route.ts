import { NextRequest } from 'next/server';
import { updateTaskSchema } from '@/lib/validations';
import { successResponse, notFoundResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { tasks as initialTasks, Task } from '@/lib/data';
import { JWTPayload } from '@/lib/auth';

// Mock tasks database - In production, this would be a real database
let mockTasks: Task[] = [...initialTasks];

// GET /api/tasks/[id] - Get a specific task
async function GET_handler(
  request: NextRequest,
  user: JWTPayload,
  { params }: { params: { id: string } }
) {
  const task = mockTasks.find(t => t.id === params.id);
  
  if (!task) {
    return notFoundResponse('Task not found');
  }

  return successResponse(task, 'Task retrieved successfully');
}

// PUT /api/tasks/[id] - Update a specific task
async function PUT_handler(
  request: NextRequest,
  user: JWTPayload,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validatedData = updateTaskSchema.parse({ ...body, id: params.id });
  
  const taskIndex = mockTasks.findIndex(t => t.id === params.id);
  
  if (taskIndex === -1) {
    return notFoundResponse('Task not found');
  }

  // Update the task
  const updatedTask = {
    ...mockTasks[taskIndex],
    ...validatedData,
  };
  
  mockTasks[taskIndex] = updatedTask;

  return successResponse(updatedTask, 'Task updated successfully');
}

// DELETE /api/tasks/[id] - Delete a specific task
async function DELETE_handler(
  request: NextRequest,
  user: JWTPayload,
  { params }: { params: { id: string } }
) {
  const taskIndex = mockTasks.findIndex(t => t.id === params.id);
  
  if (taskIndex === -1) {
    return notFoundResponse('Task not found');
  }

  // Remove the task
  mockTasks.splice(taskIndex, 1);

  return successResponse(null, 'Task deleted successfully');
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
