import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Phone, Send, Video } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const contacts = [
  { name: 'Alice Johnson', role: 'Apex Logistics', avatar: 'https://placehold.co/100x100/ffa590/ffffff.png', online: true, lastMessage: 'Sure, I will get back to you.' },
  { name: 'Bob Williams', role: 'Stellar Goods', avatar: 'https://placehold.co/100x100/90a5ff/ffffff.png', online: false, lastMessage: 'Can you check on INV-003?' },
  { name: 'Charlie Brown', role: 'Quantum Solutions', avatar: 'https://placehold.co/100x100/e890ff/ffffff.png', online: true, lastMessage: 'Thanks for the update!' },
];

const messages = [
    { from: 'me', text: 'Hi Alice, can you confirm the ETA for shipment #SHP-12345?' },
    { from: 'other', text: 'Hello! Let me check on that for you. One moment.' },
    { from: 'other', text: 'It looks like it\'s scheduled to arrive tomorrow at 2 PM.' },
    { from: 'me', text: 'Perfect, thank you for the quick response!' },
    { from: 'other', text: 'You\'re welcome! Is there anything else I can help with?' },
    { from: 'me', text: 'No, that\'s all for now. Have a great day!'},
    { from: 'other', text: 'Sure, I will get back to you.' },
]

export default function MessagingPage() {
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
       <h1 className="text-3xl font-bold tracking-tight mb-8">Messaging</h1>
      <Card className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-full">
        <div className="col-span-1 border-r">
          <div className="p-4">
            <Input placeholder="Search contacts..." />
          </div>
          <Separator/>
          <ScrollArea className="h-[calc(100%-4rem)]">
            <div className="p-2">
              {contacts.map(contact => (
                <div key={contact.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer">
                  <Avatar className="relative">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    {contact.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />}
                  </Avatar>
                  <div className="flex-grow overflow-hidden">
                    <p className="font-semibold truncate">{contact.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="md:col-span-2 lg:col-span-3 flex flex-col h-full">
            <div className="flex items-center p-4 border-b">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://placehold.co/100x100/ffa590/ffffff.png" />
                        <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">Alice Johnson</p>
                        <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <Button variant="ghost" size="icon"><Phone /></Button>
                    <Button variant="ghost" size="icon"><Video /></Button>
                </div>
            </div>
          <ScrollArea className="flex-grow p-4 bg-gray-50 dark:bg-gray-800/20">
            <div className="flex flex-col gap-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-xs lg:max-w-md ${msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-card'}`}>
                           {msg.text}
                        </div>
                    </div>
                ))}
            </div>
          </ScrollArea>
          <div className="p-4 border-t bg-card">
            <div className="relative">
              <Input placeholder="Type a message..." className="pr-24" />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                <Button variant="ghost" size="icon"><Paperclip/></Button>
                <Button variant="default" size="icon"><Send/></Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
