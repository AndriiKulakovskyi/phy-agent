import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Clock, Calendar as CalendarIcon, CheckCircle } from "lucide-react";

interface SessionSchedulerProps {
  onSchedule?: (date: Date, time: string) => void;
  availableTimes?: string[];
  upcomingSessions?: {
    date: Date;
    time: string;
    type: string;
  }[];
}

const SessionScheduler = ({
  onSchedule = () => {},
  availableTimes = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ],
  upcomingSessions = [
    {
      date: new Date(Date.now() + 86400000 * 2), // 2 days from now
      time: "10:00 AM",
      type: "Check-in Session",
    },
    {
      date: new Date(Date.now() + 86400000 * 7), // 7 days from now
      time: "2:00 PM",
      type: "Therapy Session",
    },
  ],
}: SessionSchedulerProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  const handleScheduleSession = () => {
    if (selectedDate && selectedTime) {
      onSchedule(selectedDate, selectedTime);
      setShowScheduleDialog(false);
      setShowConfirmation(true);
    }
  };

  return (
    <div className="w-full h-full bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Session Scheduler</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Schedule a New Session</CardTitle>
                <CardDescription>
                  Select a date and time for your next therapy session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      disabled={(date) => {
                        // Disable past dates and weekends
                        return (
                          date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                          date.getDay() === 0 ||
                          date.getDay() === 6
                        );
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-3 flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      Available Times
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTimes.map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          className="justify-start"
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setShowScheduleDialog(true)}
                  disabled={!selectedDate || !selectedTime}
                  className="ml-auto"
                >
                  Schedule Session
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Upcoming Sessions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>
                  Your scheduled therapy sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session, index) => (
                      <div
                        key={index}
                        className="flex items-start p-3 rounded-lg border bg-card/50"
                      >
                        <div className="mr-3 bg-primary/10 p-2 rounded-full">
                          <CalendarIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{session.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(session.date, "EEEE, MMMM d, yyyy")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {session.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-6">
                      No upcoming sessions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Scheduled!</DialogTitle>
            <DialogDescription>
              Your therapy session has been successfully scheduled.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <p className="font-medium text-center">
              {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
            </p>
            <p className="text-muted-foreground text-center">{selectedTime}</p>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowConfirmation(false)}
              className="w-full"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Confirmation Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Session</DialogTitle>
            <DialogDescription>
              Please confirm your therapy session details.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="font-medium">
                  {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="pt-2">
                <label className="text-sm font-medium mb-1 block">
                  Session Type
                </label>
                <Select defaultValue="therapy">
                  <SelectTrigger>
                    <SelectValue placeholder="Select session type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="therapy">Therapy Session</SelectItem>
                    <SelectItem value="checkin">Check-in Session</SelectItem>
                    <SelectItem value="initial">Initial Assessment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowScheduleDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleScheduleSession}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionScheduler;
