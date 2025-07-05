import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from '@/lib/auth';
import { mockTimesheets, mockTimeEntries, TimeTrackingUtils } from '@/lib/time-tracking';
import { successResponse, errorResponse } from '@/lib/api-response';

// In-memory storage for development (replace with database in production)
let timesheets = [...mockTimesheets];
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

    const timesheet = timesheets.find(sheet => sheet.id === params.id);
    
    if (!timesheet) {
      return NextResponse.json(
        errorResponse('Timesheet not found'),
        { status: 404 }
      );
    }

    // Get fresh time entries for this timesheet
    const weekTimeEntries = timeEntries.filter(entry => 
      entry.employeeId === timesheet.employeeId &&
      entry.date >= timesheet.weekStartDate &&
      entry.date <= timesheet.weekEndDate &&
      !entry.isActive
    );

    // Update the timesheet with current time entries
    const updatedTimesheet = {
      ...timesheet,
      timeEntries: weekTimeEntries,
      totalHours: Math.round(TimeTrackingUtils.calculateTotalHours(weekTimeEntries) * 100) / 100,
      billableHours: Math.round(TimeTrackingUtils.calculateBillableHours(weekTimeEntries) * 100) / 100,
    };

    return NextResponse.json(successResponse(updatedTimesheet));
  } catch (error) {
    console.error('Error fetching timesheet:', error);
    return NextResponse.json(
      errorResponse('Failed to fetch timesheet'),
      { status: 500 }
    );
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

    const timesheetIndex = timesheets.findIndex(sheet => sheet.id === params.id);
    
    if (timesheetIndex === -1) {
      return NextResponse.json(
        errorResponse('Timesheet not found'),
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status, comments } = body;

    if (!status) {
      return NextResponse.json(
        errorResponse('Status is required'),
        { status: 400 }
      );
    }

    const validStatuses = ['draft', 'submitted', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(errorResponse('Invalid status'), { status: 400 });
    }

    const currentTimesheet = timesheets[timesheetIndex];
    
    // Validate status transitions
    if (currentTimesheet.status === 'approved' && status !== 'approved') {
      return NextResponse.json(
        errorResponse('Cannot change status of approved timesheet'),
        { status: 400 }
      );
    }

    // Get fresh time entries for recalculation
    const weekTimeEntries = timeEntries.filter(entry => 
      entry.employeeId === currentTimesheet.employeeId &&
      entry.date >= currentTimesheet.weekStartDate &&
      entry.date <= currentTimesheet.weekEndDate &&
      !entry.isActive
    );

    // Update timesheet
    const updatedTimesheet = {
      ...currentTimesheet,
      status,
      comments,
      timeEntries: weekTimeEntries,
      totalHours: Math.round(TimeTrackingUtils.calculateTotalHours(weekTimeEntries) * 100) / 100,
      billableHours: Math.round(TimeTrackingUtils.calculateBillableHours(weekTimeEntries) * 100) / 100,
      updatedAt: new Date().toISOString(),
    };

    // Set submission/approval timestamps
    if (status === 'submitted' && currentTimesheet.status !== 'submitted') {
      updatedTimesheet.submittedAt = new Date().toISOString();
    }
    
    if (status === 'approved' && currentTimesheet.status !== 'approved') {
      updatedTimesheet.approvedAt = new Date().toISOString();
      updatedTimesheet.approvedBy = 'system';
    }

    timesheets[timesheetIndex] = updatedTimesheet;

    return NextResponse.json(
      successResponse(updatedTimesheet, 'Timesheet updated successfully')
    );
  } catch (error) {
    console.error('Error updating timesheet:', error);
    return NextResponse.json(
      errorResponse('Failed to update timesheet'),
      { status: 500 }
    );
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

    const timesheetIndex = timesheets.findIndex(sheet => sheet.id === params.id);
    
    if (timesheetIndex === -1) {
      return NextResponse.json(
        errorResponse('Timesheet not found'),
        { status: 404 }
      );
    }

    const timesheet = timesheets[timesheetIndex];

    // Prevent deletion of submitted or approved timesheets
    if (timesheet.status === 'submitted' || timesheet.status === 'approved') {
      return NextResponse.json(
        errorResponse('Cannot delete submitted or approved timesheet'),
        { status: 400 }
      );
    }

    const deletedTimesheet = timesheets.splice(timesheetIndex, 1)[0];

    return NextResponse.json(
      successResponse(deletedTimesheet, 'Timesheet deleted successfully')
    );
  } catch (error) {
    console.error('Error deleting timesheet:', error);
    return NextResponse.json(
      errorResponse('Failed to delete timesheet'),
      { status: 500 }
    );
  }
}
