'use server';

import { updateTaskStatusViaNLP } from '@/ai/flows/update-task-status';
import type { UpdateTaskStatusInput } from '@/ai/flows/update-task-status';

export async function handleUpdateTaskStatus(
  input: UpdateTaskStatusInput
): Promise<{ updatedStatus?: string; error?: string }> {
  try {
    // In a real app, you would have authentication and authorization checks here
    // to ensure the user has permission to update the task.

    if (!input.taskId || !input.statusUpdateNLP) {
      return { error: 'Task ID and status update text are required.' };
    }

    const result = await updateTaskStatusViaNLP(input);

    if (!result.updatedStatus) {
      return { error: 'AI could not determine an updated status.' };
    }
    
    // Here you would typically update your database with the new status.
    // For this demo, we'll just return the updated status.
    console.log(`Task ${input.taskId} status updated to ${result.updatedStatus}`);

    return { updatedStatus: result.updatedStatus };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error };
  }
}
