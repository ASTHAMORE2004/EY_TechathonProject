import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Bell, CheckCircle } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore } from 'date-fns';

interface EMIEntry {
  id: string;
  name: string;
  amount: number;
  dueDate: number; // Day of month
  color: string;
  isPaid?: boolean;
}

export const EMICalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Sample EMI entries - in real app, fetch from database
  const emiEntries: EMIEntry[] = [
    { id: '1', name: 'Home Loan', amount: 35000, dueDate: 5, color: '#8884d8' },
    { id: '2', name: 'Car Loan', amount: 15000, dueDate: 10, color: '#82ca9d' },
    { id: '3', name: 'Personal Loan', amount: 8000, dueDate: 15, color: '#ffc658' },
    { id: '4', name: 'Credit Card', amount: 5000, dueDate: 20, color: '#ff7300' },
  ];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEMIsForDay = (day: number) => {
    return emiEntries.filter(emi => emi.dueDate === day);
  };

  const totalMonthlyEMI = emiEntries.reduce((sum, emi) => sum + emi.amount, 0);

  const upcomingEMIs = useMemo(() => {
    const today = new Date().getDate();
    return emiEntries
      .filter(emi => emi.dueDate >= today)
      .sort((a, b) => a.dueDate - b.dueDate)
      .slice(0, 3);
  }, [emiEntries]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            EMI Calendar
          </span>
          <Badge variant="secondary" className="text-sm">
            Total: ₹{totalMonthlyEMI.toLocaleString()}/month
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold text-lg">{format(currentMonth, 'MMMM yyyy')}</h3>
          <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before month start */}
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}
          
          {/* Month days */}
          {monthDays.map((day) => {
            const dayNum = day.getDate();
            const dayEMIs = getEMIsForDay(dayNum);
            const hasEMI = dayEMIs.length > 0;
            const isPast = isBefore(day, new Date()) && !isToday(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  p-2 min-h-12 rounded-lg cursor-pointer transition-all relative
                  ${isToday(day) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                  ${hasEMI ? 'ring-2 ring-offset-1 ring-primary' : ''}
                  ${isPast ? 'opacity-50' : ''}
                `}
              >
                <span className="text-sm font-medium">{dayNum}</span>
                {hasEMI && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    {dayEMIs.map((emi) => (
                      <div
                        key={emi.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: emi.color }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Day Details */}
        {selectedDate && (
          <div className="p-4 bg-muted/50 rounded-xl">
            <h4 className="font-semibold mb-2">{format(selectedDate, 'MMMM d, yyyy')}</h4>
            {getEMIsForDay(selectedDate.getDate()).length > 0 ? (
              <div className="space-y-2">
                {getEMIsForDay(selectedDate.getDate()).map((emi) => (
                  <div key={emi.id} className="flex items-center justify-between p-2 bg-background rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emi.color }} />
                      <span className="font-medium">{emi.name}</span>
                    </div>
                    <span className="font-bold">₹{emi.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No EMIs due on this date</p>
            )}
          </div>
        )}

        {/* Upcoming EMIs */}
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Upcoming EMIs
          </h4>
          {upcomingEMIs.map((emi) => (
            <div key={emi.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emi.color }} />
                <div>
                  <p className="font-medium text-sm">{emi.name}</p>
                  <p className="text-xs text-muted-foreground">Due: {emi.dueDate}th of every month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">₹{emi.amount.toLocaleString()}</p>
                <Badge variant="outline" className="text-xs">
                  {emi.dueDate - new Date().getDate()} days left
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-2 border-t">
          {emiEntries.map((emi) => (
            <div key={emi.id} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emi.color }} />
              <span className="text-xs">{emi.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
