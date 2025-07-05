import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { TimeEntrySchema, mockTimeEntries, TimeTrackingUtils } from '@/lib/time-tracking';
import { successResponse, errorResponse } from '@/lib/api-response';

// In-memory storage for development (replace with database in production)
let timeEntries = [...mockTimeEntries];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const timeEntry = timeEntries.find(entry => entry.id === params.id);
    
    if (!timeEntry) {
      return NextResponse.json(errorResponse('Time entry not found'), { status: 404 });
    }

    return NextResponse.json(successResponse(timeEntry));
  } catch (error) {
    console.error('Error fetching time entry:', error);
    return NextResponse.json(errorResponse('Failed to fetch time entry'), { status: 500 });
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

    const timeEntryIndex = timeEntries.findIndex(entry => entry.id === params.id);
    
    if (timeEntryIndex === -1) {
      return NextResponse.json(errorResponse('Time entry not found'), { status: 404 });
    }

    const body = await request.json();
    
    // Validate the request body
    const validation = TimeEntrySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(errorResponse('Validation failed'), { status: 400 });
    }

    const timeEntryData = validation.data;

    // Additional validation
    const validationResult = TimeTrackingUtils.validateTimeEntry(timeEntryData);
    if (!validationResult.valid) {
      return NextResponse.json(errorResponse('Validation failed'), { status: 400 });
    }

    // Check for time overlaps (exclude current entry)
    if (timeEntryData.startTime && timeEntryData.endTime) {
      const entryWithId = { ...timeEntryData, id: params.id };
      const overlapCheck = TimeTrackingUtils.checkTimeOverlap(
        entryWithId as any,
        timeEntries.filter(entry => entry.employeeId === timeEntryData.employeeId)
      );
      
      if (overlapCheck.hasOverlap) {
        return NextResponse.json(errorResponse('Time entry overlaps with existing entries'), { status: 409 });
      }
    }

    // Calculate duration if not provided
    let duration = timeEntryData.duration;
    if (!duration && timeEntryData.startTime && timeEntryData.endTime) {
      duration = TimeTrackingUtils.calculateDuration(
        timeEntryData.startTime, 
        timeEntryData.endTime
      );
    }

    // Update time entry
    const updatedTimeEntry = {
      ...timeEntries[timeEntryIndex],
      ...timeEntryData,
      duration,
      updatedAt: new Date().toISOString(),
    };

    timeEntries[timeEntryIndex] = updatedTimeEntry;

    return NextResponse.json(successResponse(updatedTimeEntry, 'Time entry updated successfully'));
  } catch (error) {
    console.error('Error updating time entry:', error);
    return NextResponse.json(errorResponse('Failed to update time entry'), { status: 500 });
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

    const timeEntryIndex = timeEntries.findIndex(entry => entry.id === params.id);
    
    if (timeEntryIndex === -1) {
      return NextResponse.json(errorResponse('Time entry not found'), { status: 404 });
    }

    const deletedEntry = timeEntries.splice(timeEntryIndex, 1)[0];

    return NextResponse.json(successResponse(deletedEntry, 'Time entry deleted successfully'));
  } catch (error) {
    console.error('Error deleting time entry:', error);
    return NextResponse.json(errorResponse('Failed to delete time entry'), { status: 500 });
  }
}
