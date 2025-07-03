
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Account, AccountType } from '@/lib/data';
import { accountTypes } from '@/lib/data';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { ChartOfAccountsFormDialog } from '@/components/accounting/chart-of-accounts-form-dialog';
import { Badge } from '@/components/ui/badge';

function AccountsTable({
    title,
    accounts,
    onEdit,
    onDelete,
} : {
    title: string,
    accounts: Account[],
    onEdit: (account: Account) => void,
    onDelete: (account: Account) => void,
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Number</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.map((account) => (
                          <TableRow key={account.id}>
                            <TableCell><Badge variant="outline">{account.accountNumber}</Badge></TableCell>
                            <TableCell className="font-medium">{account.name}</TableCell>
                            <TableCell className="text-muted-foreground">{account.description}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onEdit(account)}>Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onDelete(account)} className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default function ChartOfAccountsPage() {
  const { chartOfAccounts, deleteAccount } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(undefined);

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setFormOpen(true);
  };

  const handleDelete = (account: Account) => {
    setSelectedAccount(account);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAccount) {
      deleteAccount(selectedAccount.id);
      setConfirmDeleteOpen(false);
      setSelectedAccount(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedAccount(undefined);
    setFormOpen(true);
  };

  const accountsByType = accountTypes.reduce((acc, type) => {
    acc[type] = chartOfAccounts.filter(a => a.type === type);
    return acc;
  }, {} as Record<AccountType, Account[]>);

  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">Chart of Accounts</h1>
                 <p className="text-muted-foreground">Manage your company's financial accounts.</p>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Account
            </Button>
        </div>
        
        <div className="space-y-8">
            {accountTypes.map(type => (
                <AccountsTable 
                    key={type}
                    title={type}
                    accounts={accountsByType[type]}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}
        </div>
      </div>

      <ChartOfAccountsFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        account={selectedAccount}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this account?"
        description="This action cannot be undone. This will permanently remove the account from your Chart of Accounts."
      />
    </>
  );
}
