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
    const { employeeId, timeEntryId } = body;

    if (!employeeId && !timeEntryId) {
      return NextResponse.json(
        errorResponse('Either Employee ID or Time Entry ID is required'),
        { status: 400 }
      );
    }

    // Find the active timer
    let activeTimerIndex = -1;
    if (timeEntryId) {
      activeTimerIndex = timeEntries.findIndex(
        entry => entry.id === timeEntryId && entry.isActive
      );
    } else {
      activeTimerIndex = timeEntries.findIndex(
        entry => entry.employeeId === employeeId && entry.isActive
      );
    }

    if (activeTimerIndex === -1) {
      return NextResponse.json(errorResponse('No active timer found'), { status: 404 });
    }

    const activeTimer = timeEntries[activeTimerIndex];
    const endTime = new Date().toISOString();
    const duration = TimeTrackingUtils.calculateDuration(activeTimer.startTime, endTime);

    // Update the time entry
    const updatedTimeEntry = {
      ...activeTimer,
      endTime,
      duration,
      isActive: false,
      updatedAt: new Date().toISOString(),
    };

    timeEntries[activeTimerIndex] = updatedTimeEntry;

    return NextResponse.json(successResponse(updatedTimeEntry, 'Timer stopped successfully'));
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to stop timer'), { status: 500 });
  }
}
