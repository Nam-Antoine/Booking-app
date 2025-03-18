"use client"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CalendarEvent } from "./interactive-calendar"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  section: z.string({
    required_error: "Please select a section.",
  }),
  start: z.string(),
  end: z.string(),
  bookedBy: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
})

type EventDialogProps = {
  event?: CalendarEvent
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (event: Omit<CalendarEvent, "id" | "color">) => void
  onDelete?: () => void
  startTime?: Date
  endTime?: Date
  rooms?: { id: number; name: string }[]
  sections?: { id: number; name: string }[]
}

export function EventDialog({
  event,
  open,
  onOpenChange,
  onSave,
  onDelete,
  startTime,
  endTime,
  rooms = [],
  sections = [],
}: EventDialogProps) {
  // Use sections if provided, otherwise use rooms
  const sectionOptions = sections.length > 0 ? sections : rooms
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      section: event?.section || "",
      start: event?.start
        ? format(new Date(event.start), "yyyy-MM-dd'T'HH:mm")
        : startTime
          ? format(startTime, "yyyy-MM-dd'T'HH:mm")
          : "",
      end: event?.end
        ? format(new Date(event.end), "yyyy-MM-dd'T'HH:mm")
        : endTime
          ? format(endTime, "yyyy-MM-dd'T'HH:mm")
          : "",
      bookedBy: event?.bookedBy || "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
      title: values.title,
      description: values.description,
      section: values.section,
      start: new Date(values.start),
      end: new Date(values.end),
      bookedBy: values.bookedBy,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Booking" : "New Booking"}</DialogTitle>
          <DialogDescription>
            {event ? "Update the details of your room booking." : "Add a new room booking to the calendar."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Meeting title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Meeting details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="section"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a section" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sectionOptions.map((section) => (
                        <SelectItem key={section.id} value={section.name}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bookedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Booked By</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              {event && onDelete && (
                <Button type="button" variant="destructive" onClick={onDelete} className="mr-auto">
                  Delete
                </Button>
              )}
              <Button type="submit">{event ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

