'use server';

/**
 * @fileOverview A Genkit flow to calculate late fees for an invoice.
 *
 * - calculateLateFee - A function that calculates a late fee based on the invoice amount and how overdue it is.
 * - CalculateLateFeeInput - The input type for the calculateLateFee function.
 * - CalculateLateFeeOutput - The return type for the calculateLateFee function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateLateFeeInputSchema = z.object({
  invoiceAmount: z.number().describe('The total amount of the invoice.'),
  daysOverdue: z.number().describe('The number of days the invoice is overdue.'),
});
export type CalculateLateFeeInput = z.infer<typeof CalculateLateFeeInputSchema>;

const CalculateLateFeeOutputSchema = z.object({
  lateFee: z.number().describe('The calculated late fee amount.'),
});
export type CalculateLateFeeOutput = z.infer<typeof CalculateLateFeeOutputSchema>;

export async function calculateLateFee(input: CalculateLateFeeInput): Promise<CalculateLateFeeOutput> {
  return calculateLateFeeFlow(input);
}

const lateFeePrompt = ai.definePrompt({
  name: 'lateFeePrompt',
  input: {schema: CalculateLateFeeInputSchema},
  output: {schema: CalculateLateFeeOutputSchema},
  prompt: `You are a billing assistant. Your task is to calculate a late fee for an invoice.

The invoice amount is \${{invoiceAmount}}.
It is {{daysOverdue}} days overdue.

The company's late fee policy is as follows:
- A fee of 1.5% of the invoice amount is applied for each 30-day period the invoice is overdue.
- If the calculated percentage-based fee is less than a flat fee of $10.00, the $10.00 flat fee should be applied instead.

Calculate the final late fee. Respond ONLY with the numeric value for the fee.
`,
});

const calculateLateFeeFlow = ai.defineFlow(
  {
    name: 'calculateLateFeeFlow',
    inputSchema: CalculateLateFeeInputSchema,
    outputSchema: CalculateLateFeeOutputSchema,
  },
  async input => {
    const {output} = await lateFeePrompt(input);
    return output!;
  }
);
