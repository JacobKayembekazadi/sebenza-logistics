
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { useData } from '@/contexts/data-context';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderKanban, Receipt, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

type CalendarEvent = {
  id: string;
  type: 'Project' | 'Task' | 'Invoice';
  title: string;
  date: Date;
  link: string;
};

export default function CalendarPage() {
  const { projects, tasks, invoices } = useData();
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setDate(new Date());
  }, []);

  const events = useMemo(() => {
    const allEvents: CalendarEvent[] = [
      ...projects.map(p => ({ id: p.id, type: 'Project' as const, title: `Deadline: ${p.name}`, date: new Date(p.endDate), link: `/projects/${p.id}` })),
      ...tasks.map(t => ({ id: t.id, type: 'Task' as const, title: t.name, date: new Date(t.dueDate), link: `/projects/${t.projectId}` })),
      ...invoices.map(i => ({ id: i.id, type: 'Invoice' as const, title: `Due: ${i.client}`, date: new Date(i.date), link: `/invoices` })),
    ];
    return allEvents;
  }, [projects, tasks, invoices]);

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
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
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
                  <div className="space-y-4">
                    {selectedDayEvents.map(event => (
                      <Link href={event.link} key={event.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors">
                        <div className={`mt-1 h-2 w-2 rounded-full ${eventTypeConfig[event.type].color}`} />
                        <div className="flex-grow">
                          <p className="font-medium">{event.title}</p>
                          <Badge variant="outline" className="mt-1">{event.type}</Badge>
                        </div>
                      </Link>
                    ))}
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
  );
}
