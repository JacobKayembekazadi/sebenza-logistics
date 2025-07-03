
'use client';

import { useData } from "@/contexts/data-context";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SalesByClientReport() {
  const { invoices, clients } = useData();

  const salesByClient = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((acc, invoice) => {
      acc[invoice.client] = (acc[invoice.client] || 0) + invoice.amount;
      return acc;
    }, {} as Record<string, number>);
  
  const sortedClients = Object.entries(salesByClient)
    .map(([clientName, totalSales]) => {
        const clientData = clients.find(c => c.name === clientName);
        return {
            ...clientData,
            name: clientName,
            totalSales,
        };
    })
    .sort((a, b) => b.totalSales - a.totalSales);

  return (
    <div>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Paid Invoices</TableHead>
                    <TableHead className="text-right">Total Revenue</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedClients.map((client) => (
                    <TableRow key={client.id || client.name}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={client.avatar} data-ai-hint="person" />
                                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <p className="font-medium">{client.name}</p>
                            </div>
                        </TableCell>
                         <TableCell>
                            {invoices.filter(i => i.client === client.name && i.status === 'Paid').length}
                        </TableCell>
                        <TableCell className="text-right font-mono">${client.totalSales.toFixed(2)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
