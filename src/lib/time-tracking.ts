// Time Tracking Utilities and Types
import { z } from 'zod';

// Time Entry Schema
export const TimeEntrySchema = z.object({
  id: z.string().optional(),
  employeeId: z.string(),
  projectId: z.string(),
  taskId: z.string().optional(),
  description: z.string(),
  startTime: z.string(), // ISO string
  endTime: z.string().optional(), // ISO string, null for active entries
  duration: z.number().optional(), // Duration in minutes
  date: z.string(), // YYYY-MM-DD format
  isActive: z.boolean().default(false),
  billable: z.boolean().default(true),
  hourlyRate: z.number().optional(),
  tags: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Timesheet Schema
export const TimesheetSchema = z.object({
  id: z.string().optional(),
  employeeId: z.string(),
  weekStartDate: z.string(), // YYYY-MM-DD format (Monday)
  weekEndDate: z.string(), // YYYY-MM-DD format (Sunday)
  totalHours: z.number(),
  billableHours: z.number(),
  status: z.enum(['draft', 'submitted', 'approved', 'rejected']),
  timeEntries: z.array(TimeEntrySchema),
  submittedAt: z.string().optional(),
  approvedAt: z.string().optional(),
  approvedBy: z.string().optional(),
  comments: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TimeEntry = z.infer<typeof TimeEntrySchema>;
export type Timesheet = z.infer<typeof TimesheetSchema>;

// Utility functions for time calculations
export class TimeTrackingUtils {
  /**
   * Calculate duration between start and end time in minutes
   */
  static calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }

  /**
   * Format duration from minutes to HH:MM format
   */
  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * Get week start date (Monday) for a given date
   */
  static getWeekStartDate(date: Date): string {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    d.setDate(diff);
    return d.toISOString().split('T')[0];
  }

  /**
   * Get week end date (Sunday) for a given date
   */
  static getWeekEndDate(date: Date): string {
    const startDate = new Date(this.getWeekStartDate(date));
    startDate.setDate(startDate.getDate() + 6);
    return startDate.toISOString().split('T')[0];
  }

  /**
   * Calculate total hours from time entries
   */
  static calculateTotalHours(timeEntries: TimeEntry[]): number {
    return timeEntries.reduce((total, entry) => {
      if (entry.duration) {
        return total + (entry.duration / 60);
      }
      if (entry.startTime && entry.endTime) {
        const duration = this.calculateDuration(entry.startTime, entry.endTime);
        return total + (duration / 60);
      }
      return total;
    }, 0);
  }

  /**
   * Calculate billable hours from time entries
   */
  static calculateBillableHours(timeEntries: TimeEntry[]): number {
    return timeEntries
      .filter(entry => entry.billable)
      .reduce((total, entry) => {
        if (entry.duration) {
          return total + (entry.duration / 60);
        }
        if (entry.startTime && entry.endTime) {
          const duration = this.calculateDuration(entry.startTime, entry.endTime);
          return total + (duration / 60);
        }
        return total;
      }, 0);
  }

  /**
   * Generate time entry ID
   */
  static generateTimeEntryId(): string {
    return `time-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate timesheet ID
   */
  static generateTimesheetId(): string {
    return `timesheet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate time entry
   */
  static validateTimeEntry(entry: Partial<TimeEntry>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!entry.employeeId) errors.push('Employee ID is required');
    if (!entry.projectId) errors.push('Project ID is required');
    if (!entry.description) errors.push('Description is required');
    if (!entry.startTime) errors.push('Start time is required');
    if (!entry.date) errors.push('Date is required');

    if (entry.startTime && entry.endTime) {
      const start = new Date(entry.startTime);
      const end = new Date(entry.endTime);
      if (end <= start) {
        errors.push('End time must be after start time');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if time entry overlaps with existing entries
   */
  static checkTimeOverlap(
    newEntry: TimeEntry,
    existingEntries: TimeEntry[]
  ): { hasOverlap: boolean; conflictingEntries: TimeEntry[] } {
    if (!newEntry.startTime || !newEntry.endTime) {
      return { hasOverlap: false, conflictingEntries: [] };
    }

    const newStart = new Date(newEntry.startTime);
    const newEnd = new Date(newEntry.endTime);
    const conflictingEntries: TimeEntry[] = [];

    for (const entry of existingEntries) {
      if (entry.id === newEntry.id) continue; // Skip self when editing
      if (!entry.startTime || !entry.endTime) continue;
      if (entry.employeeId !== newEntry.employeeId) continue;

      const existingStart = new Date(entry.startTime);
      const existingEnd = new Date(entry.endTime);

      // Check for overlap
      if (newStart < existingEnd && newEnd > existingStart) {
        conflictingEntries.push(entry);
      }
    }

    return {
      hasOverlap: conflictingEntries.length > 0,
      conflictingEntries
    };
  }
}

// Mock data for development
export const mockTimeEntries: TimeEntry[] = [
  {
    id: 'time-1',
    employeeId: 'emp-1',
    projectId: 'proj-1',
    taskId: 'task-1',
    description: 'Frontend development for user authentication',
    startTime: '2025-07-04T09:00:00.000Z',
    endTime: '2025-07-04T12:00:00.000Z',
    duration: 180,
    date: '2025-07-04',
    isActive: false,
    billable: true,
    hourlyRate: 75,
    tags: ['development', 'frontend'],
    createdAt: '2025-07-04T09:00:00.000Z',
    updatedAt: '2025-07-04T12:00:00.000Z',
  },
  {
    id: 'time-2',
    employeeId: 'emp-1',
    projectId: 'proj-1',
    taskId: 'task-2',
    description: 'Code review and testing',
    startTime: '2025-07-04T13:00:00.000Z',
    endTime: '2025-07-04T15:30:00.000Z',
    duration: 150,
    date: '2025-07-04',
    isActive: false,
    billable: true,
    hourlyRate: 75,
    tags: ['review', 'testing'],
    createdAt: '2025-07-04T13:00:00.000Z',
    updatedAt: '2025-07-04T15:30:00.000Z',
  },
  {
    id: 'time-3',
    employeeId: 'emp-2',
    projectId: 'proj-2',
    description: 'Client meeting and requirements gathering',
    startTime: '2025-07-04T10:00:00.000Z',
    endTime: '2025-07-04T11:00:00.000Z',
    duration: 60,
    date: '2025-07-04',
    isActive: false,
    billable: true,
    hourlyRate: 100,
    tags: ['meeting', 'client'],
    createdAt: '2025-07-04T10:00:00.000Z',
    updatedAt: '2025-07-04T11:00:00.000Z',
  },
  {
    id: 'time-4',
    employeeId: 'emp-1',
    projectId: 'proj-1',
    description: 'Working on API documentation',
    startTime: '2025-07-04T16:00:00.000Z',
    endTime: undefined,
    duration: undefined,
    date: '2025-07-04',
    isActive: true,
    billable: true,
    hourlyRate: 75,
    tags: ['documentation'],
    createdAt: '2025-07-04T16:00:00.000Z',
    updatedAt: '2025-07-04T16:00:00.000Z',
  },
];

export const mockTimesheets: Timesheet[] = [
  {
    id: 'timesheet-1',
    employeeId: 'emp-1',
    weekStartDate: '2025-06-30',
    weekEndDate: '2025-07-06',
    totalHours: 40,
    billableHours: 38,
    status: 'submitted',
    timeEntries: mockTimeEntries.filter(entry => entry.employeeId === 'emp-1'),
    submittedAt: '2025-07-04T17:00:00.000Z',
    comments: 'Regular week, completed all assigned tasks.',
    createdAt: '2025-06-30T09:00:00.000Z',
    updatedAt: '2025-07-04T17:00:00.000Z',
  },
  {
    id: 'timesheet-2',
    employeeId: 'emp-2',
    weekStartDate: '2025-06-30',
    weekEndDate: '2025-07-06',
    totalHours: 35,
    billableHours: 32,
    status: 'approved',
    timeEntries: mockTimeEntries.filter(entry => entry.employeeId === 'emp-2'),
    submittedAt: '2025-07-03T17:00:00.000Z',
    approvedAt: '2025-07-04T09:00:00.000Z',
    approvedBy: 'emp-3',
    comments: 'Good work on client presentations.',
    createdAt: '2025-06-30T09:00:00.000Z',
    updatedAt: '2025-07-04T09:00:00.000Z',
  },
];
