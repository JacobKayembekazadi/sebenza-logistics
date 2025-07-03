
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Phone, Send, Video, MoreVertical, PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useData } from '@/contexts/data-context';
import type { Contact, Message } from '@/lib/data';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

export default function MessagingPage() {
  const { contacts, messages, addMessage } = useData();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Select the first contact by default on mount
    if (contacts.length > 0 && !selectedContact) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts, selectedContact]);
  
  useEffect(() => {
    // Scroll to bottom of message list when new messages are added
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, selectedContact]);


  const selectedContactMessages = useMemo(() => {
    if (!selectedContact) return [];
    return messages
      .filter(m => m.contactId === selectedContact.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, selectedContact]);

  const latestMessages = useMemo(() => {
    const latest: Record<string, Message> = {};
    messages.forEach(msg => {
      if (!latest[msg.contactId] || new Date(msg.timestamp) > new Date(latest[msg.contactId].timestamp)) {
        latest[msg.contactId] = msg;
      }
    });
    return latest;
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedContact) {
      addMessage({
        contactId: selectedContact.id,
        from: 'me',
        text: newMessage,
      });
      setNewMessage('');
    }
  };
  
  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };
  
  // Placeholder functions for CRUD operations on contacts
  const handleAddContact = () => alert("Add contact functionality not yet implemented.");
  const handleEditContact = (contact: Contact) => alert(`Edit contact ${contact.name} not yet implemented.`);
  const handleDeleteContact = (contact: Contact) => alert(`Delete contact ${contact.name} not yet implemented.`);


  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
       <h1 className="text-3xl font-bold tracking-tight mb-8">Messaging</h1>
      <Card className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
        <div className="col-span-1 border-r flex flex-col">
          <div className="p-4 flex items-center justify-between gap-2">
            <Input placeholder="Search contacts..." className="flex-grow"/>
            <Button size="icon" variant="ghost" onClick={handleAddContact}><PlusCircle className="h-5 w-5"/></Button>
          </div>
          <Separator/>
          <ScrollArea className="flex-grow">
            <div className="p-2">
              {contacts.map(contact => {
                const lastMessage = latestMessages[contact.id];
                return (
                    <div 
                        key={contact.id} 
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedContact?.id === contact.id ? 'bg-accent' : 'hover:bg-accent'}`}
                        onClick={() => handleSelectContact(contact)}
                    >
                        <Avatar className="relative">
                            <AvatarImage src={contact.avatar} data-ai-hint="person" />
                            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                            {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />}
                        </Avatar>
                        <div className="flex-grow overflow-hidden">
                            <p className="font-semibold truncate">{contact.name}</p>
                            {lastMessage && <p className="text-sm text-muted-foreground truncate">{lastMessage.text}</p>}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={(e) => e.stopPropagation()}><MoreVertical className="h-4 w-4"/></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleEditContact(contact)}>Edit Contact</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteContact(contact)} className="text-destructive">Delete Contact</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
            {selectedContact ? (
                <>
                    <div className="flex items-center p-4 border-b">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={selectedContact.avatar} data-ai-hint="person"/>
                                <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{selectedContact.name}</p>
                                <p className="text-sm text-muted-foreground">{selectedContact.online ? 'Online' : 'Offline'}</p>
                            </div>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                            <Button variant="ghost" size="icon"><Phone /></Button>
                            <Button variant="ghost" size="icon"><Video /></Button>
                        </div>
                    </div>
                    <ScrollArea className="flex-grow p-4 bg-gray-50 dark:bg-gray-800/20" ref={scrollAreaRef}>
                        <div className="flex flex-col gap-4">
                            {selectedContactMessages.map((msg) => (
                                <div key={msg.id} className={`flex flex-col gap-1 ${msg.from === 'me' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                                    {msg.text}
                                    </div>
                                    <p className="text-xs text-muted-foreground px-1">{formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}</p>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="p-4 border-t bg-card">
                        <form onSubmit={handleSendMessage} className="relative">
                            <Input 
                                placeholder="Type a message..." 
                                className="pr-24" 
                                value={newMessage} 
                                onChange={(e) => setNewMessage(e.target.value)} 
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                <Button variant="ghost" size="icon" type="button"><Paperclip/></Button>
                                <Button variant="default" size="icon" type="submit"><Send/></Button>
                            </div>
                        </form>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-muted-foreground">Select a contact to start messaging</p>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
}
