import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

// In-memory storage for development (replace with database in production)
let contacts = [
  {
    id: 'contact-1',
    name: 'Sarah Connor',
    role: 'Project Manager',
    avatar: '/avatars/sarah.jpg',
    online: true,
  },
  {
    id: 'contact-2',
    name: 'Mike Rodriguez',
    role: 'Site Supervisor',
    avatar: '/avatars/mike.jpg',
    online: false,
  },
  {
    id: 'contact-3',
    name: 'Jennifer Kim',
    role: 'Supplier',
    avatar: '/avatars/jennifer.jpg',
    online: true,
  },
  {
    id: 'contact-4',
    name: 'David Thompson',
    role: 'Client',
    avatar: '/avatars/david.jpg',
    online: false,
  },
];

const ContactSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  avatar: z.string().optional().default('/avatars/default.jpg'),
  online: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    let filteredContacts = [...contacts];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredContacts = filteredContacts.filter(contact => 
        contact.name.toLowerCase().includes(searchLower) ||
        contact.role.toLowerCase().includes(searchLower)
      );
    }

    if (role) {
      filteredContacts = filteredContacts.filter(contact => 
        contact.role.toLowerCase().includes(role.toLowerCase())
      );
    }

    // Sort by name
    filteredContacts.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(successResponse(filteredContacts));
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to fetch contacts'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const body = await request.json();
    const validation = ContactSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(errorResponse('Validation failed'), { status: 400 });
    }

    const contactData = validation.data;
    
    const newContact = {
      ...contactData,
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    contacts.push(newContact);

    return NextResponse.json(successResponse(newContact, 'Contact created'), { status: 201 });
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to create contact'), { status: 500 });
  }
}
