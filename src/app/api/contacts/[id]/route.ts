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

const ContactUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  avatar: z.string().optional(),
  online: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const contact = contacts.find(c => c.id === params.id);
    
    if (!contact) {
      return NextResponse.json(errorResponse('Contact not found'), { status: 404 });
    }

    return NextResponse.json(successResponse(contact));
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to fetch contact'), { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const contactIndex = contacts.findIndex(c => c.id === params.id);
    
    if (contactIndex === -1) {
      return NextResponse.json(errorResponse('Contact not found'), { status: 404 });
    }

    const body = await request.json();
    const validation = ContactUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(errorResponse('Validation failed'), { status: 400 });
    }

    const updateData = validation.data;
    
    const updatedContact = {
      ...contacts[contactIndex],
      ...updateData,
    };

    contacts[contactIndex] = updatedContact;

    return NextResponse.json(successResponse(updatedContact, 'Contact updated'));
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to update contact'), { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const contactIndex = contacts.findIndex(c => c.id === params.id);
    
    if (contactIndex === -1) {
      return NextResponse.json(errorResponse('Contact not found'), { status: 404 });
    }

    const deletedContact = contacts.splice(contactIndex, 1)[0];

    return NextResponse.json(successResponse(deletedContact, 'Contact deleted'));
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to delete contact'), { status: 500 });
  }
}
