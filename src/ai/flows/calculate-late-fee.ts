// Mock AI functionality - Firebase/Genkit removed
'use server';

/**
 * @fileOverview Mock functionality to calculate late fees for an invoice.
 * Replace with real AI implementation when needed.
 */

export type CalculateLateFeeInput = {
  invoiceAmount: number;
  daysOverdue: number;
};

export type CalculateLateFeeOutput = {
  lateFee: number;
};

export async function calculateLateFee(input: CalculateLateFeeInput): Promise<CalculateLateFeeOutput> {
  // Mock late fee calculation logic
  const { invoiceAmount, daysOverdue } = input;
  
  // Calculate fee: 1.5% of invoice amount for each 30-day period
  const thirtyDayPeriods = Math.ceil(daysOverdue / 30);
  const percentageFee = (invoiceAmount * 0.015) * thirtyDayPeriods;
  
  // Apply minimum fee of $10
  const lateFee = Math.max(percentageFee, 10);
  
  return { lateFee: Math.round(lateFee * 100) / 100 }; // Round to 2 decimal places
}
