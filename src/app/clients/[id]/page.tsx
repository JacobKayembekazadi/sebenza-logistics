

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/contexts/data-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Pencil, File, Receipt, FileText, FolderKanban } from 'lucide-react';
import type { Invoice, Estimate } from '@/lib/data';
import { useMemo, useEffect, useState } from 'react';

type EffectiveStatus = Invoice['status'] | 'Overdue';

export default function ClientProfilePage() {
    const params = useParams();
    const router = useRouter();
    const { clients, invoices, estimates, projects, documents } = useData();
    const [today, setToday] = useState<Date | null>(null);

    const clientId = params.id as string;
    const client = clients.find(c => c.id === clientId);

    const clientInvoices = useMemo(() => invoices.filter(inv => inv.client === client?.name), [invoices, client]);
    const clientEstimates = useMemo(() => estimates.filter(est => est.client === client?.name), [estimates, client]);
    
    const clientProjectIds = useMemo(() => {
        const ids = new Set<string>();
        clientInvoices.forEach(inv => {
            if (inv.projectId) {
                ids.add(inv.projectId);
            }
        });
        return Array.from(ids);
    }, [clientInvoices]);

    const clientProjects = useMemo(() => projects.filter(p => clientProjectIds.includes(p.id)), [projects, clientProjectIds]);

    const clientDocumentIds = useMemo(() => {
        const invoiceIds = new Set(clientInvoices.map(i => i.id));
        const projectIds = new Set(clientProjects.map(p => p.id));
        return new Set(documents.filter(d => invoiceIds.has(d.relatedTo) || projectIds.has(d.relatedTo)).map(d => d.id));
    }, [documents, clientInvoices, clientProjects]);

    const clientDocuments = useMemo(() => documents.filter(d => clientDocumentIds.has(d.id)), [documents, clientDocumentIds]);

    useEffect(() => {
        if (!client) {
          router.push('/clients');
        }
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        setToday(d);
    }, [client, router]);

    const getInvoiceEffectiveStatus = (invoice: Invoice): EffectiveStatus => {
        if (invoice.status === 'Paid') return 'Paid';
        if (!today) {
            return invoice.status;
        }
        const dueDate = new Date(invoice.date);
        if (dueDate < today) return 'Overdue';
        return invoice.status;
    };
    
    const estimateStatusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
        'Draft': 'secondary', 'Sent': 'default', 'Accepted': 'outline', 'Declined': 'destructive',
    };
    const estimateStatusStyle : { [key: string]: string } = {
        'Accepted': 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700',
    };

    if (!client) {
        return <p>Client not found. Redirecting...</p>;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={client.avatar} data-ai-hint="person" />
                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
                    <p className="text-muted-foreground">{client.email}</p>
                </div>
            </div>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices ({clientInvoices.length})</TabsTrigger>
                    <TabsTrigger value="estimates">Estimates ({clientEstimates.length})</TabsTrigger>
                    <TabsTrigger value="projects">Projects ({clientProjects.length})</TabsTrigger>
                    <TabsTrigger value="documents">Documents ({clientDocuments.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Contact Information</CardTitle>
                            <Button variant="outline" size="sm">
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="font-medium">Email Address</h3>
                                <p className="text-muted-foreground">{client.email}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Phone Number</h3>
                                <p className="text-muted-foreground">{client.phone}</p>
                            </div>
                            <div>
                                <h3 className="font-medium">Address</h3>
                                <p className="text-muted-foreground whitespace-pre-wrap">{client.address}</p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="invoices" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invoice History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                        <TableHead className="text-right">Balance Due</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientInvoices.map(invoice => {
                                        const status = getInvoiceEffectiveStatus(invoice);
                                        const totalAmount = invoice.amount + (invoice.tax || 0) - (invoice.discount || 0) + (invoice.lateFee || 0);
                                        const balanceDue = totalAmount - (invoice.paidAmount || 0);

                                        return (
                                            <TableRow key={invoice.id}>
                                                <TableCell>
                                                    <Link href="/invoices" className="font-medium text-primary hover:underline">{invoice.id}</Link>
                                                </TableCell>
                                                <TableCell>{invoice.date}</TableCell>
                                                <TableCell>
                                                    <Badge variant={status === 'Paid' ? 'outline' : status === 'Overdue' ? 'destructive' : 'default'} className={status === 'Paid' ? 'bg-accent text-accent-foreground' : ''}>{status}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">${totalAmount.toFixed(2)}</TableCell>
                                                <TableCell className="text-right font-medium">${balanceDue.toFixed(2)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="estimates" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Estimate History</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Estimate #</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientEstimates.map(est => (
                                        <TableRow key={est.id}>
                                            <TableCell>
                                                <Link href="/estimates" className="font-medium text-primary hover:underline">{est.estimateNumber}</Link>
                                            </TableCell>
                                            <TableCell>{est.date}</TableCell>
                                            <TableCell>
                                                <Badge variant={estimateStatusVariant[est.status]} className={estimateStatusStyle[est.status]}>{est.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">${est.amount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="projects" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Associated Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Project Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Progress</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientProjects.map(proj => (
                                        <TableRow key={proj.id}>
                                            <TableCell>
                                                <Link href={`/projects/${proj.id}`} className="font-medium text-primary hover:underline">{proj.name}</Link>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={proj.status === 'Completed' ? 'secondary' : 'default'}>{proj.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">{proj.progress}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="documents" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Associated Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Related To</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clientDocuments.map(doc => (
                                        <TableRow key={doc.id}>
                                            <TableCell>
                                                <Link href="/documents" className="font-medium text-primary hover:underline flex items-center gap-2">
                                                    <File className="h-4 w-4"/> {doc.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell>{doc.type}</TableCell>
                                            <TableCell>
                                                <Link href={doc.relatedTo.startsWith('INV') ? '/invoices' : `/projects/${doc.relatedTo}`} className="text-muted-foreground hover:underline">
                                                    {doc.relatedTo}
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
