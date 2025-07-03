'use server';

import { updateTaskStatusViaNLP } from '@/ai/flows/update-task-status';
import type { UpdateTaskStatusInput } from '@/ai/flows/update-task-status';
import { calculateLateFee } from '@/ai/flows/calculate-late-fee';
import type { Invoice } from '@/lib/data';

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

export async function handleCalculateLateFee(
  invoice: Pick<Invoice, 'amount' | 'date'>
): Promise<{ lateFee?: number; error?: string }> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(invoice.date);
    
    const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysOverdue <= 0) {
      return { lateFee: 0 };
    }
    
    const result = await calculateLateFee({
      invoiceAmount: invoice.amount,
      daysOverdue: daysOverdue,
    });

    if (result.lateFee === undefined) {
      return { error: 'AI could not calculate the late fee.' };
    }

    return { lateFee: result.lateFee };
  } catch (e) {
    console.error(e);
    const error = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error };
  }
}
