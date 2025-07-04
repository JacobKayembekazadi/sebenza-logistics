import { NextRequest } from 'next/server';
import { signupSchema } from '@/lib/validations';
import { generateToken, hashPassword } from '@/lib/auth';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api-response';
import { v4 as uuidv4 } from 'uuid';

// Mock user database - In production, this would be a real database
const mockUsers: Array<{
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  avatar: string;
  companyId: string;
}> = [];

async function POST_handler(request: NextRequest) {
  const body = await request.json();
  const validatedData = signupSchema.parse(body);

  // Check if user already exists
  const existingUser = mockUsers.find(u => u.email === validatedData.email);
  if (existingUser) {
    return errorResponse('User with this email already exists', 409);
  }

  // Hash password
  const hashedPassword = await hashPassword(validatedData.password);

  // Create new user and company
  const userId = uuidv4();
  const companyId = uuidv4();

  const newUser = {
    id: userId,
    name: validatedData.name,
    email: validatedData.email,
    password: hashedPassword,
    role: 'admin' as const, // First user is always admin
    avatar: 'https://placehold.co/100x100.png',
    companyId,
  };

  // Add to mock database
  mockUsers.push(newUser);

  // Generate JWT token
  const token = generateToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    companyId: newUser.companyId,
  });

  // Return user data and token
  return successResponse({
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
    },
    company: {
      name: validatedData.companyName,
      userCount: validatedData.userCount,
      logo: 'https://placehold.co/100x100.png',
      address: '',
      phone: '',
      email: validatedData.email,
    },
    token,
  }, 'Account created successfully', 201);
}

export const POST = withErrorHandling(POST_handler);
