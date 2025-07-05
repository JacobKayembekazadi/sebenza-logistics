import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

// In-memory storage for development (replace with database in production)
let messages = [
  {
    id: 'msg-1',
    contactId: 'contact-1',
    from: 'contact' as const,
    text: 'Hey! How are things going with the Newark project?',
    timestamp: '2025-07-04T09:00:00.000Z',
  },
  {
    id: 'msg-2',
    contactId: 'contact-1',
    from: 'me' as const,
    text: 'Going well! We should have the initial phase completed by next week.',
    timestamp: '2025-07-04T09:15:00.000Z',
  },
  {
    id: 'msg-3',
    contactId: 'contact-2',
    from: 'contact' as const,
    text: 'Can we schedule a meeting for next Tuesday?',
    timestamp: '2025-07-04T10:30:00.000Z',
  },
  {
    id: 'msg-4',
    contactId: 'contact-3',
    from: 'me' as const,
    text: 'Thanks for the quick delivery on the last order!',
    timestamp: '2025-07-04T11:45:00.000Z',
  },
];

const MessageSchema = z.object({
  contactId: z.string(),
  from: z.enum(['me', 'contact']),
  text: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const contactId = searchParams.get('contactId');

    let filteredMessages = [...messages];

    if (contactId) {
      filteredMessages = filteredMessages.filter(message => message.contactId === contactId);
    }

    // Sort by timestamp (oldest first)
    filteredMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    return NextResponse.json(successResponse(filteredMessages));
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to fetch messages'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const body = await request.json();
    const validation = MessageSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(errorResponse('Validation failed'), { status: 400 });
    }

    const messageData = validation.data;
    
    const newMessage = {
      ...messageData,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);

    return NextResponse.json(successResponse(newMessage, 'Message sent'), { status: 201 });
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to send message'), { status: 500 });
  }
}
