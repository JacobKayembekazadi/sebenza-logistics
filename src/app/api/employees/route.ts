import { NextRequest } from 'next/server';
import { employeeSchema, paginationSchema } from '@/lib/validations';
import { successResponse, withErrorHandling } from '@/lib/api-response';
import { requireAuth } from '@/lib/middleware';
import { employees as initialEmployees, Employee } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';
import { JWTPayload } from '@/lib/auth';

// Mock employees database - In production, this would be a real database
let mockEmployees: Employee[] = [...initialEmployees];

// GET /api/employees - List all employees with pagination and search
async function GET_handler(request: NextRequest, user: JWTPayload) {
  const { searchParams } = new URL(request.url);
  const params = paginationSchema.parse(Object.fromEntries(searchParams));

  let filteredEmployees = [...mockEmployees];

  // Apply search filter
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filteredEmployees = filteredEmployees.filter(employee =>
      employee.name.toLowerCase().includes(searchLower) ||
      employee.email.toLowerCase().includes(searchLower) ||
      employee.department.toLowerCase().includes(searchLower) ||
      employee.role.toLowerCase().includes(searchLower)
    );
  }

  // Filter by department if provided
  const department = searchParams.get('department');
  if (department) {
    filteredEmployees = filteredEmployees.filter(employee => employee.department === department);
  }

  // Filter by role if provided
  const role = searchParams.get('role');
  if (role) {
    filteredEmployees = filteredEmployees.filter(employee => employee.role === role);
  }

  // Apply sorting
  if (params.sortBy) {
    filteredEmployees.sort((a, b) => {
      const aValue = a[params.sortBy as keyof Employee];
      const bValue = b[params.sortBy as keyof Employee];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return params.sortOrder === 'desc' 
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }
      
      if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return params.sortOrder === 'desc' 
          ? (bValue ? 1 : 0) - (aValue ? 1 : 0)
          : (aValue ? 1 : 0) - (bValue ? 1 : 0);
      }
      
      return 0;
    });
  }

  // Apply pagination
  const startIndex = (params.page - 1) * params.limit;
  const endIndex = startIndex + params.limit;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const pagination = {
    page: params.page,
    limit: params.limit,
    total: filteredEmployees.length,
    totalPages: Math.ceil(filteredEmployees.length / params.limit),
  };

  return successResponse(paginatedEmployees, 'Employees retrieved successfully', 200, pagination);
}

// POST /api/employees - Create a new employee
async function POST_handler(request: NextRequest, user: JWTPayload) {
  const body = await request.json();
  const validatedData = employeeSchema.parse(body);

  const newEmployee: Employee = {
    id: uuidv4(),
    ...validatedData,
    avatar: 'https://placehold.co/100x100.png', // Default avatar
  };

  mockEmployees.push(newEmployee);

  return successResponse(newEmployee, 'Employee created successfully', 201);
}

export const GET = withErrorHandling(requireAuth(GET_handler));
export const POST = withErrorHandling(requireAuth(POST_handler));
