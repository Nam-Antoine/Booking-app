"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, LayoutGrid, List, Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventDialog } from "@/components/event-dialog"
import { InteractiveCalendar, type CalendarEvent } from "@/components/interactive-calendar"

// Sample data for initial calendar events (for the logged-in user "Dr. Smith")
const initialEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Physics Lecture",
    description: "Introduction to Quantum Mechanics",
    start: new Date(2025, 2, 15, 9, 0), // March 15, 2025, 9:00 AM
    end: new Date(2025, 2, 15, 11, 0), // March 15, 2025, 11:00 AM
    section: "Lecture Hall A",
    bookedBy: "Dr. Smith",
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: "5",
    title: "Faculty Meeting",
    description: "Semester Planning",
    start: new Date(2025, 2, 18, 9, 0), // March 18, 2025, 9:00 AM
    end: new Date(2025, 2, 18, 10, 30), // March 18, 2025, 10:30 AM
    section: "Seminar Room B",
    bookedBy: "Dr. Smith",
    color: "bg-red-100 text-red-800",
  },
  {
    id: "6",
    title: "Office Hours",
    description: "Student consultations",
    start: new Date(2025, 2, 20, 13, 0), // March 20, 2025, 1:00 PM
    end: new Date(2025, 2, 20, 15, 0), // March 20, 2025, 3:00 PM
    section: "Study Room D",
    bookedBy: "Dr. Smith",
    color: "bg-green-100 text-green-800",
  },
]

// Sample data for rooms/sections
const rooms = [
  {
    id: 1,
    name: "Lecture Hall A",
    capacity: 120,
    features: ["Projector", "Audio System", "Whiteboard"],
    location: "Main Building, Floor 1",
  },
  {
    id: 2,
    name: "Seminar Room B",
    capacity: 40,
    features: ["Smart Board", "Video Conference"],
    location: "Science Block, Floor 2",
  },
  {
    id: 3,
    name: "Computer Lab C",
    capacity: 30,
    features: ["30 Computers", "Projector", "Printer"],
    location: "Technology Wing, Floor 1",
  },
  {
    id: 4,
    name: "Study Room D",
    capacity: 15,
    features: ["Whiteboard", "Round Table"],
    location: "Library, Floor 3",
  },
]

export default function MyBookingsPage() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newEventTimes, setNewEventTimes] = useState<{ start: Date; end: Date } | null>(null)
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "stats">("calendar")

  // Filter events for the current user (Dr. Smith)
  const userEvents = useMemo(() => {
    return events.filter((event) => event.bookedBy === "Dr. Smith")
  }, [events])

  // Get upcoming events (sorted by date)
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return [...userEvents]
      .filter((event) => new Date(event.start) > now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
  }, [userEvents])

  // Get past events
  const pastEvents = useMemo(() => {
    const now = new Date()
    return [...userEvents]
      .filter((event) => new Date(event.start) < now)
      .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
  }, [userEvents])

  // Calculate booking statistics
  const bookingStats = useMemo(() => {
    const totalHours = userEvents.reduce((total, event) => {
      const duration = (new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60)
      return total + duration
    }, 0)

    const sectionUsage = userEvents.reduce(
      (acc, event) => {
        acc[event.section] = (acc[event.section] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const mostUsedSection = Object.entries(sectionUsage).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"

    return {
      totalBookings: userEvents.length,
      totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal place
      mostUsedSection,
      sectionUsage,
    }
  }, [userEvents])

  // Handle event click
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setDialogOpen(true)
  }, [])

  // Handle date/time slot click for new event
  const handleAddEvent = useCallback((start: Date, end: Date) => {
    setSelectedEvent(undefined)
    setNewEventTimes({ start, end })
    setDialogOpen(true)
  }, [])

  // Save event (create or update)
  const handleSaveEvent = useCallback(
    (eventData: Omit<CalendarEvent, "id" | "color">) => {
      if (selectedEvent) {
        // Update existing event
        setEvents((prev) => prev.map((event) => (event.id === selectedEvent.id ? { ...event, ...eventData } : event)))
      } else {
        // Create new event
        const colors = [
          "bg-blue-100 text-blue-800",
          "bg-green-100 text-green-800",
          "bg-purple-100 text-purple-800",
          "bg-yellow-100 text-yellow-800",
          "bg-red-100 text-red-800",
        ]
        const randomColor = colors[Math.floor(Math.random() * colors.length)]

        setEvents((prev) => [
          ...prev,
          {
            id: `event-${Date.now()}`,
            ...eventData,
            color: randomColor,
          },
        ])
      }
    },
    [selectedEvent],
  )

  // Delete event
  const handleDeleteEvent = useCallback(() => {
    if (selectedEvent) {
      setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id))
      setDialogOpen(false)
    }
  }, [selectedEvent])

  // Navigate to previous month in mini calendar
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  // Navigate to next month in mini calendar
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  // Render mini calendar
  const renderMiniCalendar = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    // Create array for the days of the week
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return (
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <Button variant="ghost" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-medium">{format(currentDate, "MMMM yyyy")}</h3>
          <Button variant="ghost" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map((day, i) => (
            <div key={i} className="text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
          {Array.from({ length: new Date(monthStart).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}
          {days.map((day, i) => {
            const hasEvent = userEvents.some((event) => isSameDay(new Date(event.start), day))
            return (
              <div
                key={i}
                className={`h-8 flex items-center justify-center text-sm rounded-full cursor-pointer
                  ${isSameDay(day, new Date()) ? "bg-primary text-primary-foreground" : ""}
                  ${hasEvent && !isSameDay(day, new Date()) ? "bg-primary/20" : ""}
                  hover:bg-muted`}
                onClick={() => setCurrentDate(day)}
              >
                {format(day, "d")}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">My Bookings</h1>
          <p className="text-muted-foreground">Manage and track your room bookings</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/")}>
            Back to Dashboard
          </Button>
          <Button
          className="bg-blue-700"
            onClick={() =>
              handleAddEvent(new Date(currentDate.setHours(9, 0, 0, 0)), new Date(currentDate.setHours(10, 0, 0, 0)))
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <h3 className="text-2xl font-bold">{bookingStats.totalBookings}</h3>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-3 text-center">
                  <h3 className="text-2xl font-bold">{bookingStats.totalHours}</h3>
                  <p className="text-sm text-muted-foreground">Hours Booked</p>
                </div>
              </div>
              {/* <div>
                <h4 className="text-sm font-medium mb-2">Most Used Section</h4>
                <div className="bg-muted p-2 rounded-md text-center">{bookingStats.mostUsedSection}</div>
              </div> */}
              {renderMiniCalendar()}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full  hover:bg-red-500 hover:text-neutral-100" onClick={() => setViewMode("stats")}>
                View Detailed Stats
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Upcoming Bookings</CardTitle>
              <CardDescription>Your next scheduled bookings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-2 p-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => handleEventClick(event)}
                >
                  <div className={`w-2 h-full rounded-full ${event.color?.split(" ")[0] || "bg-primary"}`} />
                  <div>
                    <h4 className="font-medium text-sm">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">{format(new Date(event.start), "MMM d, h:mm a")}</p>
                    <p className="text-xs">{event.section}</p>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">No upcoming bookings</p>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full border hover:bg-red-500 hover:text-neutral-100" onClick={() => setViewMode("list")}>
                View All Bookings
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle>Booking Calendar</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "calendar" ? "default" : "outline"}
                    size="sm"
                    className={viewMode === "calendar" ? "bg-red-600 text-white" : ""}
                    onClick={() => setViewMode("calendar")}
                  >
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Calendar
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    className={viewMode === "list" ? "bg-red-600 text-white" : ""}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 mr-1" />
                    List
                  </Button>
                  <Button
                    variant={viewMode === "stats" ? "default" : "outline"}
                    size="sm"
                    className={viewMode === "stats" ? "bg-red-600 text-white" : ""}
                    onClick={() => setViewMode("stats")}
                  >
                    <LayoutGrid className="h-4 w-4 mr-1" />
                    Stats
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {viewMode === "calendar" && (
                <div className="p-4">
                  <InteractiveCalendar
                    events={userEvents}
                    onEventClick={handleEventClick}
                    onAddEvent={handleAddEvent}
                    currentDate={currentDate}
                  />
                </div>
              )}

              {viewMode === "list" && (
                <div className="p-4">
                  <Tabs defaultValue="upcoming">
                    <TabsList className="mb-4">
                      <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                      <TabsTrigger value="past">Past</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upcoming" className="space-y-4">
                      {upcomingEvents.length > 0 ? (
                        upcomingEvents.map((event) => (
                          <Card
                            key={event.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleEventClick(event)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`p-2 rounded-full ${event.color?.split(" ")[0] || "bg-primary"} ${event.color?.split(" ")[1] || "text-primary-foreground"}`}
                                  >
                                    <CalendarIcon className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold">{event.title}</h3>
                                      <Badge variant="outline" className="ml-2">
                                        {event.section}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" /> {format(new Date(event.start), "PPP")}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {format(new Date(event.start), "h:mm a")} -{" "}
                                        {format(new Date(event.end), "h:mm a")}
                                      </div>
                                    </div>
                                    {event.description && <p className="mt-2 text-sm">{event.description}</p>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleEventClick(event)
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedEvent(event)
                                      handleDeleteEvent()
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No upcoming bookings</p>
                          <Button
                            className="mt-4"
                            onClick={() =>
                              handleAddEvent(
                                new Date(currentDate.setHours(9, 0, 0, 0)),
                                new Date(currentDate.setHours(10, 0, 0, 0)),
                              )
                            }
                          >
                            Create a Booking
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="past" className="space-y-4">
                      {pastEvents.length > 0 ? (
                        pastEvents.map((event) => (
                          <Card key={event.id} className="opacity-75">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`p-2 rounded-full ${event.color?.split(" ")[0] || "bg-primary"} ${event.color?.split(" ")[1] || "text-primary-foreground"}`}
                                  >
                                    <CalendarIcon className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold">{event.title}</h3>
                                      <Badge variant="outline" className="ml-2">
                                        {event.section}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" /> {format(new Date(event.start), "PPP")}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {format(new Date(event.start), "h:mm a")} -{" "}
                                        {format(new Date(event.end), "h:mm a")}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <Badge>Completed</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No past bookings</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {viewMode === "stats" && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="text-3xl font-bold text-primary">{bookingStats.totalBookings}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Total Bookings</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="text-3xl font-bold text-primary">{bookingStats.totalHours}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Hours Booked</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <h3 className="text-3xl font-bold text-primary">{bookingStats.mostUsedSection}</h3>
                          <p className="text-sm text-muted-foreground mt-1">Most Used Section</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <h3 className="text-lg font-medium mb-4">Section Usage</h3>
                  <div className="space-y-4">
                    {Object.entries(bookingStats.sectionUsage).map(([section, count]) => (
                      <div key={section} className="bg-muted rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{section}</h4>
                          <span className="text-sm">{count} bookings</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${(count / bookingStats.totalBookings) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <EventDialog
        event={selectedEvent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        startTime={newEventTimes?.start}
        endTime={newEventTimes?.end}
        sections={rooms}
      />
    </div>
  )
}

