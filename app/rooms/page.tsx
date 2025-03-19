"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Filter, LayoutGrid, List, MapPin, Search, User, X } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample data for rooms
const allRooms = [
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
  {
    id: 5,
    name: "Lecture Hall B",
    capacity: 90,
    features: ["Projector", "Audio System", "Document Camera"],
    location: "Main Building, Floor 2",
    availability: "Available",
    image: "/placeholder.svg?height=100&width=200",
    type: "Lecture Hall",
  },
  {
    id: 6,
    name: "Seminar Room A",
    capacity: 35,
    features: ["Projector", "Whiteboard"],
    location: "Humanities Block, Floor 1",
    availability: "Available",
    image: "/placeholder.svg?height=100&width=200",
    type: "Seminar Room",
  },
  {
    id: 7,
    name: "Computer Lab A",
    capacity: 25,
    features: ["25 Computers", "Smart Board"],
    location: "Technology Wing, Floor 2",
    availability: "Booked",
    image: "/placeholder.svg?height=100&width=200",
    type: "Computer Lab",
  },
  {
    id: 8,
    name: "Study Room E",
    capacity: 10,
    features: ["Whiteboard", "Quiet Space"],
    location: "Library, Floor 2",
    availability: "Available",
    image: "/placeholder.svg?height=100&width=200",
    type: "Study Room",
  },
]

// Get all unique room types, features, and locations
const allRoomTypes = Array.from(new Set(allRooms.map((room) => room.type)))
const allFeatures = Array.from(new Set(allRooms.flatMap((room) => room.features)))
const allLocations = Array.from(new Set(allRooms.map((room) => room.location)))

export default function AllRoomsPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [availabilityFilter, setAvailabilityFilter] = React.useState<string | null>(null)
  const [capacityFilter, setCapacityFilter] = React.useState<string | null>(null)
  const [roomTypeFilter, setRoomTypeFilter] = React.useState<string | null>(null)
  const [locationFilter, setLocationFilter] = React.useState<string | null>(null)
  const [featureFilters, setFeatureFilters] = React.useState<string[]>([])
  const [filterSheetOpen, setFilterSheetOpen] = React.useState(false)

  // Function to handle booking a room
  const handleBookRoom = (roomId: number) => {
    // In a real app, this would navigate to a booking page or open a dialog
    // For now, we'll just simulate creating a new booking
    alert(`Room ${roomId} booked successfully!`)
  }

  // Apply filters to rooms
  const filteredRooms = allRooms.filter((room) => {
    // Search query filter - check name, type, location, and features
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = room.name.toLowerCase().includes(query)
      const matchesType = room.type.toLowerCase().includes(query)
      const matchesLocation = room.location.toLowerCase().includes(query)
      const matchesFeatures = room.features.some((feature) => feature.toLowerCase().includes(query))

      if (!matchesName && !matchesType && !matchesLocation && !matchesFeatures) {
        return false
      }
    }

    // Availability filter
    if (availabilityFilter && room.availability !== availabilityFilter) {
      return false
    }

    // Capacity filter
    if (capacityFilter) {
      const capacity = Number.parseInt(capacityFilter)
      if (capacityFilter === "10-" && room.capacity >= 10) return false
      if (capacityFilter === "10-30" && (room.capacity < 10 || room.capacity > 30)) return false
      if (capacityFilter === "30-60" && (room.capacity < 30 || room.capacity > 60)) return false
      if (capacityFilter === "60+" && room.capacity < 60) return false
    }

    // Room type filter
    if (roomTypeFilter && room.type !== roomTypeFilter) {
      return false
    }

    // Location filter
    if (locationFilter && room.location !== locationFilter) {
      return false
    }

    // Features filter
    if (featureFilters.length > 0) {
      for (const feature of featureFilters) {
        if (!room.features.includes(feature)) {
          return false
        }
      }
    }

    return true
  })

  // Toggle feature in filter
  const toggleFeature = (feature: string) => {
    setFeatureFilters(
      featureFilters.includes(feature) ? featureFilters.filter((f) => f !== feature) : [...featureFilters, feature],
    )
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setAvailabilityFilter(null)
    setCapacityFilter(null)
    setRoomTypeFilter(null)
    setLocationFilter(null)
    setFeatureFilters([])
  }

  // Apply filters
  const applyFilters = () => {
    setFilterSheetOpen(false)
  }

  // Function to render filter badges
  const renderFilterBadges = () => {
    const badges = []

    if (availabilityFilter) {
      badges.push(
        <Badge key="availability" variant="outline" className="flex items-center gap-1">
          {availabilityFilter}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setAvailabilityFilter(null)} />
        </Badge>,
      )
    }

    if (capacityFilter) {
      const capacityText = {
        "10-": "Under 10",
        "10-30": "10-30",
        "30-60": "30-60",
        "60+": "Over 60",
      }[capacityFilter]

      badges.push(
        <Badge key="capacity" variant="outline" className="flex items-center gap-1">
          Capacity: {capacityText}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setCapacityFilter(null)} />
        </Badge>,
      )
    }

    if (roomTypeFilter) {
      badges.push(
        <Badge key="roomType" variant="outline" className="flex items-center gap-1">
          {roomTypeFilter}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setRoomTypeFilter(null)} />
        </Badge>,
      )
    }

    if (locationFilter) {
      badges.push(
        <Badge key="location" variant="outline" className="flex items-center gap-1">
          {locationFilter.split(",")[0]}
          <X className="h-3 w-3 cursor-pointer" onClick={() => setLocationFilter(null)} />
        </Badge>,
      )
    }

    featureFilters.forEach((feature) => {
      badges.push(
        <Badge key={feature} variant="outline" className="flex items-center gap-1">
          {feature}
          <X className="h-3 w-3 cursor-pointer" onClick={() => toggleFeature(feature)} />
        </Badge>,
      )
    })

    return badges
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="mr-2">
          <LayoutGrid className="h-5 w-5" />
        </Button>
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold ">All Sections</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-muted pl-9 rounded-full border-none"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>My Bookings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-blue-900">All Sections</h2>
            <p className="text-muted-foreground">Browse and filter available sections for booking.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Filter Sections</SheetTitle>
                  <SheetDescription>Filter sections by availability, capacity, type, and features.</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select
                      value={availabilityFilter || "any"}
                      onValueChange={(value) => setAvailabilityFilter(value === "any" ? null : value)}
                    >
                      <SelectTrigger id="availability">
                        <SelectValue placeholder="Any availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any availability</SelectItem>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Booked">Booked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Select
                      value={capacityFilter || "any"}
                      onValueChange={(value) => setCapacityFilter(value === "any" ? null : value)}
                    >
                      <SelectTrigger id="capacity">
                        <SelectValue placeholder="Any capacity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any capacity</SelectItem>
                        <SelectItem value="10-">Under 10</SelectItem>
                        <SelectItem value="10-30">10-30</SelectItem>
                        <SelectItem value="30-60">30-60</SelectItem>
                        <SelectItem value="60+">Over 60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="roomType">Section Type</Label>
                    <Select
                      value={roomTypeFilter || "any"}
                      onValueChange={(value) => setRoomTypeFilter(value === "any" ? null : value)}
                    >
                      <SelectTrigger id="roomType">
                        <SelectValue placeholder="Any room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any section type</SelectItem>
                        {allRoomTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select
                      value={locationFilter || "any"}
                      onValueChange={(value) => setLocationFilter(value === "any" ? null : value)}
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Any location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any location</SelectItem>
                        {allLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label>Features</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {allFeatures.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            id={`feature-${feature}`}
                            checked={featureFilters.includes(feature)}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <label
                            htmlFor={`feature-${feature}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {feature}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button onClick={applyFilters}>Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Filter badges */}
        {(availabilityFilter || capacityFilter || roomTypeFilter || locationFilter || featureFilters.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {renderFilterBadges()}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
              Clear All
            </Button>
          </div>
        )}

        {/* Room count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRooms.length} of {allRooms.length} sections
          </p>
        </div>

        {/* Rooms grid or list */}
        <div className={viewMode === "grid" ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "space-y-4"}>
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
                      onClick={() => handleBookRoom(room.id)}
                      disabled={room.availability !== "Available"}
                    >
                      {room.availability === "Available" ? "Book Section" : "Unavailable"}
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
                      <Button onClick={() => handleBookRoom(room.id)} disabled={room.availability !== "Available"}>
                        {room.availability === "Available" ? "Book Section" : "Unavailable"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ),
            )
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No sections match your filters.</p>
              <Button variant="outline" onClick={clearFilters} className="mt-2">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
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
  )
}

