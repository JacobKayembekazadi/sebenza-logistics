
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { JournalEntry } from '@/lib/data';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { JournalEntryFormDialog } from '@/components/accounting/journal-entry-form-dialog';

export default function JournalEntriesPage() {
  const { journalEntries, deleteJournalEntry } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);

  const handleEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setFormOpen(true);
  };

  const handleDelete = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEntry) {
      deleteJournalEntry(selectedEntry.id);
      setConfirmDeleteOpen(false);
      setSelectedEntry(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedEntry(undefined);
    setFormOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">Journal Entries</h1>
                 <p className="text-muted-foreground">Log manual accounting entries for adjustments.</p>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Journal Entry
            </Button>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>History</CardTitle>
                <CardDescription>A log of all journal entries.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="multiple" className="w-full">
                    {journalEntries.map(entry => (
                        <AccordionItem value={entry.id} key={entry.id}>
                            <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center justify-between w-full pr-4">
                                    <div className="text-left">
                                        <p className="font-semibold">{entry.date}: {entry.description}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {entry.lines.length} lines, Total: ${entry.lines.reduce((sum, line) => sum + line.debit, 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEdit(entry)}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDelete(entry)} className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Account</TableHead>
                                            <TableHead className="text-right">Debit</TableHead>
                                            <TableHead className="text-right">Credit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {entry.lines.map((line, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium">{line.accountName}</TableCell>
                                                <TableCell className="text-right">{line.debit > 0 ? `$${line.debit.toFixed(2)}` : '-'}</TableCell>
                                                <TableCell className="text-right">{line.credit > 0 ? `$${line.credit.toFixed(2)}` : '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>

      <JournalEntryFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        entry={selectedEntry}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this journal entry?"
        description="This action cannot be undone and will permanently remove the entry."
      />
    </>
  );
}
