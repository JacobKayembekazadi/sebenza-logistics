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

const MessageUpdateSchema = z.object({
  text: z.string().min(1).optional(),
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

    const message = messages.find(m => m.id === params.id);
    
    if (!message) {
      return NextResponse.json(errorResponse('Message not found'), { status: 404 });
    }

    return NextResponse.json(successResponse(message));
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to fetch message'), { status: 500 });
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

    const messageIndex = messages.findIndex(m => m.id === params.id);
    
    if (messageIndex === -1) {
      return NextResponse.json(errorResponse('Message not found'), { status: 404 });
    }

    const body = await request.json();
    const validation = MessageUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(errorResponse('Validation failed'), { status: 400 });
    }

    const updateData = validation.data;
    
    // Only allow updating text for now
    const updatedMessage = {
      ...messages[messageIndex],
      ...updateData,
    };

    messages[messageIndex] = updatedMessage;

    return NextResponse.json(successResponse(updatedMessage, 'Message updated'));
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to update message'), { status: 500 });
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

    const messageIndex = messages.findIndex(m => m.id === params.id);
    
    if (messageIndex === -1) {
      return NextResponse.json(errorResponse('Message not found'), { status: 404 });
    }

    const deletedMessage = messages.splice(messageIndex, 1)[0];

    return NextResponse.json(successResponse(deletedMessage, 'Message deleted'));
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to delete message'), { status: 500 });
  }
}
