
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useData } from '@/contexts/data-context';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderKanban, Receipt, ClipboardCheck, Loader2, Clock, PlusCircle, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import type { Meeting } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { EventFormDialog } from '@/components/calendar/event-form-dialog';
import { DeleteConfirmationDialog } from '@/components/common/delete-confirmation-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type CalendarEvent = {
  id: string;
  type: 'Project' | 'Task' | 'Invoice' | 'Meeting';
  title: string;
  date: Date;
  link?: string;
  description?: string;
};

export default function CalendarPage() {
  const { projects, tasks, invoices, meetings, deleteMeeting } = useData();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>(undefined);

  useEffect(() => {
    // Set initial date only on the client to avoid hydration mismatch
    setDate(new Date());
  }, []);

  const events = useMemo(() => {
    const allEvents: CalendarEvent[] = [
      ...projects.map(p => ({ id: p.id, type: 'Project' as const, title: `Deadline: ${p.name}`, date: new Date(p.endDate), link: `/projects/${p.id}` })),
      ...tasks.map(t => ({ id: t.id, type: 'Task' as const, title: t.name, date: new Date(t.dueDate), link: `/projects/${t.projectId}` })),
      ...invoices.map(i => ({ id: i.id, type: 'Invoice' as const, title: `Due: ${i.client}`, date: new Date(i.date), link: `/invoices` })),
      ...meetings.map(m => ({ id: m.id, type: 'Meeting' as const, title: m.title, date: new Date(m.date), description: m.description })),
    ];
    return allEvents;
  }, [projects, tasks, invoices, meetings]);

  const eventsByDate = useMemo(() => {
    return events.reduce((acc, event) => {
      const dateKey = format(event.date, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      return acc;
    }, {} as Record<string, CalendarEvent[]>);
  }, [events]);

  const selectedDayEvents = date ? eventsByDate[format(date, 'yyyy-MM-dd')] || [] : [];
  
  const eventDays = Object.keys(eventsByDate).map(dateStr => new Date(dateStr));

  const eventTypeConfig = {
    Project: { icon: FolderKanban, color: 'bg-blue-500' },
    Task: { icon: ClipboardCheck, color: 'bg-yellow-500' },
    Invoice: { icon: Receipt, color: 'bg-green-500' },
    Meeting: { icon: Clock, color: 'bg-purple-500' },
  };
  
  const handleEdit = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setFormOpen(true);
  };
  
  const handleDelete = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setConfirmDeleteOpen(true);
  };
  
  const confirmDelete = () => {
    if (selectedMeeting) {
      deleteMeeting(selectedMeeting.id);
      setConfirmDeleteOpen(false);
      setSelectedMeeting(undefined);
    }
  };

  const openAddDialog = () => {
    setSelectedMeeting(undefined);
    setFormOpen(true);
  };

  // Render a loading state until the component has mounted on the client
  if (!date) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-1 flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="min-h-[550px]">
              <CardHeader>
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
             <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
             <Button onClick={openAddDialog}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Event
             </Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-1">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="w-full"
                    modifiers={{ event: eventDays }}
                    modifiersClassNames={{
                      event: 'relative !bg-primary/20 rounded-full',
                    }}
                    today={date}
                  />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Events for {date ? format(date, 'MMMM d, yyyy') : '...'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[450px]">
                    {selectedDayEvents.length > 0 ? (
                      <div className="space-y-2">
                        {selectedDayEvents.map(event => {
                           if (event.type === 'Meeting') {
                             return (
                               <div key={event.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors group">
                                  <div className={`mt-1.5 h-2 w-2 rounded-full ${eventTypeConfig[event.type].color}`} />
                                  <div className="flex-grow">
                                    <p className="font-medium">{event.title}</p>
                                    
                                    {event.description && (
                                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                    )}

                                    <Badge variant="outline" className="mt-2">{event.type}</Badge>
                                  </div>
                                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleEdit(meetings.find(m => m.id === event.id)!)}>Edit</DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(meetings.find(m => m.id === event.id)!)} className="text-destructive">Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                             )
                           } else {
                              const pageNameMap: Record<string, string> = {
                                'Project': 'Projects', 'Task': 'Projects', 'Invoice': 'Invoices'
                              };
                              const pageName = pageNameMap[event.type] || `${event.type.toLowerCase()}s`;
                              
                              const readOnlyEvent = (
                                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors group w-full">
                                  <div className={`mt-1.5 h-2 w-2 rounded-full ${eventTypeConfig[event.type].color}`} />
                                  <div className="flex-grow">
                                    <Link href={event.link!} className="font-medium hover:underline focus:outline-none focus:ring-1 focus:ring-ring rounded-sm">{event.title}</Link>
                                    <Badge variant="outline" className="mt-2">{event.type}</Badge>
                                  </div>
                                </div>
                              );

                              return (
                                <TooltipProvider key={event.id} delayDuration={300}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      {readOnlyEvent}
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Manage this {event.type.toLowerCase()} on the {pageName} page.</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                           }
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-10">No events for this day.</p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <EventFormDialog 
            open={isFormOpen}
            onOpenChange={setFormOpen}
            meeting={selectedMeeting}
        />
        <DeleteConfirmationDialog 
            open={isConfirmDeleteOpen}
            onOpenChange={setConfirmDeleteOpen}
            onConfirm={confirmDelete}
            title="Are you sure you want to delete this event?"
            description="This action cannot be undone and will permanently remove this meeting from the calendar."
        />
    </>
  );
}
