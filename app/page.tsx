"use client"

import type * as React from "react"
import { useCallback, useMemo, useState } from "react"
import {
  CalendarIcon,
  Clock,
  Facebook,
  FileText,
  Filter,
  Grid,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react"
import { format, setHours, setMinutes } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { InteractiveCalendar, type CalendarEvent } from "@/components/interactive-calendar"
import { EventDialog } from "@/components/event-dialog"
import { useRouter } from "next/navigation"
import Image from "next/image"

// Sample data for rooms
const rooms = [
  {
    id: 1,
    name: "Lecture Hall A",
    capacity: 120,
    features: ["Projector", "Audio System", "Whiteboard"],
    location: "Main Building, Floor 1",
    availability: "Available",
    image: "/placeholder.svg?height=100&width=200",
    type: "Lecture Hall",
  },
  {
    id: 2,
    name: "Seminar Room B",
    capacity: 40,
    features: ["Smart Board", "Video Conference"],
    location: "Science Block, Floor 2",
    availability: "Booked",
    image: "/placeholder.svg?height=100&width=200",
    type: "Seminar Room",
  },
  {
    id: 3,
    name: "Computer Lab C",
    capacity: 30,
    features: ["30 Computers", "Projector", "Printer"],
    location: "Technology Wing, Floor 1",
    availability: "Available",
    image: "/placeholder.svg?height=100&width=200",
    type: "Computer Lab",
  },
  {
    id: 4,
    name: "Study Room D",
    capacity: 15,
    features: ["Whiteboard", "Round Table"],
    location: "Library, Floor 3",
    availability: "Available",
    image: "/placeholder.svg?height=100&width=200",
    type: "Study Room",
  },
]

// Sample data for initial calendar events
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
    id: "2",
    title: "Literature Seminar",
    description: "Modern Poetry Analysis",
    start: new Date(2025, 2, 14, 13, 0), // March 14, 2025, 1:00 PM
    end: new Date(2025, 2, 14, 15, 0), // March 14, 2025, 3:00 PM
    section: "Seminar Room B",
    bookedBy: "Prof. Johnson",
    color: "bg-green-100 text-green-800",
  },
  {
    id: "3",
    title: "Programming Workshop",
    description: "Introduction to React",
    start: new Date(2025, 2, 16, 10, 0), // March 16, 2025, 10:00 AM
    end: new Date(2025, 2, 16, 12, 0), // March 16, 2025, 12:00 PM
    section: "Computer Lab C",
    bookedBy: "Ms. Williams",
    color: "bg-purple-100 text-purple-800",
  },
  {
    id: "4",
    title: "Study Group",
    description: "Calculus Exam Preparation",
    start: new Date(2025, 2, 17, 14, 0), // March 17, 2025, 2:00 PM
    end: new Date(2025, 2, 17, 16, 0), // March 17, 2025, 4:00 PM
    section: "Study Room D",
    bookedBy: "John Student",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    id: "5",
    title: "Faculty Meeting",
    description: "Semester Planning",
    start: new Date(2025, 2, 18, 9, 0), // March 18, 2025, 9:00 AM
    end: new Date(2025, 2, 18, 10, 30), // March 18, 2025, 10:30 AM
    section: "Seminar Room B",
    bookedBy: "Dean Roberts",
    color: "bg-red-100 text-red-800",
  },
]

// Move AppSidebar outside the main component to prevent unnecessary re-renders
function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image src="/Icon-Truong-Dai-hoc-Khoa-hoc-va-Cong-nghe-Ha-Noi.png" width={32} height={100} alt="University Logo" />
          <span className="text-lg font-bold text-[32px]"><span className="text-blue-900">UI</span><span className="text-red-600">H</span></span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <a href="/" >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Calendar</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/my-bookings">
                    <Clock className="h-4 w-4" />
                    <span>My Bookings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/rooms">
                    <MapPin className="h-4 w-4" />
                    <span>All Sections</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/booking">
                    <Plus className="h-4 w-4" />
                    <span>New Booking</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/profile">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-2 rounded-lg bg-muted p-4">
          <div className="flex-1">
            <h4 className="text-sm font-semibold">Contact</h4>
          </div>
          <div className="flex gap-2 justify-start">
            <a href="https://www.facebook.com/USTHInnovationHubUIH?locale=vi_VN" className="text-primary hover:text-primary/80 " title="Facebook">
            <Image src="/UIH-logo.jpg" className="rounded-full" width={32} height={100} alt="UIH Logo" />

            </a>
            <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fblog.usthcodersclub.com%2F%3Ffbclid%3DIwZXh0bgNhZW0CMTAAAR3wLdvLPfmvWdAQC1Lz7rE5m2qNwiNmJtzqEdXqptd-BkLC43w6MUgL5og_aem_bLdiA2nREYUjfX4id93_RA&h=AT2Tj403uUFyIMqJ0lcSZpQfkeXotKnDhAtUDG0URezSMlWF7eovR-RmqhfRqfrKYpRPBnR9Aj8aesclrX_GPlwyk7c8ycWAXuj2wYtW-P8n9n96UZUzb9ldTu3cZw-DwGIl_A" className="text-primary hover:text-primary/80" title="Blog">
            <Image src="/UCC-logo.jpg" className="rounded-full" width={32} height={100} alt="UCC Logo" />
            </a>
            <a href="https://www.facebook.com/USTH.Coders.Club?locale=vi_VN" className="text-primary hover:text-primary/80" title="Blog">
            <Image src="/Facebook_Logo_Primary.png" className="rounded-full" width={32} height={100} alt="FB Logo" />
            </a>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default function RoomBookingSystem() {
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newEventTimes, setNewEventTimes] = useState<{ start: Date; end: Date } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Handle event click with useCallback
  const handleEventClick = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setDialogOpen(true)
  }, [])

  // Handle date/time slot click for new event with useCallback
  const handleAddEvent = useCallback((start: Date, end: Date) => {
    setSelectedEvent(undefined)
    setNewEventTimes({ start, end })
    setDialogOpen(true)
  }, [])

  // Save event (create or update) with useCallback
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

  // Delete event with useCallback
  const handleDeleteEvent = useCallback(() => {
    if (selectedEvent) {
      setEvents((prev) => prev.filter((event) => event.id !== selectedEvent.id))
      setDialogOpen(false)
    }
  }, [selectedEvent])

  // Edit event with useCallback
  const handleEditEvent = useCallback((event: CalendarEvent) => {
    setSelectedEvent(event)
    setDialogOpen(true)
  }, [])

  // Filter rooms based on search query with useMemo
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (!searchQuery) return true

      const query = searchQuery.toLowerCase()
      return (
        room.name.toLowerCase().includes(query) ||
        (room.type || "").toLowerCase().includes(query) ||
        room.location.toLowerCase().includes(query) ||
        room.features.some((feature) => feature.toLowerCase().includes(query))
      )
    })
  }, [searchQuery])

  // Handle search input change with useCallback
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  // Clear search with useCallback
  const clearSearch = useCallback(() => {
    setSearchQuery("")
  }, [])

  const userBookings = useMemo(() => {
    return events.filter((event) => event.bookedBy === "Dr. Smith")
  }, [events])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 bg-zinc-100">
            <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Room Booking System</h1>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full bg-muted pl-9 rounded-full border-none bg-transparnet"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full ">
                      <Avatar className="border-2 outline-zinc-200">
                        <AvatarImage src="/UCC-logo.jpg" alt="User" />
                        <AvatarFallback>UCC</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/my-bookings")}>My Bookings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[32px] text-blue-900">Dashboard</h2>
                <p className="text-muted-foreground">Manage your room bookings and reservations.</p>
              </div>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(newDate) => {
                        setDate(newDate)
                        // Close the popover after selection
                        const popoverCloseEvent = new CustomEvent("popover-close")
                        document.dispatchEvent(popoverCloseEvent)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button className="bg-blue-700" onClick={() => router.push("/booking")}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Booking
                </Button>
              </div>
            </div>
            <Separator className="my-6" />
            <Tabs defaultValue="calendar" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="calendar" className="text-red-600" >Calendar</TabsTrigger>
                  <TabsTrigger value="rooms" className="text-red-600">Rooms</TabsTrigger>
                  <TabsTrigger value="bookings" className="text-red-600">
                    My Bookings
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="calendar" className="space-y-6">
                <InteractiveCalendar
                  events={events}
                  onEventClick={handleEventClick}
                  onAddEvent={handleAddEvent}
                  currentDate={date || new Date()}
                />
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
              </TabsContent>
              <TabsContent value="rooms" className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Available Rooms</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setViewMode("grid")}>
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setViewMode("list")}>
                      <List className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="flex gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
                <div
                  className={
                    viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"
                  }
                >
                  {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) =>
                      viewMode === "grid" ? (
                        <Card key={room.id} className="flex flex-col h-full relative">
                          <CardHeader className="p-4">
                            <img
                              src={room.image || "/placeholder.svg"}
                              alt={room.name}
                              className="h-40 w-full rounded-md object-cover"
                            />
                          </CardHeader>
                          <CardContent className="flex-1 p-4 pb-16">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg">{room.name}</CardTitle>
                                <CardDescription className="flex items-center gap-1 mt-1">
                                  <MapPin className="h-3 w-3" /> {room.location}
                                </CardDescription>
                              </div>
                              <Badge variant={room.availability === "Available" ? "outline" : "secondary"}>
                                {room.availability}
                              </Badge>
                            </div>
                            <div className="mt-2 text-sm">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" /> Capacity: {room.capacity}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {room.features.map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                          <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
                            <Button
                              className="w-full"
                              onClick={() =>
                                handleAddEvent(
                                  setHours(setMinutes(new Date(), 0), 9),
                                  setHours(setMinutes(new Date(), 0), 10),
                                )
                              }
                            >
                              Book Room
                            </Button>
                          </div>
                        </Card>
                      ) : (
                        <Card key={room.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <img
                                src={room.image || "/placeholder.svg"}
                                alt={room.name}
                                className="h-20 w-20 rounded-md object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-lg">{room.name}</CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                      <MapPin className="h-3 w-3" /> {room.location}
                                    </CardDescription>
                                  </div>
                                  <Badge variant={room.availability === "Available" ? "outline" : "secondary"}>
                                    {room.availability}
                                  </Badge>
                                </div>
                                <div className="mt-2 text-sm">
                                  <div className="flex items-center gap-1">
                                    <User className="h-3 w-3" /> Capacity: {room.capacity}
                                  </div>
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {room.features.map((feature, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={() =>
                                  handleAddEvent(
                                    setHours(setMinutes(new Date(), 0), 9),
                                    setHours(setMinutes(new Date(), 0), 10),
                                  )
                                }
                              >
                                Book Room
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ),
                    )
                  ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-muted-foreground">No rooms match your search.</p>
                      <Button variant="outline" onClick={clearSearch} className="mt-2">
                        Clear Search
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="bookings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>My Bookings</CardTitle>
                    <CardDescription>View and manage your room bookings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userBookings.map((event) => (
                        <Card
                          key={event.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleEditEvent(event)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-full bg-primary/10 text-primary">
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
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditEvent(event)
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-pencil"
                                  >
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                  </svg>
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive/90"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedEvent(event)
                                    handleDeleteEvent()
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-trash-2"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                    <line x1="10" x2="10" y1="11" y2="17" />
                                    <line x1="14" x2="14" y1="11" y2="17" />
                                  </svg>
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>


          <footer className="border-t p-6 bg-zinc-100">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-muted-foreground">© 2025 UCC. All rights reserved.</p>
              <div className="flex gap-4 justify-start">
                <Button variant="ghost" size="sm">
                  Terms
                </Button>
                <Button variant="ghost" size="sm">
                  Privacy
                </Button>
                <Button variant="ghost" size="sm">
                  Feedback
                </Button>
                <Button variant="ghost" size="sm">
                  Help
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

