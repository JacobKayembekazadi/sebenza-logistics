
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PlusCircle, File, FileImage, FileText, FileArchive } from 'lucide-react';
import { useData } from '@/contexts/data-context';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Document } from '@/lib/data';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { DocumentFormDialog } from '@/components/documents/document-form-dialog';

const fileTypeIcons = {
  'PDF': <FileText className="h-5 w-5 text-red-500" />,
  'Word': <FileText className="h-5 w-5 text-blue-500" />,
  'Image': <FileImage className="h-5 w-5 text-green-500" />,
  'Archive': <FileArchive className="h-5 w-5 text-yellow-500" />,
  'Default': <File className="h-5 w-5 text-muted-foreground" />,
};

const getIconForType = (type: string) => {
  return fileTypeIcons[type as keyof typeof fileTypeIcons] || fileTypeIcons['Default'];
};


export default function DocumentsPage() {
  const { documents, deleteDocument } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | undefined>(undefined);

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setFormOpen(true);
  };

  const handleDelete = (doc: Document) => {
    setSelectedDocument(doc);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDocument) {
      deleteDocument(selectedDocument.id);
      setConfirmDeleteOpen(false);
      setSelectedDocument(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedDocument(undefined);
    setFormOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>Manage your uploaded documents.</CardDescription>
            </div>
            <Button size="sm" onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Related To</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getIconForType(doc.type)}
                        <span className="font-medium">{doc.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{doc.relatedTo}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(doc)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Download</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(doc)} className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <DocumentFormDialog
        open={isFormOpen}
        onOpenChange={setFormOpen}
        document={selectedDocument}
      />
      <DeleteConfirmationDialog
        open={isConfirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this document?"
        description="This action cannot be undone. This will permanently remove the document entry."
      />
    </>
  );
}
