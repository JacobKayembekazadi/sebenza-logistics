import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { TimesheetSchema, mockTimesheets, mockTimeEntries, TimeTrackingUtils } from '@/lib/time-tracking';
import { successResponse, errorResponse } from '@/lib/api-response';

// In-memory storage for development (replace with database in production)
let timesheets = [...mockTimesheets];
let timeEntries = [...mockTimeEntries];

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const status = searchParams.get('status');
    const weekStart = searchParams.get('weekStart');
    const weekEnd = searchParams.get('weekEnd');

    let filteredTimesheets = [...timesheets];

    // Filter by employee
    if (employeeId) {
      filteredTimesheets = filteredTimesheets.filter(
        timesheet => timesheet.employeeId === employeeId
      );
    }

    // Filter by status
    if (status) {
      filteredTimesheets = filteredTimesheets.filter(
        timesheet => timesheet.status === status
      );
    }

    // Filter by week range
    if (weekStart && weekEnd) {
      filteredTimesheets = filteredTimesheets.filter(
        timesheet => timesheet.weekStartDate >= weekStart && timesheet.weekEndDate <= weekEnd
      );
    }

    // Sort by week start date (most recent first)
    filteredTimesheets.sort((a, b) => 
      new Date(b.weekStartDate).getTime() - new Date(a.weekStartDate).getTime()
    );

    return NextResponse.json(successResponse(filteredTimesheets));
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    return NextResponse.json(errorResponse('Failed to fetch timesheets'), { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(errorResponse('Authentication required'), { status: 401 });
    }

    const body = await request.json();
    const { employeeId, weekStartDate, weekEndDate } = body;

    if (!employeeId || !weekStartDate || !weekEndDate) {
      return NextResponse.json(errorResponse('Employee ID, week start date, and week end date are required'), { status: 400 });
    }

    // Check if timesheet already exists for this employee and week
    const existingTimesheet = timesheets.find(
      timesheet => 
        timesheet.employeeId === employeeId && 
        timesheet.weekStartDate === weekStartDate &&
        timesheet.weekEndDate === weekEndDate
    );

    if (existingTimesheet) {
      return NextResponse.json(errorResponse('Timesheet already exists for this week'), { status: 409 });
    }

    // Get time entries for this employee and week
    const weekTimeEntries = timeEntries.filter(entry => 
      entry.employeeId === employeeId &&
      entry.date >= weekStartDate &&
      entry.date <= weekEndDate &&
      !entry.isActive // Don't include active timers
    );

    // Calculate totals
    const totalHours = TimeTrackingUtils.calculateTotalHours(weekTimeEntries);
    const billableHours = TimeTrackingUtils.calculateBillableHours(weekTimeEntries);

    // Create new timesheet
    const newTimesheet = {
      id: TimeTrackingUtils.generateTimesheetId(),
      employeeId,
      weekStartDate,
      weekEndDate,
      totalHours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
      billableHours: Math.round(billableHours * 100) / 100,
      status: 'draft' as const,
      timeEntries: weekTimeEntries,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    timesheets.push(newTimesheet);

    return NextResponse.json(successResponse(newTimesheet, 'Timesheet created successfully'), { status: 201 });
  } catch (error) {
    console.error('Error creating timesheet:', error);
    return NextResponse.json(errorResponse('Failed to create timesheet'), { status: 500 });
  }
}
