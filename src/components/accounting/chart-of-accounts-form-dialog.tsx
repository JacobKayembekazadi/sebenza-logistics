
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
import type { Account, AccountType } from "@/lib/data";
import { accountTypes } from "@/lib/data";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";

interface ChartOfAccountsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account;
}

export function ChartOfAccountsFormDialog({ open, onOpenChange, account }: ChartOfAccountsFormDialogProps) {
  const { addAccount, updateAccount } = useData();
  const [accountNumber, setAccountNumber] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<AccountType>('Asset');
  
  const isEditMode = !!account;

  useEffect(() => {
    if (account) {
      setAccountNumber(account.accountNumber);
      setName(account.name);
      setDescription(account.description);
      setType(account.type);
    } else {
      setAccountNumber('');
      setName('');
      setDescription('');
      setType('Asset');
    }
  }, [account, open]);

  const handleSubmit = () => {
    const accountData = { 
      accountNumber,
      name,
      description,
      type
    };

    if (isEditMode && account) {
      updateAccount({ ...account, ...accountData });
    } else {
      addAccount(accountData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Account' : 'Add New Account'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the account details below.' : 'Fill in the details for the new account.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="accountNumber" className="text-right">Number</Label>
            <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">Type</Label>
            <Select onValueChange={(value: AccountType) => setType(value)} value={type}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit}>{isEditMode ? 'Save Changes' : 'Add Account'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
