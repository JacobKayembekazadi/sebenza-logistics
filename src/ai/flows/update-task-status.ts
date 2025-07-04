// Mock AI functionality - Firebase/Genkit removed
'use server';

/**
 * @fileOverview This file provides mock AI functionality for updating task statuses.
 * Replace with real AI implementation when needed.
 */

export type UpdateTaskStatusInput = {
  taskId: string;
  statusUpdateNLP: string;
};

export type UpdateTaskStatusOutput = {
  updatedStatus: string;
};

export async function updateTaskStatusViaNLP(input: UpdateTaskStatusInput): Promise<UpdateTaskStatusOutput> {
  // Mock AI logic - replace with real AI when available
  const { statusUpdateNLP } = input;
  const lowercaseInput = statusUpdateNLP.toLowerCase();
  
  let updatedStatus = 'PENDING';
  
  if (lowercaseInput.includes('done') || lowercaseInput.includes('complete') || lowercaseInput.includes('finish')) {
    updatedStatus = 'DONE';
  } else if (lowercaseInput.includes('start') || lowercaseInput.includes('begin') || lowercaseInput.includes('progress')) {
    updatedStatus = 'IN_PROGRESS';
  } else if (lowercaseInput.includes('schedule') || lowercaseInput.includes('later') || lowercaseInput.includes('next')) {
    updatedStatus = 'SCHEDULED';
  } else if (lowercaseInput.includes('block') || lowercaseInput.includes('stop') || lowercaseInput.includes('pause')) {
    updatedStatus = 'BLOCKED';
  }
  
  return { updatedStatus };
}
