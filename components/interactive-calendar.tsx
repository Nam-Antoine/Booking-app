"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import {
  addDays,
  addHours,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  getHours,
  getMinutes,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Types for our calendar events
export type CalendarEvent = {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  color?: string
  section: string
  bookedBy: string
}

type CalendarProps = {
  events: CalendarEvent[]
  onEventClick?: (event: CalendarEvent) => void
  onDateClick?: (date: Date) => void
  onAddEvent?: (start: Date, end: Date) => void
  currentDate?: Date
}

type ViewType = "day" | "week" | "month"

export function InteractiveCalendar({ events, onEventClick, onDateClick, onAddEvent, currentDate }: CalendarProps) {
  const [internalCurrentDate, setInternalCurrentDate] = React.useState(new Date())
  const [view, setView] = React.useState<ViewType>("week")
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null)

  // Use the provided currentDate if available
  React.useEffect(() => {
    if (currentDate) {
      setInternalCurrentDate(currentDate)
    }
  }, [currentDate])

  // Get days for the current view
  const getDays = () => {
    if (view === "day") {
      return [internalCurrentDate]
    } else if (view === "week") {
      const start = startOfWeek(internalCurrentDate, { weekStartsOn: 0 })
      const end = endOfWeek(internalCurrentDate, { weekStartsOn: 0 })
      return eachDayOfInterval({ start, end })
    } else {
      const start = startOfMonth(internalCurrentDate)
      const end = endOfMonth(internalCurrentDate)
      return eachDayOfInterval({ start, end })
    }
  }

  // Get hours for the day view
  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Update the prev function
  const prev = () => {
    if (view === "day") {
      setInternalCurrentDate(addDays(internalCurrentDate, -1))
    } else if (view === "week") {
      setInternalCurrentDate(addDays(internalCurrentDate, -7))
    } else {
      setInternalCurrentDate(subMonths(internalCurrentDate, 1))
    }
  }

  // Update the next function
  const next = () => {
    if (view === "day") {
      setInternalCurrentDate(addDays(internalCurrentDate, 1))
    } else if (view === "week") {
      setInternalCurrentDate(addDays(internalCurrentDate, 7))
    } else {
      setInternalCurrentDate(addMonths(internalCurrentDate, 1))
    }
  }

  // Update the today function
  const today = () => {
    setInternalCurrentDate(new Date())
  }

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    onDateClick?.(date)
  }

  // Handle event click
  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation()
    onEventClick?.(event)
  }

  // Handle time slot click for adding new event
  const handleTimeSlotClick = (date: Date, hour: number) => {
    if (onAddEvent) {
      const start = setHours(setMinutes(date, 0), hour)
      const end = addHours(start, 1)
      onAddEvent(start, end)
    }
  }

  // Get events for a specific day
  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(parseISO(event.start.toString()), day))
  }

  // Position event in the time grid
  const getEventPosition = (event: CalendarEvent) => {
    const startHour = getHours(parseISO(event.start.toString()))
    const startMinute = getMinutes(parseISO(event.start.toString()))
    const endHour = getHours(parseISO(event.end.toString()))
    const endMinute = getMinutes(parseISO(event.end.toString()))

    const top = startHour * 60 + startMinute
    const height = endHour * 60 + endMinute - top

    return {
      top: `${top}px`,
      height: `${height}px`,
    }
  }

  // Render the month view
  const renderMonthView = () => {
    const days = getDays()
    const firstDayOfMonth = startOfMonth(internalCurrentDate)
    const startingDayOfWeek = getDay(firstDayOfMonth)

    // Create array for the days of the week
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    return (
      <div className="h-full flex flex-col">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center font-medium py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 flex-1 auto-rows-min">
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="p-1 min-h-[80px] bg-muted/20 rounded-md"></div>
          ))}
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day)
            const isCurrentMonth = isSameMonth(day, internalCurrentDate)

            return (
              <div
                key={index}
                className={cn(
                  "p-1 min-h-[80px] h-full rounded-md border cursor-pointer transition-colors text-sm",
                  isToday(day) ? "bg-blue-50 border-blue-200" : "bg-background",
                  !isCurrentMonth && "opacity-50",
                )}
                onClick={() => handleDateClick(day)}
              >
                <div className="font-medium text-xs mb-1">{format(day, "d")}</div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={cn(
                        "text-[10px] py-0.5 px-1 rounded truncate",
                        event.color || "bg-blue-100 text-blue-800",
                      )}
                      onClick={(e) => handleEventClick(event, e)}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-muted-foreground">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render the week view
  const renderWeekView = () => {
    const days = getDays()

    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 border-r"></div>
          {days.map((day, index) => (
            <div key={index} className={cn("p-2 text-center", isToday(day) && "bg-blue-50 font-bold")}>
              <div className="font-medium">{format(day, "EEE")}</div>
              <div className={cn("text-2xl", isToday(day) && "text-blue-600")}>{format(day, "d")}</div>
            </div>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-8 h-[1440px]">
            {" "}
            {/* 24 hours * 60px per hour */}
            <div className="border-r">
              {hours.map((hour) => (
                <div key={hour} className="h-[60px] border-b relative">
                  <span className="absolute -top-3 left-2 text-xs text-muted-foreground">
                    {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                  </span>
                </div>
              ))}
            </div>
            {days.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day)

              return (
                <div key={dayIndex} className="relative border-r">
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="h-[60px] border-b hover:bg-muted/20 cursor-pointer"
                      onClick={() => handleTimeSlotClick(day, hour)}
                    ></div>
                  ))}

                  {dayEvents.map((event, eventIndex) => {
                    const { top, height } = getEventPosition(event)

                    return (
                      <TooltipProvider key={eventIndex}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "absolute left-0 right-0 mx-1 p-1 rounded text-xs overflow-hidden",
                                event.color || "bg-blue-100 text-blue-800",
                              )}
                              style={{
                                top: top,
                                height: height,
                                minHeight: "20px",
                              }}
                              onClick={(e) => handleEventClick(event, e)}
                            >
                              <div className="font-medium">{event.title}</div>
                              <div>
                                {format(parseISO(event.start.toString()), "h:mm a")} -{" "}
                                {format(parseISO(event.end.toString()), "h:mm a")}
                              </div>
                              <div>{event.section}</div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="font-bold">{event.title}</div>
                            <div>
                              {format(parseISO(event.start.toString()), "h:mm a")} -{" "}
                              {format(parseISO(event.end.toString()), "h:mm a")}
                            </div>
                            <div>Section: {event.section}</div>
                            <div>Booked by: {event.bookedBy}</div>
                            {event.description && <div>{event.description}</div>}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Render the day view
  const renderDayView = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 text-center border-b">
          <div className="font-medium">{format(internalCurrentDate, "EEEE")}</div>
          <div className="text-2xl font-bold">{format(internalCurrentDate, "MMMM d, yyyy")}</div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 h-[1440px]">
            {" "}
            {/* 24 hours * 60px per hour */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-[60px] border-b relative hover:bg-muted/20 cursor-pointer"
                onClick={() => handleTimeSlotClick(internalCurrentDate, hour)}
              >
                <span className="absolute top-0 left-2 -translate-y-1/2 text-xs text-muted-foreground bg-background px-1">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </span>
              </div>
            ))}
            {getEventsForDay(internalCurrentDate).map((event, eventIndex) => {
              const { top, height } = getEventPosition(event)

              return (
                <TooltipProvider key={eventIndex}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "absolute left-16 right-4 p-2 rounded",
                          event.color || "bg-blue-100 text-blue-800",
                        )}
                        style={{
                          top: top,
                          height: height,
                          minHeight: "20px",
                        }}
                        onClick={(e) => handleEventClick(event, e)}
                      >
                        <div className="font-medium">{event.title}</div>
                        <div>
                          {format(parseISO(event.start.toString()), "h:mm a")} -{" "}
                          {format(parseISO(event.end.toString()), "h:mm a")}
                        </div>
                        <div>{event.section}</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="font-bold">{event.title}</div>
                      <div>
                        {format(parseISO(event.start.toString()), "h:mm a")} -{" "}
                        {format(parseISO(event.end.toString()), "h:mm a")}
                      </div>
                      <div>Section: {event.section}</div>
                      <div>Booked by: {event.bookedBy}</div>
                      {event.description && <div>{event.description}</div>}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="flex flex-col h-[700px]">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={next}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={today}>
            Today
          </Button>
          <h2 className="text-xl font-bold ml-4">
            {view === "day"
              ? format(internalCurrentDate, "MMMM d, yyyy")
              : view === "week"
                ? `${format(startOfWeek(internalCurrentDate, { weekStartsOn: 0 }), "MMM d")} - ${format(endOfWeek(internalCurrentDate, { weekStartsOn: 0 }), "MMM d, yyyy")}`
                : format(internalCurrentDate, "MMMM yyyy")}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant={view === "day" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setView("day")}
            >
              Day
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setView("week")}
            >
              Week
            </Button>
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              className="rounded-none"
              onClick={() => setView("month")}
            >
              Month
            </Button>
          </div>
          <Button className ="bg-red-500 p-4" size="sm" onClick={() => onAddEvent?.(startOfDay(new Date()), addHours(startOfDay(new Date()), 1))}>
            <Plus className="h-4 w-4 mr-1 " /> Add Event
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        {view === "month" && renderMonthView()}
        {view === "week" && renderWeekView()}
        {view === "day" && renderDayView()}
      </div>
    </Card>
  )
}

