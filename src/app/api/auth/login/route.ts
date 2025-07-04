import { NextRequest } from 'next/server';
import { loginSchema } from '@/lib/validations';
import { generateToken, verifyPassword } from '@/lib/auth';
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api-response';

// Mock user database - In production, this would be a real database
const mockUsers = [
  {
    id: 'admin-user-id',
    name: 'Admin User',
    email: 'admin@sebenza.com',
    password: '$2b$12$UdflD.6xwdq.Dx7PL1d.IuOC20H31vO5wrAkCHPrSRpech2QggV4u', // 'password'
    role: 'admin' as const,
    avatar: 'https://placehold.co/100x100.png',
    companyId: 'default-company-id',
  },
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@sebenza.com',
    password: '$2b$12$UdflD.6xwdq.Dx7PL1d.IuOC20H31vO5wrAkCHPrSRpech2QggV4u', // 'password'
    role: 'user' as const,
    avatar: 'https://placehold.co/100x100.png',
    companyId: 'default-company-id',
  },
];

async function POST_handler(request: NextRequest) {
  const body = await request.json();
  const validatedData = loginSchema.parse(body);

  // Find user by email
  const user = mockUsers.find(u => u.email === validatedData.email);
  if (!user) {
    return errorResponse('Invalid email or password', 401);
  }

  // Verify password
  const isValidPassword = await verifyPassword(validatedData.password, user.password);
  if (!isValidPassword) {
    return errorResponse('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
  });

  // Return user data and token
  return successResponse({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    company: {
      name: 'Default Corp',
      userCount: 5,
      logo: 'https://placehold.co/100x100/4338CA/FFFFFF.png',
      address: '123 Business Rd, Suite 456, Big City, USA',
      phone: '555-0199',
      email: 'contact@defaultcorp.com',
    },
    token,
  }, 'Login successful');
}

export const POST = withErrorHandling(POST_handler);
