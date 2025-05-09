import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CardTitle, CardDescription } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Send, Mail, Clock, X, CalendarClock } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { toast } from '@/hooks/use-toast'

// --- SCHEMA ---
const emailSchema = z.object({
    to: z.string().email({ message: 'Invalid email address' }),
    subject: z.string().min(1, { message: 'Subject is required' }),
    body: z.string().min(1, { message: 'Message is required' }),
    scheduleDate: z.string().optional(),
    scheduleTime: z.string().optional(),
})

type EmailFormData = z.infer<typeof emailSchema>

const sendEmail = async (data: EmailFormData & { scheduleDateTime?: string }) => {

    console.log(data);

    const response = await fetch('http://localhost:8080/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error('Failed to send email')
    }

    return response.json()
}

export default function EmailScheduler() {

    const [open, setOpen] = useState(false)
    const [showScheduleOptions, setShowScheduleOptions] = useState(false)

    const form = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        mode: "onChange"
    })

    const mutation = useMutation({
        mutationFn: sendEmail,
        onSuccess: (data) => {
            console.log(data);
            toast({
                title: 'Email Scheduled',
                description: data.message || 'Your email has been successfully scheduled.',
            })
            setOpen(false)
            form.reset()
            setShowScheduleOptions(false)
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: 'Failed to Schedule Email',
                description: error instanceof Error ? error.message : 'An unexpected error occurred',
            })
        },
    })

    const onSubmit = (data: EmailFormData) => {
        let scheduleDateTime: string | undefined

        if (showScheduleOptions && data.scheduleDate && data.scheduleTime) {
            scheduleDateTime = new Date(`${data.scheduleDate}T${data.scheduleTime}`).toISOString()
        }

        mutation.mutate({ ...data, scheduleDateTime })
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <button className="px-3 py-1.5 text-sm rounded-md flex items-center gap-1.5 transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                    <CalendarClock className="h-4 w-4" />
                    <span>Scheduler</span>
                </button>
            </SheetTrigger>
            <SheetContent>
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 p-2 rounded-full">
                            <Mail className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Email Scheduler</CardTitle>
                            <CardDescription className="text-gray-500">
                                Create and schedule emails easily
                            </CardDescription>
                        </div>
                    </div>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5 py-2 px-4">
                    {/* To */}
                    <div className="grid gap-2">
                        <Label htmlFor="to">To</Label>
                        <Input id="to" type="email" {...form.register('to')} />
                        {form.formState.errors.to && (
                            <span className="text-sm text-red-500">{form.formState.errors.to.message}</span>
                        )}
                    </div>

                    {/* Subject */}
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" {...form.register('subject')} />
                        {form.formState.errors.subject && (
                            <span className="text-sm text-red-500">{form.formState.errors.subject.message}</span>
                        )}
                    </div>

                    {/* Message */}
                    <div className="grid gap-2">
                        <Label htmlFor="body">Message</Label>
                        <Textarea id="body" {...form.register('body')} className="min-h-32 resize-y" />
                        {form.formState.errors.body && (
                            <span className="text-sm text-red-500">{form.formState.errors.body.message}</span>
                        )}
                    </div>

                    {/* Schedule Section */}
                    {showScheduleOptions ? (
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center">
                                    <Clock className="h-4 w-4 text-blue-600 mr-2" />
                                    <span className="text-sm font-medium text-blue-800">Schedule for later</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-6 w-6 p-0"
                                    onClick={() => setShowScheduleOptions(false)}
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor="scheduleDate" className="text-xs text-gray-700">
                                        Date
                                    </Label>
                                    <Input
                                        id="scheduleDate"
                                        type="date"
                                        className="h-8 text-sm"
                                        {...form.register('scheduleDate')}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="scheduleTime" className="text-xs text-gray-700">
                                        Time
                                    </Label>
                                    <Input
                                        id="scheduleTime"
                                        type="time"
                                        className="h-8 text-sm"
                                        {...form.register('scheduleTime')}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            variant="outline"
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            onClick={() => setShowScheduleOptions(true)}
                        >
                            <Clock className="h-4 w-4 mr-2" />
                            Schedule for later
                        </Button>
                    )}

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <Button type="button" variant="outline" disabled={mutation.isPending}>
                            Save Draft
                        </Button>
                        <Button type="submit" disabled={mutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {mutation.isPending ? (
                                'Sending...'
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Send className="h-4 w-4" /> Send
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
