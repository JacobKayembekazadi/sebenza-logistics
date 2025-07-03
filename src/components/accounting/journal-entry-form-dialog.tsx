
'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useData } from "@/contexts/data-context";
import type { JournalEntry, JournalEntryLine } from "@/lib/data";
import { useEffect, useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../ui/table";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalEntryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: JournalEntry;
}

const initialLine: Partial<JournalEntryLine> = { accountId: '', debit: 0, credit: 0 };

export function JournalEntryFormDialog({ open, onOpenChange, entry }: JournalEntryFormDialogProps) {
  const { chartOfAccounts, addJournalEntry, updateJournalEntry } = useData();
  const { toast } = useToast();

  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [lines, setLines] = useState<(Partial<JournalEntryLine> & { id: number })[]>([]);
  
  const isEditMode = !!entry;

  useEffect(() => {
    if (open) {
      if (entry) {
        setDate(entry.date);
        setDescription(entry.description);
        setLines(entry.lines.map((line, index) => ({ ...line, id: index })));
      } else {
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
        setLines([{ ...initialLine, id: 0 }, { ...initialLine, id: 1 }]);
      }
    }
  }, [entry, open]);

  const handleLineChange = (index: number, field: keyof JournalEntryLine, value: any) => {
    const newLines = [...lines];
    const line = newLines[index];
    
    if (field === 'accountId') {
      const account = chartOfAccounts.find(a => a.id === value);
      line.accountName = account?.name;
      line.accountId = value;
    } else if (field === 'debit') {
      line.debit = parseFloat(value) || 0;
      if (line.debit > 0) line.credit = 0;
    } else if (field === 'credit') {
      line.credit = parseFloat(value) || 0;
      if (line.credit > 0) line.debit = 0;
    }

    setLines(newLines);
  };

  const addLine = () => {
    setLines([...lines, { ...initialLine, id: Math.random() }]);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const { totalDebit, totalCredit } = useMemo(() => {
    return lines.reduce((acc, line) => {
      acc.totalDebit += line.debit || 0;
      acc.totalCredit += line.credit || 0;
      return acc;
    }, { totalDebit: 0, totalCredit: 0 });
  }, [lines]);

  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.001;
  const isReady = isBalanced && totalDebit > 0 && lines.every(l => l.accountId);

  const handleSubmit = () => {
    if (!isReady) {
        toast({
            variant: "destructive",
            title: "Invalid Entry",
            description: "Please ensure all lines have an account and debits equal credits."
        });
        return;
    }

    const entryData = { 
      date,
      description,
      lines: lines as JournalEntryLine[],
    };

    if (isEditMode && entry) {
      updateJournalEntry({ ...entry, ...entryData });
    } else {
      addJournalEntry(entryData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Journal Entry' : 'New Journal Entry'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the details of the journal entry.' : 'Create a manual journal entry. Debits must equal credits.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Record monthly payroll" />
            </div>
          </div>
          
          <div className="mt-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[45%]">Account</TableHead>
                        <TableHead className="w-[20%] text-right">Debit</TableHead>
                        <TableHead className="w-[20%] text-right">Credit</TableHead>
                        <TableHead className="w-[10%]"><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {lines.map((line, index) => (
                        <TableRow key={line.id}>
                            <TableCell>
                                <Select onValueChange={(value) => handleLineChange(index, 'accountId', value)} value={line.accountId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an account" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {chartOfAccounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.accountNumber} - {acc.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                            <TableCell>
                                <Input type="number" className="text-right" value={line.debit || ''} onChange={e => handleLineChange(index, 'debit', e.target.value)} placeholder="0.00" />
                            </TableCell>
                             <TableCell>
                                <Input type="number" className="text-right" value={line.credit || ''} onChange={e => handleLineChange(index, 'credit', e.target.value)} placeholder="0.00" />
                            </TableCell>
                            <TableCell className="text-center">
                                {lines.length > 2 && (
                                    <Button variant="ghost" size="icon" onClick={() => removeLine(index)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell>
                             <Button variant="outline" size="sm" onClick={addLine}>Add Line</Button>
                        </TableCell>
                        <TableCell className="text-right font-bold">${totalDebit.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-bold">${totalCredit.toFixed(2)}</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    {!isBalanced && (
                         <TableRow>
                            <TableCell colSpan={4} className="text-right text-destructive font-medium">
                                Out of balance by ${(Math.abs(totalDebit - totalCredit)).toFixed(2)}
                            </TableCell>
                        </TableRow>
                    )}
                </TableFooter>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={!isReady}>{isEditMode ? 'Save Changes' : 'Create Entry'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
