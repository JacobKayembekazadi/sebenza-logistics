import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { mockTimeEntries, TimeTrackingUtils } from '@/lib/time-tracking';
import { successResponse, errorResponse } from '@/lib/api-response';

// In-memory storage for development
let timeEntries = [...mockTimeEntries];

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const body = await request.json();
    const { employeeId, projectId, taskId, description } = body;

    if (!employeeId || !projectId || !description) {
      return NextResponse.json(
        errorResponse('Employee ID, Project ID, and description are required'),
        { status: 400 }
      );
    }

    // Check if user already has an active timer
    const activeTimer = timeEntries.find(
      entry => entry.employeeId === employeeId && entry.isActive
    );

    if (activeTimer) {
      return NextResponse.json(
        errorResponse('User already has an active timer running'),
        { status: 409 }
      );
    }

    // Create new active time entry
    const newTimeEntry = {
      id: TimeTrackingUtils.generateTimeEntryId(),
      employeeId,
      projectId,
      taskId,
      description,
      startTime: new Date().toISOString(),
      endTime: undefined,
      duration: undefined,
      date: new Date().toISOString().split('T')[0],
      isActive: true,
      billable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    timeEntries.push(newTimeEntry);

    return NextResponse.json(
      successResponse(newTimeEntry, 'Timer started successfully'),
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to start timer'), { status: 500 });
  }
}
