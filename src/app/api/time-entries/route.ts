import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { TimeEntrySchema, mockTimeEntries, TimeTrackingUtils } from '@/lib/time-tracking';
import { successResponse, errorResponse } from '@/lib/api-response';

// In-memory storage for development
let timeEntries = [...mockTimeEntries];

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const projectId = searchParams.get('projectId');
    const date = searchParams.get('date');
    const isActive = searchParams.get('isActive');

    let filteredEntries = [...timeEntries];

    if (employeeId) {
      filteredEntries = filteredEntries.filter(entry => entry.employeeId === employeeId);
    }
    if (projectId) {
      filteredEntries = filteredEntries.filter(entry => entry.projectId === projectId);
    }
    if (date) {
      filteredEntries = filteredEntries.filter(entry => entry.date === date);
    }
    if (isActive !== null) {
      const activeFilter = isActive === 'true';
      filteredEntries = filteredEntries.filter(entry => entry.isActive === activeFilter);
    }

    filteredEntries.sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });

    return NextResponse.json(successResponse(filteredEntries));
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to fetch time entries'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const body = await request.json();
    const validation = TimeEntrySchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(errorResponse('Validation failed'), { status: 400 });
    }

    const timeEntryData = validation.data;
    
    // Calculate duration if not provided
    let duration = timeEntryData.duration;
    if (!duration && timeEntryData.startTime && timeEntryData.endTime) {
      duration = TimeTrackingUtils.calculateDuration(timeEntryData.startTime, timeEntryData.endTime);
    }

    const newTimeEntry = {
      ...timeEntryData,
      id: TimeTrackingUtils.generateTimeEntryId(),
      duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    timeEntries.push(newTimeEntry);

    return NextResponse.json(successResponse(newTimeEntry, 'Time entry created'), { status: 201 });
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to create time entry'), { status: 500 });
  }
}
